import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiRequest } from './http-types.js';
import {
  applyApiResponseHeaders,
  guardRequest,
  isAllowedOrigin,
} from './request-guard.js';
import { createResponse } from '../_tests/http-fixtures.js';

// The guard decides which requests are even worth validating, so these tests
// pin the boundary: what a browser on our own site sends is accepted, and the
// shapes that only a foreign page or a scanner produces are not.

const ORIGINAL_ENV = { ...process.env };

function request(headers: Record<string, string>, method = 'POST'): ApiRequest {
  return { method, headers, body: {}, query: {} } as unknown as ApiRequest;
}

const BROWSER_POST = {
  'content-type': 'application/json',
  origin: 'https://mediasmart.ch',
};

beforeEach(() => {
  process.env.VERCEL_ENV = 'production';
  process.env.SITE_ORIGIN = 'https://mediasmart.ch';
  delete process.env.ALLOWED_ORIGINS;
  delete process.env.CLOUDFLARE_ORIGIN_SECRET;
  delete process.env.CLOUDFLARE_ORIGIN_ENFORCE;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('isAllowedOrigin', () => {
  it('accepts the configured origin and its www sibling', () => {
    expect(isAllowedOrigin('https://mediasmart.ch')).toBe(true);
    expect(isAllowedOrigin('https://www.mediasmart.ch')).toBe(true);
  });

  it('accepts an extra origin listed in ALLOWED_ORIGINS', () => {
    process.env.ALLOWED_ORIGINS = 'https://shop.mediasmart.ch';

    expect(isAllowedOrigin('https://shop.mediasmart.ch')).toBe(true);
  });

  it('refuses a look-alike domain', () => {
    expect(isAllowedOrigin('https://mediasmart.ch.evil.com')).toBe(false);
    expect(isAllowedOrigin('https://notmediasmart.ch')).toBe(false);
  });

  it('refuses plain http for the configured origin', () => {
    expect(isAllowedOrigin('http://mediasmart.ch')).toBe(false);
  });

  it('refuses preview and local origins in production', () => {
    expect(isAllowedOrigin('https://website-abc123.vercel.app')).toBe(false);
    expect(isAllowedOrigin('http://localhost:5173')).toBe(false);
  });

  it('accepts preview and local origins outside production', () => {
    process.env.VERCEL_ENV = 'preview';

    expect(isAllowedOrigin('https://website-abc123.vercel.app')).toBe(true);
    expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
  });

  it('refuses a value that is not a URL', () => {
    expect(isAllowedOrigin('null')).toBe(false);
    expect(isAllowedOrigin('')).toBe(false);
  });
});

describe('guardRequest — Cloudflare origin', () => {
  const SECRET = 'test-origin-secret';

  it('lets everything through while no secret is configured', () => {
    expect(guardRequest(request(BROWSER_POST), { methods: ['POST'] }).ok).toBe(true);
  });

  it('refuses a request with no Cloudflare proof once enforcing', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;
    process.env.CLOUDFLARE_ORIGIN_ENFORCE = 'true';

    const rejected = guardRequest(request(BROWSER_POST), { methods: ['POST'] });

    expect(rejected).toMatchObject({
      ok: false,
      status: 403,
      reason: 'cloudflare-origin',
    });
  });

  it('accepts a request carrying the proof', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;
    process.env.CLOUDFLARE_ORIGIN_ENFORCE = 'true';

    const result = guardRequest(
      request({ ...BROWSER_POST, 'x-origin-verify': SECRET }),
      { methods: ['POST'] },
    );

    expect(result.ok).toBe(true);
  });

  it('only warns while enforcement is off, so a misordered rollout is visible', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(guardRequest(request(BROWSER_POST), { methods: ['POST'] }).ok).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('exempts a caller that legitimately bypasses Cloudflare, like the cron', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;
    process.env.CLOUDFLARE_ORIGIN_ENFORCE = 'true';

    const result = guardRequest(request({}, 'GET'), {
      methods: ['GET'],
      requireCloudflareOrigin: false,
    });

    expect(result.ok).toBe(true);
  });
});

