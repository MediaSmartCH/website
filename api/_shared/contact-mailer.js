const {
  fieldLimits,
  isValidEmailStrict,
  isWithinLength,
  normalizeMultilineText,
  normalizeSingleLineText,
} = require('./input-validation.js');

const contactApiErrors = {
  missingRequired: 'Champs requis manquants',
  invalidEmail: 'Email invalide',
  invalidPayload: 'Champs invalides',
  sendFailed: 'Erreur lors de l\'envoi',
  serverError: 'Erreur serveur',
};

const i18n = {
  fr: {
    subject: (name) => `Nouveau message de ${name}`,
    confirmSubject: 'Votre message a bien été reçu - MediaSmart',
    headerTag: 'Nouveau message',
    headerSub: 'Quelqu\'un vous a contacté via le formulaire',
    intro: 'Bonjour, vous avez reçu un nouveau message depuis votre site :',
    labelName: 'Nom',
    labelEmail: 'Email',
    labelPhone: 'Téléphone',
    labelMessage: 'Message',
    labelIntent: 'Demande',
    labelProjectType: 'Type de projet',
    intentQuestion: 'Question',
    intentQuote: 'Demande de devis',
    phoneEmpty: 'Non renseigné',
    replyBtn: (name) => `Répondre à ${name} ->`,
    autoNote: 'Ce message a été envoyé automatiquement via le formulaire de contact de',
    confirmHeaderTag: 'Message reçu',
    confirmHeaderSub: 'Merci de nous avoir contacté',
    confirmGreeting: (name) => `Bonjour ${name},`,
    confirmBody: 'Nous avons bien reçu votre message et nous vous en remercions. Notre équipe vous répondra dans les plus brefs délais.',
    confirmCopy: 'Voici un récapitulatif de votre message :',
    confirmNote: 'Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.',
    confirmFooter: 'L\'équipe MediaSmart',
  },
  en: {
    subject: (name) => `New message from ${name}`,
    confirmSubject: 'We received your message - MediaSmart',
    headerTag: 'New message',
    headerSub: 'Someone contacted you via the form',
    intro: 'Hello, you received a new contact message from your website:',
    labelName: 'Name',
    labelEmail: 'Email',
    labelPhone: 'Phone',
    labelMessage: 'Message',
    labelIntent: 'Request type',
    labelProjectType: 'Project type',
    intentQuestion: 'Question',
    intentQuote: 'Quote request',
    phoneEmpty: 'Not provided',
    replyBtn: (name) => `Reply to ${name} ->`,
    autoNote: 'This message was sent automatically via the contact form of',
    confirmHeaderTag: 'Message received',
    confirmHeaderSub: 'Thank you for reaching out',
    confirmGreeting: (name) => `Hello ${name},`,
    confirmBody: 'We have received your message and appreciate you reaching out. Our team will get back to you as soon as possible.',
    confirmCopy: 'Here is a copy of your message:',
    confirmNote: 'This email was sent automatically, please do not reply directly.',
    confirmFooter: 'The MediaSmart Team',
  },
};

/** @typedef {'fr' | 'en'} ContactLang */
/** @typedef {'question' | 'quote'} ContactIntent */
/**
 * @typedef {object} ContactPayload
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} message
 * @property {ContactLang} lang
 * @property {ContactIntent} intent
 * @property {string} projectType
 */

/**
 * @typedef {object} ContactValidationError
 * @property {number} status
 * @property {string} message
 */

/**
 * @typedef {{ ok: true, data: ContactPayload } | { ok: false, error: ContactValidationError }} ContactValidationResult
 */

function normalizeLang(value) {
  return value === 'en' ? 'en' : 'fr';
}

function normalizeIntent(value) {
  return value === 'quote' ? 'quote' : 'question';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\'':
        return '&#39;';
      default:
        return char;
    }
  });
}

function normalizePhoneHref(phone) {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Normalize request input once so local dev and production share the same payload contract.
 *
 * @param {Record<string, unknown> | null | undefined} payload
 * @returns {ContactPayload}
 */
function normalizeContactPayload(payload) {
  const intent = normalizeIntent(payload?.intent);

  return {
    name: normalizeSingleLineText(payload?.name),
    email: normalizeSingleLineText(payload?.email).toLowerCase(),
    phone: normalizeSingleLineText(payload?.phone),
    message: normalizeMultilineText(payload?.message),
    lang: normalizeLang(payload?.lang),
    intent,
    projectType: intent === 'quote' ? normalizeSingleLineText(payload?.projectType) : '',
  };
}

/**
 * @param {Record<string, unknown> | null | undefined} payload
 * @returns {ContactValidationResult}
 */
function validateContactPayload(payload) {
  const normalizedPayload = normalizeContactPayload(payload);

  if (
    !normalizedPayload.name ||
    !normalizedPayload.email ||
    !normalizedPayload.message ||
    (normalizedPayload.intent === 'quote' && !normalizedPayload.projectType)
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: contactApiErrors.missingRequired,
      },
    };
  }

  if (!isValidEmailStrict(normalizedPayload.email)) {
    return {
      ok: false,
      error: {
        status: 400,
        message: contactApiErrors.invalidEmail,
      },
    };
  }

  if (
    !isWithinLength(normalizedPayload.name, fieldLimits.contact.name) ||
    !isWithinLength(normalizedPayload.email, fieldLimits.contact.email) ||
    !isWithinLength(normalizedPayload.phone, fieldLimits.contact.phone) ||
    !isWithinLength(normalizedPayload.message, fieldLimits.contact.message) ||
    !isWithinLength(normalizedPayload.projectType, fieldLimits.contact.projectType)
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: contactApiErrors.invalidPayload,
      },
    };
  }

  return { ok: true, data: normalizedPayload };
}

