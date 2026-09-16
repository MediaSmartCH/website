/**
 * Contract of GET /api/booking/health. What "healthy" means is pinned in
 * booking/_lib/health.test.ts; this covers who is allowed to ask, what the
 * status code says, and that a failure actually reaches a human.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from './http-fixtures.js';

const runHealthChecks = vi.fn();
const sendBookingHealthAlert = vi.fn();
const runtimeEnv: Record<string, string> = { cronSecret: 's3cret' };

vi.mock('../booking/_lib/health.js', () => ({
  runHealthChecks: () => runHealthChecks(),
}));

vi.mock('../booking/_lib/mailer.js', () => ({
  sendBookingHealthAlert: (...args: unknown[]) => sendBookingHealthAlert(...args),
}));

vi.mock('../booking/_lib/config.js', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('../booking/_lib/config.js');
  return { ...actual, getRuntimeEnv: () => runtimeEnv };
});

const { default: handler } = await import('../booking/health.js');

const HEALTHY = { ok: true, checkedAt: '2027-01-01T00:00:00.000Z', checks: [] };
const BROKEN = {
  ok: false,
  checkedAt: '2027-01-01T00:00:00.000Z',
  checks: [{ name: 'google-calendar', ok: false, detail: 'invalid_grant' }],
};

function authorizedRequest(overrides = {}) {
  return createRequest({
    method: 'GET',
    headers: { authorization: 'Bearer s3cret' },
    ...overrides,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  runtimeEnv.cronSecret = 's3cret';
  delete process.env.VERCEL_ENV;
  runHealthChecks.mockResolvedValue(HEALTHY);
  sendBookingHealthAlert.mockResolvedValue(undefined);
});

describe('booking/health — access', () => {
  it('advertises GET-only and never caches', async () => {
    const res = createResponse();
    await handler(authorizedRequest(), res.res);

    expect(res.header('Allow')).toBe('GET');
    expect(res.header('Cache-Control')).toBe('no-store');
  });

  it('rejects a non-GET method with 405 without probing anything', async () => {
    const res = createResponse();
    await handler(authorizedRequest({ method: 'POST' }), res.res);

    expect(res.statusCode()).toBe(405);
    expect(runHealthChecks).not.toHaveBeenCalled();
  });

  it('refuses a request with no credentials', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: {} }), res.res);

    expect(res.statusCode()).toBe(401);
    expect(runHealthChecks).not.toHaveBeenCalled();
  });

  it('refuses a wrong secret', async () => {
    const res = createResponse();
    await handler(
      createRequest({ method: 'GET', headers: { authorization: 'Bearer nope' } }),
      res.res
    );

    expect(res.statusCode()).toBe(401);
  });

  it('refuses a secret of the right length but wrong value', async () => {
    const res = createResponse();
    await handler(
      createRequest({ method: 'GET', headers: { authorization: 'Bearer s3cres' } }),
      res.res
    );

    expect(res.statusCode()).toBe(401);
  });

  it('fails closed in production when no secret is configured', async () => {
    runtimeEnv.cronSecret = '';
    process.env.VERCEL_ENV = 'production';

    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: {} }), res.res);

    expect(res.statusCode()).toBe(401);
  });

  it('answers without a secret outside production, so it can be run locally', async () => {
    runtimeEnv.cronSecret = '';

    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: {} }), res.res);

    expect(res.statusCode()).toBe(200);
  });
});

describe('booking/health — reporting', () => {
  it('answers 200 with the report when everything is up', async () => {
    const res = createResponse();
    await handler(authorizedRequest(), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual(HEALTHY);
    expect(sendBookingHealthAlert).not.toHaveBeenCalled();
  });

  it('answers 503 and alerts when a dependency is down', async () => {
    runHealthChecks.mockResolvedValue(BROKEN);

    const res = createResponse();
    await handler(authorizedRequest(), res.res);

    expect(res.statusCode()).toBe(503);
    expect(res.body()).toEqual(BROKEN);
    expect(sendBookingHealthAlert).toHaveBeenCalledWith(BROKEN);
  });

  it('still answers 503 when the alert itself cannot be sent', async () => {
    runHealthChecks.mockResolvedValue(BROKEN);
    sendBookingHealthAlert.mockRejectedValue(new Error('resend down'));

    const res = createResponse();
    await handler(authorizedRequest(), res.res);

    expect(res.statusCode()).toBe(503);
  });
});
