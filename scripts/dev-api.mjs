// Local dev server standing in for the Vercel serverless functions.
//
// The contact and newsletter endpoints are reimplemented here against the same
// shared modules the deployed handlers use. The booking endpoints are not
// reimplemented at all: they are the real `api/booking/*.ts` handlers, loaded
// through Vite's SSR pipeline, so local behaviour cannot drift from production.
//
// Run with: node scripts/dev-api.mjs
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Resend } from 'resend';
import contactMailer from '../api/_shared/contact-mailer.js';
import newsletterMailer from '../api/_shared/newsletter-mailer.js';
import recaptcha from '../api/_shared/recaptcha.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;
const { newsletterApiErrors, sendNewsletterEmail, validateNewsletterPayload } = newsletterMailer;
const { extractRemoteIp, verifyRecaptcha } = recaptcha;

// Manually load .env.local since Node does not process it automatically
const root = dirname(dirname(fileURLToPath(import.meta.url)));
try {
  const env = readFileSync(join(root, '.env.local'), 'utf-8');
  for (const line of env.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
} catch (e) {
  console.error('❌ Could not read .env.local:', e.message);
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY missing from .env.local');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function readJsonBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  if (!body.trim()) {
    return {};
  }

  return JSON.parse(body);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(payload));
}

function shouldSkipRecaptcha(req) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.origin ?? '');
}

function hasFilledHoneypot(body) {
  return typeof body?.website === 'string' && body.website.trim().length > 0;
}

// The real serverless handlers, by path and accepted method.
const BOOKING_ROUTES = {
  '/api/booking/availability': { module: '/api/booking/availability.ts', methods: ['GET'] },
  '/api/booking/lookup': { module: '/api/booking/lookup.ts', methods: ['GET'] },
  '/api/booking/create': { module: '/api/booking/create.ts', methods: ['POST'] },
  '/api/booking/cancel': { module: '/api/booking/cancel.ts', methods: ['POST'] },
  '/api/booking/reschedule': { module: '/api/booking/reschedule.ts', methods: ['POST'] },
  '/api/booking/health': { module: '/api/booking/health.ts', methods: ['GET'] },
};

/**
 * Lets Vite's SSR runner pull in the CommonJS modules under api/_shared.
 *
 * Those files are plain `module.exports` and the deployed functions reach them
 * through Node's own CJS interop. Vite's runner evaluates everything as ESM, so
 * it trips on `module`. Handing the file back to Node's `require` and
 * re-exporting keeps one copy of the module rather than a second, transpiled
 * one with its own rate-limit state.
 */
function commonJsInterop() {
  return {
    name: 'dev-api-commonjs-interop',
    enforce: 'pre',
    load(id) {
      if (!/api\/_shared\/[^/]+\.js$/.test(id)) return null;
      return [
        "import { createRequire } from 'module';",
        `const require = createRequire(${JSON.stringify(import.meta.url)});`,
        `export default require(${JSON.stringify(id)});`,
      ].join('\n');
    },
  };
}

// Vite is started on first use only: the contact endpoints do not need it, and
// spinning up the whole pipeline costs a second or two.
let vitePromise = null;
function getViteServer() {
  if (!vitePromise) {
    vitePromise = import('vite').then((vite) =>
      vite.createServer({
        root,
        configFile: false,
        plugins: [commonJsInterop()],
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'warn',
      }),
    );
  }
  return vitePromise;
}

/**
 * Gives a Node response the three extras the handlers expect from Vercel.
 *
 * Deliberately minimal: anything beyond `status`, `json` and `send` would be a
 * behaviour this shim invents, which is exactly what must not happen here.
 */
function asApiResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };
  res.send = (body) => {
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
  };
  return res;
}

/** Vercel hands handlers a flat query object; rebuild it from the URL. */
function asApiRequest(req, body) {
  const url = new URL(req.url, 'http://localhost');
  const query = {};
  for (const key of url.searchParams.keys()) {
    const all = url.searchParams.getAll(key);
    query[key] = all.length > 1 ? all : all[0];
  }
  req.query = query;
  req.body = body;
  return req;
}

