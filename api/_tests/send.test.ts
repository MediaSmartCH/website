import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for the contact endpoint. Every collaborator that
// leaves the process (Resend, reCAPTCHA) is replaced by a double, so these
// tests pin the handler's decision table: status codes, response bodies,
// headers, and which collaborators are reached in which order.

const sendContactEmails = vi.fn();
const reserveOutboundMail = vi.fn();
const releaseBudget = vi.fn();
const validateContactPayload = vi.fn();
const verifyRecaptcha = vi.fn();
const resendConstructor = vi.fn();

const contactApiErrors = {
  missingRequired: 'Champs requis manquants',
  invalidEmail: 'Email invalide',
  invalidPayload: 'Champs invalides',
  sendFailed: "Erreur lors de l'envoi",
  serverError: 'Erreur serveur',
  rateLimited: 'Trop de tentatives, veuillez réessayer plus tard',
};

vi.mock('../_shared/contact-mailer.js', () => ({
  default: {
    contactApiErrors,
    sendContactEmails: (...args: unknown[]) => sendContactEmails(...args),
    validateContactPayload: (...args: unknown[]) => validateContactPayload(...args),
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

vi.mock('../_shared/outbound-mail-guard.js', () => ({
  CONTACT_CONFIRMATION_POLICY: { flow: 'contact-confirmation' },
  reserveOutboundMail: (...args: unknown[]) => reserveOutboundMail(...args),
}));

vi.mock('resend', () => ({
  Resend: class {
    constructor(key: string) {
      resendConstructor(key);
    }
  },
}));

const { default: handler } = await import('../send.js');

const VALID_PAYLOAD = { name: 'Ada', email: 'ada@example.ch', message: 'Hi' };

function postContact(body: Record<string, unknown> = {}) {
  return createRequest({ headers: uniqueClientHeaders(), body: { ...VALID_PAYLOAD, ...body } });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = 'test-key';
  validateContactPayload.mockReturnValue({ ok: true, data: VALID_PAYLOAD });
  verifyRecaptcha.mockResolvedValue({ ok: true });
  sendContactEmails.mockResolvedValue({ error: null, confirmationSent: true });
  releaseBudget.mockResolvedValue(undefined);
  reserveOutboundMail.mockResolvedValue({
    allowed: true,
    enforced: true,
    release: releaseBudget,
  });
});

describe('POST /api/send — request guard', () => {
  it('refuses a submission posted from another site', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = createResponse();

    await handler(
      createRequest({
        headers: { ...uniqueClientHeaders(), origin: 'https://evil.example' },
        body: VALID_PAYLOAD,
      }),
      res.res,
    );

    expect(res.statusCode()).toBe(403);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it('refuses a body that is not JSON', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = createResponse();

    await handler(
      createRequest({
        headers: { ...uniqueClientHeaders(), 'content-type': 'text/plain' },
        body: VALID_PAYLOAD,
      }),
      res.res,
    );

    expect(res.statusCode()).toBe(415);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it('refuses an oversized body before parsing it', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = createResponse();

    await handler(
      createRequest({
        headers: { ...uniqueClientHeaders(), 'content-length': '5000000' },
        body: VALID_PAYLOAD,
      }),
      res.res,
    );

    expect(res.statusCode()).toBe(413);
    expect(validateContactPayload).not.toHaveBeenCalled();
  });

  it('answers a same-origin submission that carries only Fetch Metadata', async () => {
    const headers = uniqueClientHeaders();
    delete headers.origin;
    expect(headers['sec-fetch-site']).toBe('same-origin');

    const res = createResponse();

    await handler(createRequest({ headers, body: VALID_PAYLOAD }), res.res);

    expect(res.statusCode()).toBe(200);
  });
});

describe('POST /api/send — outbound mail budget', () => {
  it('still delivers the enquiry when the confirmation copy is over budget', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    reserveOutboundMail.mockResolvedValue({
      allowed: false,
      refusedBy: 'recipient',
      enforced: true,
      release: releaseBudget,
    });

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(sendContactEmails).toHaveBeenCalledWith(expect.anything(), VALID_PAYLOAD, {
      sendConfirmation: false,
    });
    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
  });

  it('budgets the address the form supplied', async () => {
    const res = createResponse();
    await handler(postContact(), res.res);

    expect(reserveOutboundMail).toHaveBeenCalledWith(
      expect.anything(),
      VALID_PAYLOAD.email,
    );
  });

  it('hands the allowance back when the copy never left', async () => {
    sendContactEmails.mockResolvedValue({
      error: { internal: null, confirm: { message: 'boom' } },
      confirmationSent: false,
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(releaseBudget).toHaveBeenCalledTimes(1);
  });

  it('keeps the allowance charged when the copy did go out', async () => {
    sendContactEmails.mockResolvedValue({
      error: { internal: { message: 'boom' }, confirm: null },
      confirmationSent: true,
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(releaseBudget).not.toHaveBeenCalled();
  });
});

describe('POST /api/send — always-on response headers', () => {
  it('advertises POST-only and forbids caching', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.header('Allow')).toBe('POST');
    expect(res.header('Cache-Control')).toBe('no-store');
  });

  it('rejects a non-POST method with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.statusCode()).toBe(405);
    expect(res.body()).toEqual({ success: false, message: 'Method not allowed' });
    expect(sendContactEmails).not.toHaveBeenCalled();
  });
});

describe('POST /api/send — rate limiting', () => {
  it('allows five submissions from one IP then answers 429', async () => {
    const headers = uniqueClientHeaders();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const res = createResponse();
      await handler(createRequest({ headers, body: VALID_PAYLOAD }), res.res);
      expect(res.statusCode()).toBe(200);
    }

    const blocked = createResponse();
    await handler(createRequest({ headers, body: VALID_PAYLOAD }), blocked.res);

    expect(blocked.statusCode()).toBe(429);
    expect(blocked.body()).toEqual({ success: false, message: contactApiErrors.rateLimited });
    expect(blocked.header('Retry-After')).toBeDefined();
    expect(sendContactEmails).toHaveBeenCalledTimes(5);
  });

  it('exposes the RateLimit policy headers on an accepted request', async () => {
    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.header('RateLimit-Limit')).toBe('5');
    expect(res.header('RateLimit-Remaining')).toBe('4');
    expect(res.header('RateLimit-Policy')).toBe('5;w=600');
  });
});

describe('POST /api/send — honeypot', () => {
  it('pretends to succeed and sends nothing when the honeypot is filled', async () => {
    const res = createResponse();
    await handler(postContact({ website: 'http://spam.example' }), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
    expect(validateContactPayload).not.toHaveBeenCalled();
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it('ignores a whitespace-only honeypot', async () => {
    const res = createResponse();
    await handler(postContact({ website: '   ' }), res.res);

    expect(sendContactEmails).toHaveBeenCalledTimes(1);
  });
});

describe('POST /api/send — validation and reCAPTCHA', () => {
  it('returns the validator status and message untouched', async () => {
    validateContactPayload.mockReturnValue({
      ok: false,
      error: { status: 422, message: contactApiErrors.invalidEmail },
    });

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(422);
    expect(res.body()).toEqual({ success: false, message: contactApiErrors.invalidEmail });
    expect(verifyRecaptcha).not.toHaveBeenCalled();
  });

  it('falls back to 400 invalidPayload when the validator gives no error detail', async () => {
    validateContactPayload.mockReturnValue({ ok: false });

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ success: false, message: contactApiErrors.invalidPayload });
  });

  it('verifies the token against the contact_form action', async () => {
    await handler(postContact({ recaptchaToken: 'tok' }), createResponse().res);

    expect(verifyRecaptcha).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'tok', expectedAction: 'contact_form' }),
    );
  });

  it('propagates a reCAPTCHA rejection and sends nothing', async () => {
    verifyRecaptcha.mockResolvedValue({ ok: false, status: 403, message: 'nope' });

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(403);
    expect(res.body()).toEqual({ success: false, message: 'nope' });
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it('defaults a reCAPTCHA rejection without a status to 500', async () => {
    verifyRecaptcha.mockResolvedValue({ ok: false, message: 'nope' });

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(500);
  });
});

describe('POST /api/send — delivery', () => {
  it('returns 500 when the Resend key is not configured', async () => {
    delete process.env.RESEND_API_KEY;

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: contactApiErrors.serverError });
  });

  it('returns 500 sendFailed when Resend reports an error', async () => {
    sendContactEmails.mockResolvedValue({ error: { message: 'boom' } });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: contactApiErrors.sendFailed });
  });

  it('returns 500 serverError when sending throws', async () => {
    sendContactEmails.mockRejectedValue(new Error('network down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = createResponse();
    await handler(postContact(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: contactApiErrors.serverError });
  });

  it('sends the validated payload and answers 200 on success', async () => {
    const res = createResponse();
    await handler(postContact(), res.res);

    expect(resendConstructor).toHaveBeenCalledWith('test-key');
    expect(sendContactEmails).toHaveBeenCalledWith(expect.anything(), VALID_PAYLOAD, {
      sendConfirmation: true,
    });
    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
  });
});
