import { Resend } from 'resend';
import type { ApiRequest, ApiResponse } from './_shared/http-types';
import contactMailer from './_shared/contact-mailer.js';
import recaptcha from './_shared/recaptcha.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;
const { extractRemoteIp, verifyRecaptcha } = recaptcha;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    console.warn('Contact honeypot triggered');
    return res.status(200).json({ success: true });
  }

  const validation = validateContactPayload(req.body ?? {});
  if (!validation.ok) {
    return res.status(validation.error.status).json({ success: false, message: validation.error.message });
  }

  const recaptchaResult = await verifyRecaptcha({
    token: req.body?.recaptchaToken,
    expectedAction: 'contact_form',
    remoteIp: extractRemoteIp(req.headers['x-forwarded-for']),
  });

  if (!recaptchaResult.ok) {
    return res.status(recaptchaResult.status).json({ success: false, message: recaptchaResult.message });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, message: contactApiErrors.serverError });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await sendContactEmails(resend, validation.data);

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ success: false, message: contactApiErrors.sendFailed });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ success: false, message: contactApiErrors.serverError });
  }
}
