import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const i18n = {
  fr: {
    subject: (name: string) => `Nouveau message de ${name}`,
    confirmSubject: 'Votre message a bien été reçu — MediaSmart',
    headerTag: 'Nouveau message',
    headerSub: 'Quelqu\'un vous a contacté via le formulaire',
    intro: 'Bonjour, vous avez reçu un nouveau message depuis votre site :',
    labelName: 'Nom', labelEmail: 'Email', labelPhone: 'Téléphone', labelMessage: 'Message',
    labelIntent: 'Demande', labelProjectType: 'Type de projet',
    intentQuestion: 'Question', intentQuote: 'Demande de devis',
    phoneEmpty: 'Non renseigné',
    replyBtn: (name: string) => `Répondre à ${name} →`,
    autoNote: 'Ce message a été envoyé automatiquement via le formulaire de contact de',
    confirmHeaderTag: 'Message reçu',
    confirmHeaderSub: 'Merci de nous avoir contacté',
    confirmGreeting: (name: string) => `Bonjour ${name},`,
    confirmBody: 'Nous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.',
    confirmCopy: 'Voici un récapitulatif de votre message :',
    confirmNote: 'Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.',
    confirmFooter: 'L\'équipe MediaSmart',
  },
  en: {
    subject: (name: string) => `New message from ${name}`,
    confirmSubject: 'We received your message — MediaSmart',
    headerTag: 'New message',
    headerSub: 'Someone contacted you via the form',
    intro: 'Hello, you received a new contact message from your website:',
    labelName: 'Name', labelEmail: 'Email', labelPhone: 'Phone', labelMessage: 'Message',
    labelIntent: 'Request type', labelProjectType: 'Project type',
    intentQuestion: 'Question', intentQuote: 'Quote request',
    phoneEmpty: 'Not provided',
    replyBtn: (name: string) => `Reply to ${name} →`,
    autoNote: 'This message was sent automatically via the contact form of',
    confirmHeaderTag: 'Message received',
    confirmHeaderSub: 'Thank you for reaching out',
    confirmGreeting: (name: string) => `Hello ${name},`,
    confirmBody: 'We have received your message and appreciate you reaching out. Our team will get back to you as soon as possible.',
    confirmCopy: 'Here is a copy of your message:',
    confirmNote: 'This email was sent automatically, please do not reply directly.',
    confirmFooter: 'The MediaSmart Team',
  },
};

function buildInternalHtml(t: typeof i18n.fr, name: string, email: string, phone: string, message: string, intent?: string, projectType?: string) {
  const intentLabel = intent === 'quote' ? t.intentQuote : t.intentQuestion;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
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
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #5b4fcf;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#5b4fcf;">${t.labelIntent}</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#e8e9f3;">${intentLabel}${intent === 'quote' && projectType ? ` — ${projectType}` : ''}</p>
</td></tr></table>
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
}

function buildConfirmHtml(t: typeof i18n.fr, name: string, message: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
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
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, message, lang, intent, projectType } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants' });
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Email invalide' });
  }

  const t = lang === 'en' ? i18n.en : i18n.fr;

  try {
    const [internal, confirm] = await Promise.all([
      resend.emails.send({
        from: 'MediaSmart <noreply@mediasmart.ch>',
        to: 'website@mediasmart.ch',
        replyTo: email,
        subject: t.subject(name),
        html: buildInternalHtml(t, name, email, phone, message, intent, projectType),
      }),
      resend.emails.send({
        from: 'MediaSmart <noreply@mediasmart.ch>',
        to: email,
        subject: t.confirmSubject,
        html: buildConfirmHtml(t, name, message),
      }),
    ]);

    if (internal.error || confirm.error) {
      console.error('Resend error:', internal.error ?? confirm.error);
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}
