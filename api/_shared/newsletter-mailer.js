const {
  fieldLimits,
  isValidEmailStrict,
  isWithinLength,
  normalizeSingleLineText,
} = require('./input-validation.js');

const newsletterApiErrors = {
  invalidEmail: 'Email invalide',
  invalidPayload: 'Champs invalides',
  missingRequired: 'Email requis',
  sendFailed: 'Erreur lors de l\'envoi',
  serverError: 'Erreur serveur',
  rateLimited: 'Trop de tentatives, veuillez reessayer plus tard',
};

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

function normalizeNewsletterPayload(payload) {
  return {
    email: normalizeSingleLineText(payload?.email).toLowerCase(),
    source: normalizeSingleLineText(payload?.source) || 'website',
  };
}

function validateNewsletterPayload(payload) {
  const normalizedPayload = normalizeNewsletterPayload(payload);

  if (!normalizedPayload.email) {
    return {
      ok: false,
      error: {
        status: 400,
        message: newsletterApiErrors.missingRequired,
      },
    };
  }

  if (!isValidEmailStrict(normalizedPayload.email)) {
    return {
      ok: false,
      error: {
        status: 400,
        message: newsletterApiErrors.invalidEmail,
      },
    };
  }

  if (
    !isWithinLength(normalizedPayload.email, fieldLimits.newsletter.email) ||
    !isWithinLength(normalizedPayload.source, fieldLimits.newsletter.source)
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: newsletterApiErrors.invalidPayload,
      },
    };
  }

  return { ok: true, data: normalizedPayload };
}

function buildNewsletterEmail(payload) {
  const safeEmail = escapeHtml(payload.email);
  const safeSource = escapeHtml(payload.source);
  const safeTimestamp = escapeHtml(new Date().toISOString());

  return {
    from: 'MediaSmart <noreply@mediasmart.ch>',
    to: 'website@mediasmart.ch',
    replyTo: payload.email,
    subject: `Newsletter signup: ${payload.email}`,
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0f0e1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e1a;padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:linear-gradient(135deg,#5b4fcf,#7c3aed,#a855f7);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
<p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65);">NEWSLETTER</p>
<h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;">MediaSmart</h1>
<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.7);">Nouvelle inscription depuis le site</p>
</td></tr>
<tr><td style="background:#1a1830;padding:36px 40px;">
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;">EMAIL</p>
<p style="margin:0;font-size:16px;font-weight:600;color:#e8e9f3;">${safeEmail}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr><td style="background:#22203a;border-left:3px solid #8b5cf6;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#8b5cf6;">SOURCE</p>
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;">${safeSource}</p>
</td></tr></table>
<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#22203a;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#6366f1;">TIMESTAMP</p>
<p style="margin:0;font-size:15px;color:#c8cae0;line-height:1.7;">${safeTimestamp}</p>
</td></tr></table>
</td></tr>
<tr><td style="background:#13112a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #2a2748;">
<p style="margin:0;font-size:11px;color:#3d3d5a;">Sent automatically from mediasmart.ch</p>
</td></tr>
</table></td></tr></table></body></html>`,
  };
}

async function sendNewsletterEmail(resend, payload) {
  return resend.emails.send(buildNewsletterEmail(payload));
}

module.exports = {
  newsletterApiErrors,
  sendNewsletterEmail,
  validateNewsletterPayload,
};