/**
 * @param {ContactPayload} payload
 */
function buildInternalHtml(payload) {
  const t = i18n[payload.lang];
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safePhoneHref = escapeHtml(normalizePhoneHref(payload.phone));
  const safeMessage = escapeHtml(payload.message);
  const safeProjectType = escapeHtml(payload.projectType);
  const intentLabel = payload.intent === 'quote' ? t.intentQuote : t.intentQuestion;
  const projectTypeBlock = payload.intent === 'quote' && safeProjectType
    ? `<p style="margin:10px 0 0;font-size:14px;color:#c8cae0;">${t.labelProjectType}: ${safeProjectType}</p>`
    : '';

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
<p style="margin:0;font-size:16px;font-weight:600;color:#e8e9f3;">${intentLabel}</p>
${projectTypeBlock}
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;">${t.labelName}</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#e8e9f3;">${safeName}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #a855f7;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#a855f7;">${t.labelEmail}</p>
<p style="margin:0;font-size:16px;font-weight:600;"><a href="mailto:${safeEmail}" style="color:#a78bfa;text-decoration:none;">${safeEmail}</a></p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6366f1;">${t.labelPhone}</p>
<p style="margin:0;font-size:16px;font-weight:600;">${safePhone ? `<a href="tel:${safePhoneHref}" style="color:#a78bfa;text-decoration:none;">${safePhone}</a>` : `<span style="color:#5a5c7a;font-style:italic;">${t.phoneEmpty}</span>`}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr><td style="background:#22203a;border-left:3px solid #8b5cf6;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8b5cf6;">${t.labelMessage}</p>
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<a href="mailto:${safeEmail}" style="display:inline-block;background:linear-gradient(135deg,#5b4fcf,#a855f7);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:50px;">${t.replyBtn(safeName)}</a>
</td></tr></table>
</td></tr>
<tr><td style="background:#13112a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #2a2748;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#fff;">MediaSmart</p>
<p style="margin:0 0 12px;font-size:12px;color:#5a5c7a;">Valais · Vaud · Genève · Fribourg</p>
<p style="margin:0;font-size:11px;color:#3d3d5a;">${t.autoNote} <a href="https://mediasmart.ch" style="color:#7c3aed;text-decoration:none;">mediasmart.ch</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

/**
 * @param {ContactPayload} payload
 */
function buildConfirmHtml(payload) {
  const t = i18n[payload.lang];
  const safeName = escapeHtml(payload.name);
  const safeMessage = escapeHtml(payload.message);

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
<p style="margin:0 0 16px;font-size:17px;font-weight:600;color:#e8e9f3;">${t.confirmGreeting(safeName)}</p>
<p style="margin:0 0 28px;font-size:15px;color:#a0a3bf;line-height:1.7;">${t.confirmBody}</p>
<p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7c3aed;">${t.confirmCopy}</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;"><tr><td style="background:#22203a;border-left:3px solid #8b5cf6;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
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

/**
 * Keep the email payload construction in one place so the local server and the Vercel function stay aligned.
 *
 * @param {ContactPayload} payload
 */
function buildContactEmails(payload) {
  const t = i18n[payload.lang];

  return {
    internal: {
      from: 'MediaSmart <noreply@mediasmart.ch>',
      to: 'website@mediasmart.ch',
      replyTo: payload.email,
      subject: t.subject(payload.name),
      html: buildInternalHtml(payload),
    },
    confirm: {
      from: 'MediaSmart <noreply@mediasmart.ch>',
      to: payload.email,
      subject: t.confirmSubject,
      html: buildConfirmHtml(payload),
    },
  };
}

/**
 * @param {{ emails: { send: (payload: Record<string, unknown>) => Promise<{ error?: unknown }> } }} resend
 * @param {ContactPayload} payload
 */
async function sendContactEmails(resend, payload) {
  const emails = buildContactEmails(payload);

  const [internal, confirm] = await Promise.all([
    resend.emails.send(emails.internal),
    resend.emails.send(emails.confirm),
  ]);

  return {
    internal,
    confirm,
    error: internal.error ?? confirm.error ?? null,
  };
}

module.exports = {
  buildContactEmails,
  contactApiErrors,
  sendContactEmails,
  validateContactPayload,
};