async function handleBookingRoute(route, req, res) {
  if (!route.methods.includes(req.method)) {
    sendJson(res, 405, { success: false, message: 'Method not allowed' });
    return;
  }

  let body = {};
  if (req.method === 'POST') {
    try {
      body = await readJsonBody(req);
    } catch (error) {
      console.error('❌ Invalid JSON body:', error);
      sendJson(res, 400, { success: false, message: 'Invalid JSON body' });
      return;
    }
  }

  const vite = await getViteServer();
  const module = await vite.ssrLoadModule(route.module);
  await module.default(asApiRequest(req, body), asApiResponse(res));
}

createServer(async (req, res) => {
  // Allow requests from the local Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  const path = req.url.split('?')[0];
  const bookingRoute = BOOKING_ROUTES[path];
  if (bookingRoute) {
    try {
      await handleBookingRoute(bookingRoute, req, res);
    } catch (error) {
      // Path passed as an argument, never interpolated: it comes from the
      // request line, and console treats its first argument as a format string.
      console.error('❌ booking route failed:', path, error);
      if (!res.headersSent) sendJson(res, 500, { success: false, message: 'Server error' });
    }
    return;
  }

  res.setHeader('Allow', 'POST');
  if (req.method !== 'POST' || !['/api/send', '/api/newsletter'].includes(path)) {
    res.writeHead(404).end();
    return;
  }

  let rawBody;
  try {
    rawBody = await readJsonBody(req);
  } catch (error) {
    console.error('❌ Invalid JSON body:', error);
    sendJson(res, 400, { success: false, message: 'Invalid JSON body' });
    return;
  }

  if (hasFilledHoneypot(rawBody)) {
    console.warn(`🕳️ Honeypot triggered for ${req.url}`);
    sendJson(res, 200, { success: true });
    return;
  }

  if (!shouldSkipRecaptcha(req)) {
    const expectedAction = req.url === '/api/send' ? 'contact_form' : 'uc_newsletter';
    const remoteIp = extractRemoteIp(req.headers['x-forwarded-for']) || req.socket.remoteAddress || '';
    const recaptchaResult = await verifyRecaptcha({
      token: rawBody?.recaptchaToken,
      expectedAction,
      remoteIp,
    });

    if (!recaptchaResult.ok) {
      sendJson(res, recaptchaResult.status, { success: false, message: recaptchaResult.message });
      return;
    }
  }

  if (req.url === '/api/send') {
    const validation = validateContactPayload(rawBody);
    if (!validation.ok) {
      sendJson(res, validation.error.status, { success: false, message: validation.error.message });
      return;
    }

    const { data } = validation;
    console.log(`📨 Contact received — lang: "${data.lang}", intent: "${data.intent}", name: "${data.name}"`);

    try {
      const result = await sendContactEmails(resend, data);

      if (result.error) {
        console.error('Resend error:', result.error);
        sendJson(res, 500, { success: false, message: contactApiErrors.sendFailed });
        return;
      }

      console.log(`✅ Contact emails sent — internal + confirmation to ${data.email}`);
      sendJson(res, 200, { success: true });
      return;
    } catch (error) {
      console.error('Contact error:', error);
      sendJson(res, 500, { success: false, message: contactApiErrors.serverError });
      return;
    }
  }

  const validation = validateNewsletterPayload(rawBody);
  if (!validation.ok) {
    sendJson(res, validation.error.status, { success: false, message: validation.error.message });
    return;
  }

  try {
    const result = await sendNewsletterEmail(resend, validation.data);

    if (result.error) {
      console.error('Newsletter resend error:', result.error);
      sendJson(res, 500, { success: false, message: newsletterApiErrors.sendFailed });
      return;
    }

    console.log(`✅ Newsletter signup captured — ${validation.data.email}`);
    sendJson(res, 200, { success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    sendJson(res, 500, { success: false, message: newsletterApiErrors.serverError });
  }
}).listen(3001, () => {
  console.log('🚀 API dev server running on http://localhost:3001');
  console.log('   POST /api/send, POST /api/newsletter');
  console.log(`   ${Object.keys(BOOKING_ROUTES).join(', ')}`);
  console.log('   ⚠  Booking uses the real Google Calendar, D1 and Resend credentials from .env.local');
});
