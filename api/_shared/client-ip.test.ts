import type { IncomingHttpHeaders } from 'http';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import clientIp from './client-ip.js';

const { extractEdgeIp, resolveClientIp, verifyCloudflareOrigin } = clientIp;

// This module decides who a request is from, which every rate limit and every
// quota then keys on. The cases that matter are the adversarial ones: a caller
// that gets to choose its own identity gets to choose its own allowance.

const SECRET = 'test-origin-secret';
const ORIGINAL_ENV = { ...process.env };

const asHeaders = (headers: Record<string, string>) => headers as IncomingHttpHeaders;

/** What Cloudflare forwards: its own edge as the peer, the visitor in cf-connecting-ip. */
const viaCloudflare = (overrides: Record<string, string> = {}) =>
  asHeaders({
    'x-forwarded-for': '172.68.1.1',
    'cf-connecting-ip': '203.0.113.9',
    'x-origin-verify': SECRET,
    ...overrides,
  });

beforeEach(() => {
  delete process.env.CLOUDFLARE_ORIGIN_SECRET;
  delete process.env.CLOUDFLARE_ORIGIN_ENFORCE;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('extractEdgeIp', () => {
  it('takes the first hop of x-forwarded-for', () => {
    expect(extractEdgeIp(asHeaders({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))).toBe(
      '1.2.3.4',
    );
  });

  it('unwraps an IPv4-mapped IPv6 address', () => {
    expect(extractEdgeIp(asHeaders({ 'x-forwarded-for': '::ffff:1.2.3.4' }))).toBe('1.2.3.4');
  });

  it('never reads cf-connecting-ip: that header is the caller talking', () => {
    expect(extractEdgeIp(asHeaders({ 'cf-connecting-ip': '8.8.8.8' }))).toBe('');
  });

  it('returns an empty string rather than guessing', () => {
    expect(extractEdgeIp(asHeaders({}))).toBe('');
    expect(extractEdgeIp(undefined as unknown as IncomingHttpHeaders)).toBe('');
  });
});

describe('verifyCloudflareOrigin', () => {
  it('reports "not configured" while no secret is set', () => {
    expect(verifyCloudflareOrigin(viaCloudflare())).toEqual({
      configured: false,
      verified: false,
      enforced: false,
    });
  });

  it('verifies a request carrying the right secret', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    expect(verifyCloudflareOrigin(viaCloudflare())).toMatchObject({
      configured: true,
      verified: true,
    });
  });

  it('refuses a wrong, empty or absent secret', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    for (const headers of [
      viaCloudflare({ 'x-origin-verify': 'wrong' }),
      viaCloudflare({ 'x-origin-verify': '' }),
      asHeaders({ 'x-forwarded-for': '203.0.113.9' }),
    ]) {
      expect(verifyCloudflareOrigin(headers).verified).toBe(false);
    }
  });

  it('refuses a secret that is merely a prefix of the real one', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    expect(
      verifyCloudflareOrigin(viaCloudflare({ 'x-origin-verify': SECRET.slice(0, 5) }))
        .verified,
    ).toBe(false);
  });

  it('separates enforcement from verification', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;
    expect(verifyCloudflareOrigin(viaCloudflare()).enforced).toBe(false);

    process.env.CLOUDFLARE_ORIGIN_ENFORCE = 'true';
    expect(verifyCloudflareOrigin(viaCloudflare()).enforced).toBe(true);
  });
});

describe('resolveClientIp', () => {
  it('returns the edge address when Cloudflare is not configured', () => {
    // The pooling this module exists to fix: before the Transform Rule is in
    // place, everyone behind one Cloudflare datacenter shares this value.
    expect(resolveClientIp(viaCloudflare())).toBe('172.68.1.1');
  });

  it('returns the visitor once the hop is proven', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    expect(resolveClientIp(viaCloudflare())).toBe('203.0.113.9');
  });

  it('ignores a forged cf-connecting-ip sent straight to the origin', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    // Someone hitting the Vercel URL directly, claiming to be anyone they like.
    const forged = asHeaders({
      'x-forwarded-for': '198.51.100.7',
      'cf-connecting-ip': 'whatever-they-want',
    });

    expect(resolveClientIp(forged)).toBe('198.51.100.7');
  });

  it('falls back to the edge when Cloudflare sends no visitor address', () => {
    process.env.CLOUDFLARE_ORIGIN_SECRET = SECRET;

    expect(resolveClientIp(viaCloudflare({ 'cf-connecting-ip': '' }))).toBe('172.68.1.1');
  });
});
