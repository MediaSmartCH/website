import { Resend } from 'resend';
import type { ApiRequest, ApiResponse } from './_shared/http-types';
import contactMailer from './_shared/contact-mailer.js';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from './_shared/rate-limit';
import recaptcha from './_shared/recaptcha.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;
const { extractClientIp, verifyRecaptcha } = recaptcha;

const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const clientIp = extractClientIp(req.headers);
  const rateLimitResult = checkRateLimit({
    namespace: 'contact',
    identifier: getRateLimitIdentifier(req.headers),
    ...CONTACT_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({
      success: false,
      message: contactApiErrors.rateLimited,
    });
  }

  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    console.warn('Contact honeypot triggered');
    return res.status(200).json({ success: true });
  }

  const validation = validateContactPayload(req.body ?? {});
  if (!validation.ok) {
    const validationError = validation.error ?? {
      status: 400,
      message: contactApiErrors.invalidPayload,
    };

    return res
      .status(validationError.status)
      .json({ success: false, message: validationError.message });
  }

  const recaptchaResult = await verifyRecaptcha({
    token: req.body?.recaptchaToken,
    expectedAction: 'contact_form',
    remoteIp: clientIp,
  });

  if (!recaptchaResult.ok) {
    return res
      .status(recaptchaResult.status ?? 500)
      .json({ success: false, message: recaptchaResult.message });
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
