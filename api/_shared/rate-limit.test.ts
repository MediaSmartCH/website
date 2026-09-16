import { describe, it, expect, afterEach, vi } from 'vitest';

import type { IncomingHttpHeaders } from 'http';

import type { ApiResponse } from './http-types.js';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from './rate-limit.js';

// Characterisation tests for the in-memory rate limiter shared by the contact,
// newsletter and booking endpoints. Buckets live in a module-global map, so
// every test uses its own namespace to stay isolated.

let namespaceCounter = 0;
const freshNamespace = () => `test-${namespaceCounter++}`;

afterEach(() => {
  vi.useRealTimers();
});

/** Minimal ApiResponse stand-in that records setHeader calls. */
function createResponseSpy() {
  const headers = new Map<string, string>();
  const res = {
    setHeader: (name: string, value: string) => headers.set(name, value),
  } as unknown as ApiResponse;

  return { res, headers };
}

describe('checkRateLimit', () => {
  it('allows exactly `limit` requests then refuses the next one', () => {
    const namespace = freshNamespace();
    const call = () =>
      checkRateLimit({ namespace, identifier: '1.2.3.4', limit: 3, windowMs: 60_000 });

    expect(call().ok).toBe(true);
    expect(call().ok).toBe(true);
    expect(call().ok).toBe(true);
    expect(call().ok).toBe(false);
  });

  it('reports the remaining allowance and never goes below zero', () => {
    const namespace = freshNamespace();
    const call = () =>
      checkRateLimit({ namespace, identifier: '1.2.3.4', limit: 2, windowMs: 60_000 });

    expect(call().remaining).toBe(1);
    expect(call().remaining).toBe(0);
    expect(call().remaining).toBe(0);
  });

  it('tracks identifiers independently', () => {
    const namespace = freshNamespace();
    const call = (identifier: string) =>
      checkRateLimit({ namespace, identifier, limit: 1, windowMs: 60_000 });

    expect(call('1.1.1.1').ok).toBe(true);
    expect(call('2.2.2.2').ok).toBe(true);
    expect(call('1.1.1.1').ok).toBe(false);
  });

  it('tracks namespaces independently', () => {
    const a = freshNamespace();
    const b = freshNamespace();
    const call = (namespace: string) =>
      checkRateLimit({ namespace, identifier: 'same-ip', limit: 1, windowMs: 60_000 });

    expect(call(a).ok).toBe(true);
    expect(call(b).ok).toBe(true);
    expect(call(a).ok).toBe(false);
  });

  it('starts a new window once the previous one has elapsed', () => {
    vi.useFakeTimers();
    const namespace = freshNamespace();
    const call = () =>
      checkRateLimit({ namespace, identifier: '1.2.3.4', limit: 1, windowMs: 60_000 });

    expect(call().ok).toBe(true);
    expect(call().ok).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(call().ok).toBe(true);
  });

  it('folds an empty identifier into a shared "anonymous" bucket', () => {
    const namespace = freshNamespace();
    const call = () =>
      checkRateLimit({ namespace, identifier: '', limit: 1, windowMs: 60_000 });

    expect(call().ok).toBe(true);
    expect(call().ok).toBe(false);
  });

  it('always reports a retry delay of at least one second', () => {
    const result = checkRateLimit({
      namespace: freshNamespace(),
      identifier: '1.2.3.4',
      limit: 1,
      windowMs: 1,
    });

    expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(result.windowSeconds).toBe(1);
  });
});

describe('getRateLimitIdentifier', () => {
  const asHeaders = (headers: Record<string, string>) => headers as IncomingHttpHeaders;

  it('prefers x-forwarded-for and keeps only the first hop', () => {
    expect(
      getRateLimitIdentifier(asHeaders({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })),
    ).toBe('1.2.3.4');
  });

  it('unwraps an IPv4-mapped IPv6 address', () => {
    expect(getRateLimitIdentifier(asHeaders({ 'x-forwarded-for': '::ffff:1.2.3.4' }))).toBe(
      '1.2.3.4',
    );
  });

  it('falls through the header candidates in order', () => {
    expect(getRateLimitIdentifier(asHeaders({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9');
    expect(getRateLimitIdentifier(asHeaders({ 'cf-connecting-ip': '8.8.8.8' }))).toBe(
      '8.8.8.8',
    );
    expect(getRateLimitIdentifier(asHeaders({ forwarded: 'for=7.7.7.7' }))).toBe('7.7.7.7');
  });

  it('returns "anonymous" when no client IP header is present', () => {
    expect(getRateLimitIdentifier(asHeaders({}))).toBe('anonymous');
  });
});

describe('applyRateLimitHeaders', () => {
  it('advertises the policy on an allowed request without Retry-After', () => {
    const { res, headers } = createResponseSpy();

    applyRateLimitHeaders(res, {
      ok: true,
      limit: 5,
      remaining: 4,
      resetAt: Date.now() + 60_000,
      retryAfterSeconds: 60,
      windowSeconds: 60,
    });

    expect(headers.get('RateLimit-Limit')).toBe('5');
    expect(headers.get('RateLimit-Remaining')).toBe('4');
    expect(headers.get('RateLimit-Policy')).toBe('5;w=60');
    expect(headers.has('Retry-After')).toBe(false);
  });

  it('adds Retry-After once the limit is exceeded', () => {
    const { res, headers } = createResponseSpy();

    applyRateLimitHeaders(res, {
      ok: false,
      limit: 5,
      remaining: 0,
      resetAt: Date.now() + 30_000,
      retryAfterSeconds: 30,
      windowSeconds: 60,
    });

    expect(headers.get('Retry-After')).toBe('30');
  });

  it('never reports a negative reset delay', () => {
    const { res, headers } = createResponseSpy();

    applyRateLimitHeaders(res, {
      ok: true,
      limit: 5,
      remaining: 5,
      resetAt: Date.now() - 10_000,
      retryAfterSeconds: 1,
      windowSeconds: 60,
    });

    expect(Number(headers.get('RateLimit-Reset'))).toBe(0);
  });
});
