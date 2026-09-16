import { Resend } from 'resend';
import type { ApiRequest, ApiResponse } from './_shared/http-types.js';
import newsletterMailer from './_shared/newsletter-mailer.js';
import {
  applyRateLimitHeaders,
  enforceRateLimit,
  getRateLimitIdentifier,
} from './_shared/rate-limit.js';
import recaptcha from './_shared/recaptcha.js';
import { applyApiResponseHeaders, guardRequest } from './_shared/request-guard.js';

const { newsletterApiErrors, sendNewsletterEmail, validateNewsletterPayload } = newsletterMailer;
const { extractClientIp, verifyRecaptcha } = recaptcha;

const NEWSLETTER_RATE_LIMIT = {
  limit: 6,
  windowMs: 60 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  applyApiResponseHeaders(res, ['POST']);

  const guard = guardRequest(req, { methods: ['POST'], maxBodyBytes: 4 * 1024 });
  if (!guard.ok) {
    console.warn(`Newsletter request refused: ${guard.reason}`);
    return res.status(guard.status).json({ success: false, message: guard.message });
  }

  const clientIp = extractClientIp(req.headers);
  const rateLimitResult = await enforceRateLimit({
    namespace: 'newsletter',
    identifier: getRateLimitIdentifier(req.headers),
    ...NEWSLETTER_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({
      success: false,
      message: newsletterApiErrors.rateLimited,
    });
  }

  if (typeof req.body?.website === 'string' && req.body.website.trim()) {
    console.warn('Newsletter honeypot triggered');
    return res.status(200).json({ success: true });
  }

  const validation = validateNewsletterPayload(req.body ?? {});
  if (!validation.ok) {
    const validationError = validation.error ?? {
      status: 400,
      message: newsletterApiErrors.invalidPayload,
    };

    return res
      .status(validationError.status)
      .json({ success: false, message: validationError.message });
  }

  const recaptchaResult = await verifyRecaptcha({
    token: req.body?.recaptchaToken,
    expectedAction: 'uc_newsletter',
    remoteIp: clientIp,
  });

  if (!recaptchaResult.ok) {
    return res
      .status(recaptchaResult.status ?? 500)
      .json({ success: false, message: recaptchaResult.message });
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
