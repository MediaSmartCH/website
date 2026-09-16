import { Resend } from 'resend';
import type { ApiRequest, ApiResponse } from './_shared/http-types.js';
import contactMailer from './_shared/contact-mailer.js';
import {
  CONTACT_CONFIRMATION_POLICY,
  reserveOutboundMail,
} from './_shared/outbound-mail-guard.js';
import {
  applyRateLimitHeaders,
  enforceRateLimit,
  getRateLimitIdentifier,
} from './_shared/rate-limit.js';
import recaptcha from './_shared/recaptcha.js';
import { applyApiResponseHeaders, guardRequest } from './_shared/request-guard.js';

const { contactApiErrors, sendContactEmails, validateContactPayload } = contactMailer;
const { extractClientIp, verifyRecaptcha } = recaptcha;

const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  applyApiResponseHeaders(res, ['POST']);

  const guard = guardRequest(req, { methods: ['POST'] });
  if (!guard.ok) {
    console.warn(`Contact request refused: ${guard.reason}`);
    return res.status(guard.status).json({ success: false, message: guard.message });
  }

  const clientIp = extractClientIp(req.headers);
  const rateLimitResult = await enforceRateLimit({
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

  // The enquiry itself always goes out; only the courtesy copy addressed to
  // whatever the form typed is budgeted, because that copy is the one an
  // attacker would aim at a third party. Over the ceiling we drop the copy and
  // still deliver the message — the visitor's submission is never refused
  // because of a limit that exists to protect someone else's inbox.
  const confirmationBudget = await reserveOutboundMail(
    CONTACT_CONFIRMATION_POLICY,
    validation.data.email,
  );

  if (!confirmationBudget.allowed) {
    console.warn(
      `Contact confirmation copy suppressed by the ${confirmationBudget.refusedBy} budget`,
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await sendContactEmails(resend, validation.data, {
      sendConfirmation: confirmationBudget.allowed,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      // The reservation was taken before the send. If the copy never left,
      // hand the allowance back rather than charging the visitor for a mail
      // they did not receive.
      if (!result.confirmationSent) {
        await confirmationBudget.release();
      }
      return res.status(500).json({ success: false, message: contactApiErrors.sendFailed });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    await confirmationBudget.release();
    return res.status(500).json({ success: false, message: contactApiErrors.serverError });
  }
}
