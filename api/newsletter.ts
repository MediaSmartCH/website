import { Resend } from 'resend';
import type { ApiRequest, ApiResponse } from './_shared/http-types';
import newsletterMailer from './_shared/newsletter-mailer.js';
import recaptcha from './_shared/recaptcha.js';

const { newsletterApiErrors, sendNewsletterEmail, validateNewsletterPayload } = newsletterMailer;
const { extractRemoteIp, verifyRecaptcha } = recaptcha;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    console.warn('Newsletter honeypot triggered');
    return res.status(200).json({ success: true });
  }

  const validation = validateNewsletterPayload(req.body ?? {});
  if (!validation.ok) {
    return res.status(validation.error.status).json({ success: false, message: validation.error.message });
  }

  const recaptchaResult = await verifyRecaptcha({
    token: req.body?.recaptchaToken,
    expectedAction: 'uc_newsletter',
    remoteIp: extractRemoteIp(req.headers['x-forwarded-for']),
  });

  if (!recaptchaResult.ok) {
    return res.status(recaptchaResult.status).json({ success: false, message: recaptchaResult.message });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ success: false, message: newsletterApiErrors.serverError });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await sendNewsletterEmail(resend, validation.data);

    if (result.error) {
      console.error('Resend newsletter error:', result.error);
      return res.status(500).json({ success: false, message: newsletterApiErrors.sendFailed });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return res.status(500).json({ success: false, message: newsletterApiErrors.serverError });
  }
}
