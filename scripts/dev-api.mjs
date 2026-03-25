// Local dev server that mimics the public Vercel serverless form endpoints.
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

createServer(async (req, res) => {
  // Allow requests from the local Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST' || !['/api/send', '/api/newsletter'].includes(req.url)) {
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
  console.log('   Handling: POST /api/send, POST /api/newsletter');
});
