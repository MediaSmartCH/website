import type { IncomingHttpHeaders } from 'http';

import type { ApiResponse } from './http-types';
import recaptcha from './recaptcha.js';

const { extractClientIp } = recaptcha;

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  windowSeconds: number;
}

const CLEANUP_INTERVAL_MS = 60_000;
const MAX_TRACKED_KEYS = 5_000;

const globalRateLimitState = globalThis as typeof globalThis & {
  __mediaSmartRateLimitBuckets?: Map<string, RateLimitBucket>;
  __mediaSmartRateLimitLastCleanup?: number;
};

const buckets =
  globalRateLimitState.__mediaSmartRateLimitBuckets ??
  (globalRateLimitState.__mediaSmartRateLimitBuckets = new Map());

function normalizeUserAgent(headers: IncomingHttpHeaders) {
  const userAgent = headers['user-agent'];
  const raw = Array.isArray(userAgent) ? userAgent[0] : userAgent;

  return typeof raw === 'string'
    ? raw.trim().toLowerCase().slice(0, 160)
    : '';
}

function maybeCleanupBuckets(now: number) {
  const lastCleanup = globalRateLimitState.__mediaSmartRateLimitLastCleanup ?? 0;
  const shouldCleanupByAge = now - lastCleanup >= CLEANUP_INTERVAL_MS;
  const shouldCleanupBySize = buckets.size >= MAX_TRACKED_KEYS;

  if (!shouldCleanupByAge && !shouldCleanupBySize) {
    return;
  }

  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  });

  // Keep the store bounded even if an attacker rotates identifiers quickly.
  while (buckets.size > MAX_TRACKED_KEYS) {
    const oldestKey = buckets.keys().next().value;

    if (!oldestKey) {
      break;
    }

    buckets.delete(oldestKey);
  }

  globalRateLimitState.__mediaSmartRateLimitLastCleanup = now;
}

export function getRateLimitIdentifier(headers: IncomingHttpHeaders) {
  const clientIp = extractClientIp(headers);
  const userAgent = normalizeUserAgent(headers);

  if (clientIp && userAgent) {
    return `${clientIp}:${userAgent}`;
  }

  return clientIp || userAgent || 'anonymous';
}

export function checkRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  maybeCleanupBuckets(now);

  const key = `${namespace}:${identifier || 'anonymous'}`;
  const currentBucket = buckets.get(key);
  const activeBucket =
    currentBucket && currentBucket.resetAt > now
      ? currentBucket
      : { count: 0, resetAt: now + windowMs };

  activeBucket.count += 1;
  buckets.set(key, activeBucket);

  const windowSeconds = Math.ceil(windowMs / 1000);
  const retryAfterSeconds = Math.max(
    Math.ceil((activeBucket.resetAt - now) / 1000),
    1
  );

  return {
    ok: activeBucket.count <= limit,
    limit,
    remaining: Math.max(limit - activeBucket.count, 0),
    resetAt: activeBucket.resetAt,
    retryAfterSeconds,
    windowSeconds,
  };
}

export function applyRateLimitHeaders(
  res: ApiResponse,
  result: RateLimitResult
) {
  res.setHeader('RateLimit-Limit', String(result.limit));
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader(
    'RateLimit-Reset',
    String(Math.max(Math.ceil((result.resetAt - Date.now()) / 1000), 0))
  );
  res.setHeader(
    'RateLimit-Policy',
    `${result.limit};w=${result.windowSeconds}`
  );

  if (!result.ok) {
    res.setHeader('Retry-After', String(result.retryAfterSeconds));
  }
}
