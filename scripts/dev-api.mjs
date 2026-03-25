// Local dev server that mimics the /api/send Vercel serverless function.
// Run with: node scripts/dev-api.mjs
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Resend } from 'resend';
import contactMailer from '../api/_shared/contact-mailer.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;

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

createServer(async (req, res) => {
  // Allow requests from the local Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST' || req.url !== '/api/send') {
    res.writeHead(404).end();
    return;
  }

  let rawBody;
  try {
    rawBody = await readJsonBody(req);
  } catch (error) {
    console.error('❌ Invalid JSON body:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }));
    return;
  }

  const validation = validateContactPayload(rawBody);
  if (!validation.ok) {
    res.writeHead(validation.error.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: validation.error.message }));
    return;
  }

  const { data } = validation;
  console.log(`📨 Received — lang: "${data.lang}", intent: "${data.intent}", name: "${data.name}"`);

  try {
    const result = await sendContactEmails(resend, data);

    if (result.error) {
      console.error('Resend error:', result.error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: contactApiErrors.sendFailed }));
      return;
    }

    console.log(`✅ Emails sent — internal + confirmation to ${data.email}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: contactApiErrors.serverError }));
  }
}).listen(3001, () => {
  console.log('🚀 API dev server running on http://localhost:3001');
  console.log('   Handling: POST /api/send');
});