describe('guardRequest — method', () => {
  it('accepts a listed method and refuses anything else with 405', () => {
    expect(guardRequest(request(BROWSER_POST), { methods: ['POST'] }).ok).toBe(true);

    const rejected = guardRequest(request(BROWSER_POST, 'DELETE'), { methods: ['POST'] });

    expect(rejected).toMatchObject({ ok: false, status: 405, reason: 'method' });
  });
});

describe('guardRequest — origin', () => {
  it('refuses a POST from another site', () => {
    const rejected = guardRequest(
      request({ ...BROWSER_POST, origin: 'https://evil.example' }),
      { methods: ['POST'] },
    );

    expect(rejected).toMatchObject({ ok: false, status: 403, reason: 'origin' });
  });

  it('refuses a POST carrying no origin signal at all', () => {
    const rejected = guardRequest(
      request({ 'content-type': 'application/json' }),
      { methods: ['POST'] },
    );

    expect(rejected).toMatchObject({ ok: false, status: 403, reason: 'origin' });
  });

  it('accepts a POST whose Fetch Metadata says same-origin', () => {
    const result = guardRequest(
      request({ 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' }),
      { methods: ['POST'] },
    );

    expect(result.ok).toBe(true);
  });

  it('falls back to a referrer on one of our pages', () => {
    const result = guardRequest(
      request({
        'content-type': 'application/json',
        referer: 'https://mediasmart.ch/fr#contact',
      }),
      { methods: ['POST'] },
    );

    expect(result.ok).toBe(true);
  });

  it('does not require an origin for a read-only endpoint', () => {
    expect(guardRequest(request({}, 'GET'), { methods: ['GET'] }).ok).toBe(true);
  });
});

describe('guardRequest — body', () => {
  it('refuses a body larger than the ceiling before parsing it', () => {
    const rejected = guardRequest(
      request({ ...BROWSER_POST, 'content-length': '999999' }),
      { methods: ['POST'], maxBodyBytes: 1024 },
    );

    expect(rejected).toMatchObject({ ok: false, status: 413, reason: 'body-size' });
  });

  it('accepts a body at the ceiling', () => {
    const result = guardRequest(
      request({ ...BROWSER_POST, 'content-length': '1024' }),
      { methods: ['POST'], maxBodyBytes: 1024 },
    );

    expect(result.ok).toBe(true);
  });

  it('refuses a non-JSON content type with 415', () => {
    const rejected = guardRequest(
      request({ ...BROWSER_POST, 'content-type': 'text/plain' }),
      { methods: ['POST'] },
    );

    expect(rejected).toMatchObject({ ok: false, status: 415, reason: 'content-type' });
  });

  it('accepts a JSON content type carrying a charset', () => {
    const result = guardRequest(
      request({ ...BROWSER_POST, 'content-type': 'application/json; charset=utf-8' }),
      { methods: ['POST'] },
    );

    expect(result.ok).toBe(true);
  });
});

describe('applyApiResponseHeaders', () => {
  it('advertises the methods and forbids caching, indexing and referrers', () => {
    const res = createResponse();

    applyApiResponseHeaders(res.res, ['POST']);

    expect(res.header('Allow')).toBe('POST');
    expect(res.header('Cache-Control')).toBe('no-store');
    expect(res.header('X-Content-Type-Options')).toBe('nosniff');
    expect(res.header('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(res.header('Referrer-Policy')).toBe('no-referrer');
  });

  it('never sends an Access-Control-Allow-Origin header', () => {
    const res = createResponse();

    applyApiResponseHeaders(res.res, ['GET']);

    expect(res.header('Access-Control-Allow-Origin')).toBeUndefined();
  });
});
