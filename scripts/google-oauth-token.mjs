// Regenerate the single-user Google Calendar OAuth refresh token used by the
// booking backend (api/booking/_lib/google-calendar.ts).
//
// Why you're here: /api/booking/availability returns 502 "Calendar unavailable"
// because the Google OAuth refresh returns `invalid_grant` — the stored
// GOOGLE_OAUTH_REFRESH_TOKEN is expired or revoked. Refresh tokens expire after
// 7 days while the OAuth consent screen is in "Testing" mode, so also set the
// consent screen to "In production" to stop this from recurring.
//
// Usage:
//   node scripts/google-oauth-token.mjs
//
// Prereqs:
//   - GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET set in .env.local.
//   - The redirect URI below must be authorized on the OAuth client:
//       * "Desktop app" client type: any http://localhost:<port> is allowed.
//       * "Web application" client type: add exactly
//         http://localhost:4390/oauth2callback
//         under "Authorized redirect URIs" in Google Cloud Console.
//
// After it prints a refresh token, paste it into GOOGLE_OAUTH_REFRESH_TOKEN in
// .env.local AND in the Vercel project env (Production/Preview), then redeploy.

import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';

// The redirect URI MUST be one authorized on the OAuth client. Override it to
// reuse a URI you already registered, e.g.:
//   OAUTH_REDIRECT_URI="http://localhost:8080/callback" node scripts/google-oauth-token.mjs
const REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URI || 'http://localhost:4390/oauth2callback';
const REDIRECT = new URL(REDIRECT_URI);
const PORT = Number(REDIRECT.port) || 80;
const CALLBACK_PATH = REDIRECT.pathname;
const SCOPE = 'https://www.googleapis.com/auth/calendar';

function loadEnvLocal() {
  const env = {};
  try {
    for (const line of readFileSync('.env.local', 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    // fall back to process.env below
  }
  return env;
}

const env = loadEnvLocal();
const CLIENT_ID = env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET in .env.local');
  process.exit(1);
}

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // force a fresh refresh_token every run
  }).toString();

async function exchangeCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

const server = createServer(async (req, res) => {
  if (!req.url.startsWith(CALLBACK_PATH)) {
    res.writeHead(404).end();
    return;
  }
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end(`OAuth error: ${error}`);
    console.error(`\n❌ OAuth error: ${error}`);
    server.close();
    process.exit(1);
  }

  try {
    const tokens = await exchangeCode(code);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(
      '<h2>✅ Done — you can close this tab and return to the terminal.</h2>',
    );
    console.log('\n✅ Success.');
    if (tokens.refresh_token) {
      // Write it straight into .env.local so there is no copy-paste mistake
      // (an authorization code `4/0A...` is NOT a refresh token `1//...`).
      try {
        const contents = readFileSync('.env.local', 'utf-8');
        const line = `GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`;
        const updated = /^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m.test(contents)
          ? contents.replace(/^GOOGLE_OAUTH_REFRESH_TOKEN=.*$/m, line)
          : contents.replace(/\n?$/, `\n${line}\n`);
        writeFileSync('.env.local', updated);
        console.log('   → Written to .env.local (GOOGLE_OAUTH_REFRESH_TOKEN).');
      } catch (e) {
        console.log('   ⚠️  Could not write .env.local:', e.message);
      }
      console.log('\nAlso set this in the Vercel project env (Production + Preview), then redeploy:');
      console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('\nThen restart `vercel dev` so it reloads .env.local.');
    } else {
      console.log(
        '⚠️  No refresh_token returned (only an access token). Revoke prior access at ' +
          'https://myaccount.google.com/permissions and run again — prompt=consent is set to force one.',
      );
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end(String(err));
    console.error('\n❌', err.message);
  } finally {
    server.close();
    setTimeout(() => process.exit(0), 250);
  }
});

server.listen(PORT, () => {
  console.log('🔑 Google Calendar refresh-token helper');
  console.log(`   Redirect URI (must be authorized on the client): ${REDIRECT_URI}\n`);
  console.log('Opening the consent screen in your browser. If it does not open, visit:\n');
  console.log(authUrl + '\n');
  // Best-effort auto-open (macOS `open`, Linux `xdg-open`).
  const opener = process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(opener, [authUrl], { stdio: 'ignore', detached: true }).on('error', () => {});
});
