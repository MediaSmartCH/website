import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for the newsletter endpoint. It mirrors /api/send but
// with its own rate-limit budget (6 per hour), reCAPTCHA action and messages —
// all three are pinned here so a shared abstraction cannot quietly unify them.

const sendNewsletterEmail = vi.fn();
const validateNewsletterPayload = vi.fn();
const verifyRecaptcha = vi.fn();
const resendConstructor = vi.fn();

const newsletterApiErrors = {
  invalidEmail: 'Email invalide',
  invalidPayload: 'Champs invalides',
  missingRequired: 'Email requis',
  sendFailed: "Erreur lors de l'envoi",
  serverError: 'Erreur serveur',
  rateLimited: 'Trop de tentatives, veuillez reessayer plus tard',
};

vi.mock('../_shared/newsletter-mailer.js', () => ({
  default: {
    newsletterApiErrors,
    sendNewsletterEmail: (...args: unknown[]) => sendNewsletterEmail(...args),
    validateNewsletterPayload: (...args: unknown[]) => validateNewsletterPayload(...args),
  },
}));

vi.mock('../_shared/recaptcha.js', async () => {
  const actual = await vi.importActual<any>('../_shared/recaptcha.js');
  return {
    default: {
      ...actual.default,
      verifyRecaptcha: (...args: unknown[]) => verifyRecaptcha(...args),
    },
  };
});

vi.mock('resend', () => ({
  Resend: class {
    constructor(key: string) {
      resendConstructor(key);
    }
  },
}));

const { default: handler } = await import('../newsletter.js');

const VALID_PAYLOAD = { email: 'ada@example.ch', source: 'under-construction' };

function postNewsletter(body: Record<string, unknown> = {}) {
  return createRequest({ headers: uniqueClientHeaders(), body: { ...VALID_PAYLOAD, ...body } });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = 'test-key';
  validateNewsletterPayload.mockReturnValue({ ok: true, data: VALID_PAYLOAD });
  verifyRecaptcha.mockResolvedValue({ ok: true });
  sendNewsletterEmail.mockResolvedValue({ error: null });
});

describe('POST /api/newsletter — method and headers', () => {
  it('advertises POST-only, forbids caching and rejects GET with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.header('Allow')).toBe('POST');
    expect(res.header('Cache-Control')).toBe('no-store');
    expect(res.statusCode()).toBe(405);
    expect(res.body()).toEqual({ success: false, message: 'Method not allowed' });
  });
});

describe('POST /api/newsletter — rate limiting', () => {
  it('allows six subscriptions per hour from one IP then answers 429', async () => {
    const headers = uniqueClientHeaders();

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const res = createResponse();
      await handler(createRequest({ headers, body: VALID_PAYLOAD }), res.res);
      expect(res.statusCode()).toBe(200);
    }

    const blocked = createResponse();
    await handler(createRequest({ headers, body: VALID_PAYLOAD }), blocked.res);

    expect(blocked.statusCode()).toBe(429);
    expect(blocked.body()).toEqual({ success: false, message: newsletterApiErrors.rateLimited });
    expect(sendNewsletterEmail).toHaveBeenCalledTimes(6);
  });

  it('advertises the hourly policy window', async () => {
    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.header('RateLimit-Policy')).toBe('6;w=3600');
  });
});

describe('POST /api/newsletter — honeypot, validation and reCAPTCHA', () => {
  it('pretends to succeed and sends nothing when the honeypot is filled', async () => {
    const res = createResponse();
    await handler(postNewsletter({ website: 'bot' }), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
    expect(sendNewsletterEmail).not.toHaveBeenCalled();
  });

  it('returns the validator status and message untouched', async () => {
    validateNewsletterPayload.mockReturnValue({
      ok: false,
      error: { status: 400, message: newsletterApiErrors.invalidEmail },
    });

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ success: false, message: newsletterApiErrors.invalidEmail });
    expect(verifyRecaptcha).not.toHaveBeenCalled();
  });

  it('falls back to 400 invalidPayload when the validator gives no error detail', async () => {
    validateNewsletterPayload.mockReturnValue({ ok: false });

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ success: false, message: newsletterApiErrors.invalidPayload });
  });

  it('verifies the token against the uc_newsletter action', async () => {
    await handler(postNewsletter({ recaptchaToken: 'tok' }), createResponse().res);

    expect(verifyRecaptcha).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'tok', expectedAction: 'uc_newsletter' }),
    );
  });

  it('propagates a reCAPTCHA rejection and sends nothing', async () => {
    verifyRecaptcha.mockResolvedValue({ ok: false, status: 403, message: 'nope' });

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(403);
    expect(sendNewsletterEmail).not.toHaveBeenCalled();
  });
});

describe('POST /api/newsletter — delivery', () => {
  it('returns 500 when the Resend key is not configured', async () => {
    delete process.env.RESEND_API_KEY;

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: newsletterApiErrors.serverError });
  });

  it('returns 500 sendFailed when Resend reports an error', async () => {
    sendNewsletterEmail.mockResolvedValue({ error: { message: 'boom' } });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: newsletterApiErrors.sendFailed });
  });

  it('returns 500 serverError when sending throws', async () => {
    sendNewsletterEmail.mockRejectedValue(new Error('network down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: newsletterApiErrors.serverError });
  });

  it('sends the validated payload and answers 200 on success', async () => {
    const res = createResponse();
    await handler(postNewsletter(), res.res);

    expect(resendConstructor).toHaveBeenCalledWith('test-key');
    expect(sendNewsletterEmail).toHaveBeenCalledWith(expect.anything(), VALID_PAYLOAD);
    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
  });
});
