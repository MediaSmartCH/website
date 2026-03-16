/**
 * Local dev server for API functions (replaces vercel dev).
 * Run with: node scripts/dev-api.mjs
 */
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { Resend } from 'resend';

// Load .env.local (path relative to project root)
const root = dirname(dirname(fileURLToPath(import.meta.url)));
try {
  const env = readFileSync(join(root, '.env.local'), 'utf-8');
  for (const line of env.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
} catch (e) {
  console.error('❌ Impossible de lire .env.local :', e.message);
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY manquant dans .env.local');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;

const i18n = {
  fr: {
    subject: (name) => `Nouveau message de ${name}`,
    confirmSubject: 'Votre message a bien été reçu — MediaSmart',
    headerTag: 'Nouveau message', headerSub: "Quelqu'un vous a contacté via le formulaire",
    intro: 'Bonjour, vous avez reçu un nouveau message depuis votre site :',
    labelName: 'Nom', labelEmail: 'Email', labelPhone: 'Téléphone', labelMessage: 'Message',
    phoneEmpty: 'Non renseigné',
    replyBtn: (name) => `Répondre à ${name} →`,
    autoNote: 'Ce message a été envoyé automatiquement via le formulaire de contact de',
    confirmHeaderTag: 'Message reçu', confirmHeaderSub: 'Merci de nous avoir contacté',
    confirmGreeting: (name) => `Bonjour ${name},`,
    confirmBody: "Nous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.",
    confirmCopy: 'Voici un récapitulatif de votre message :',
    confirmNote: "Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.",
    confirmFooter: "L'équipe MediaSmart",
  },
  en: {
    subject: (name) => `New message from ${name}`,
    confirmSubject: 'We received your message — MediaSmart',
    headerTag: 'New message', headerSub: 'Someone contacted you via the form',
    intro: 'Hello, you received a new contact message from your website:',
    labelName: 'Name', labelEmail: 'Email', labelPhone: 'Phone', labelMessage: 'Message',
    phoneEmpty: 'Not provided',
    replyBtn: (name) => `Reply to ${name} →`,
    autoNote: 'This message was sent automatically via the contact form of',
    confirmHeaderTag: 'Message received', confirmHeaderSub: 'Thank you for reaching out',
    confirmGreeting: (name) => `Hello ${name},`,
    confirmBody: 'We have received your message and appreciate you reaching out. Our team will get back to you as soon as possible.',
    confirmCopy: 'Here is a copy of your message:',
    confirmNote: 'This email was sent automatically, please do not reply directly.',
    confirmFooter: 'The MediaSmart Team',
  },
};

const buildInternalHtml = (t, name, email, phone, message) =>
`<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0f0e1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e1a;padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#5b4fcf,#7c3aed,#a855f7);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65);">${t.headerTag}</p>
<h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;">MediaSmart</h1>
<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.7);">${t.headerSub}</p>
</td></tr>
<tr><td style="background:#1a1830;padding:36px 40px;">
<p style="margin:0 0 28px;font-size:15px;color:#a0a3bf;line-height:1.6;">${t.intro}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;">${t.labelName}</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#e8e9f3;">${name}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #a855f7;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a855f7;">${t.labelEmail}</p>
<p style="margin:0;font-size:16px;font-weight:600;"><a href="mailto:${email}" style="color:#a78bfa;text-decoration:none;">${email}</a></p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6366f1;">${t.labelPhone}</p>
<p style="margin:0;font-size:16px;font-weight:600;">${phone ? `<a href="tel:${phone}" style="color:#a78bfa;text-decoration:none;">${phone}</a>` : `<span style="color:#5a5c7a;font-style:italic;">${t.phoneEmpty}</span>`}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr><td style="background:#22203a;border-left:3px solid #8b5cf6;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8b5cf6;">${t.labelMessage}</p>
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<a href="mailto:${email}" style="display:inline-block;background:linear-gradient(135deg,#5b4fcf,#a855f7);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:50px;">${t.replyBtn(name)}</a>
</td></tr></table>
</td></tr>
<tr><td style="background:#13112a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #2a2748;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#fff;">MediaSmart</p>
<p style="margin:0 0 12px;font-size:12px;color:#5a5c7a;">Valais · Vaud · Genève · Fribourg</p>
<p style="margin:0;font-size:11px;color:#3d3d5a;">${t.autoNote} <a href="https://mediasmart.ch" style="color:#7c3aed;text-decoration:none;">mediasmart.ch</a></p>
</td></tr>
</table></td></tr></table></body></html>`;

const buildConfirmHtml = (t, name, message) =>
`<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0f0e1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e1a;padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#5b4fcf,#7c3aed,#a855f7);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65);">${t.confirmHeaderTag}</p>
<h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;">MediaSmart</h1>
<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.7);">${t.confirmHeaderSub}</p>
</td></tr>
<tr><td style="background:#1a1830;padding:40px;">
<p style="margin:0 0 16px;font-size:17px;font-weight:600;color:#e8e9f3;">${t.confirmGreeting(name)}</p>
<p style="margin:0 0 28px;font-size:15px;color:#a0a3bf;line-height:1.7;">${t.confirmBody}</p>
<p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7c3aed;">${t.confirmCopy}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;"><tr><td style="background:#22203a;border-left:3px solid #8b5cf6;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;white-space:pre-wrap;">${message}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<a href="https://mediasmart.ch" style="display:inline-block;background:linear-gradient(135deg,#5b4fcf,#a855f7);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:50px;">mediasmart.ch</a>
</td></tr></table>
</td></tr>
<tr><td style="background:#13112a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #2a2748;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#fff;">${t.confirmFooter}</p>
<p style="margin:0 0 12px;font-size:12px;color:#5a5c7a;">Valais · Vaud · Genève · Fribourg</p>
<p style="margin:0;font-size:11px;color:#3d3d5a;">${t.confirmNote}</p>
</td></tr>
</table></td></tr></table></body></html>`;

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST' || req.url !== '/api/send') {
    res.writeHead(404).end();
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;
  const { name, email, phone, message, lang } = JSON.parse(body);
  console.log(`📨 Reçu — lang: "${lang}", name: "${name}"`);

  if (!name?.trim() || !email?.trim() || !message?.trim() || !emailRegex.test(email)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Champs invalides' }));
    return;
  }

  const t = lang === 'en' ? i18n.en : i18n.fr;

  try {
    const [internal, confirm] = await Promise.all([
      resend.emails.send({
        from: 'MediaSmart <noreply@mediasmart.ch>',
        to: 'website@mediasmart.ch',
        replyTo: email,
        subject: t.subject(name),
        html: buildInternalHtml(t, name, email, phone, message),
      }),
      resend.emails.send({
        from: 'MediaSmart <noreply@mediasmart.ch>',
        to: email,
        subject: t.confirmSubject,
        html: buildConfirmHtml(t, name, message),
      }),
    ]);

    const err = internal.error ?? confirm.error;
    if (err) {
      console.error('Resend error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: err.message }));
      return;
    }

    console.log(`✅ Emails envoyés — interne + confirmation à ${email}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
  }
}).listen(3001, () => {
  console.log('🚀 API dev server running on http://localhost:3001');
  console.log('   Handling: POST /api/send');
});
