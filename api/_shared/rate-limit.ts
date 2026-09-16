import type { IncomingHttpHeaders } from 'http';

import type { ApiResponse } from './http-types.js';
import recaptcha from './recaptcha.js';
import { counterKey, recordHit } from './security-counters.js';

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
  /** Requests counted in the current window, including this one. */
  hits: number;
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
  // Key on the client IP only. On Vercel `x-forwarded-for` is overwritten with
  // the real client IP and client-supplied values are not forwarded, so the IP
  // is trustworthy. We deliberately do NOT fold in the User-Agent: it is fully
  // client-controlled, so mixing it into the key let an attacker mint a fresh
  // rate-limit bucket on every request just by rotating the header.
  return extractClientIp(headers) || 'anonymous';
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
    hits: activeBucket.count,
    limit,
    remaining: Math.max(limit - activeBucket.count, 0),
    resetAt: activeBucket.resetAt,
    retryAfterSeconds,
    windowSeconds,
  };
}

export interface DurableRateLimitOptions extends RateLimitOptions {
  /**
   * Skip the shared store until the in-memory counter reaches this many hits.
   *
   * Read-only endpoints are called on every page view, and a D1 round-trip per
   * call would make the shared store the slowest part of rendering a calendar.
   * Below the threshold the per-instance counter is enough; above it the
   * traffic no longer looks like browsing and is worth the round-trip.
   * Omitted means "always consult the shared store".
   */
  durableAfter?: number;
}

export interface EnforcedRateLimitResult extends RateLimitResult {
  /** True when the verdict accounts for traffic seen by other instances. */
  durable: boolean;
}

/**
 * The rate-limit check endpoints should use.
 *
 * Counts the request in the per-instance bucket first — free, instant, and
 * enough to stop a naive flood — then confirms against the shared counters so
 * a burst spread across parallel instances is caught too. The stricter of the
 * two verdicts wins.
 *
 * When the shared store is unavailable the in-memory verdict stands and
 * `durable` is false: a Cloudflare outage degrades the ceiling, it does not
 * close the form.
 */
export async function enforceRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
  durableAfter,
}: DurableRateLimitOptions): Promise<EnforcedRateLimitResult> {
  const local = checkRateLimit({ namespace, identifier, limit, windowMs });

  if (!local.ok) {
    return { ...local, durable: false };
  }

  if (durableAfter !== undefined && local.hits <= durableAfter) {
    return { ...local, durable: false };
  }

  const shared = await recordHit(
    counterKey(`rl:${namespace}`, identifier || 'anonymous'),
    windowMs,
  );

  if (!shared) {
    return { ...local, durable: false };
  }

  const hits = Math.max(local.hits, shared.hits);
  const resetAt = Math.max(local.resetAt, shared.resetAt);
  const windowSeconds = Math.ceil(windowMs / 1000);

  return {
    ok: hits <= limit,
    hits,
    limit,
    remaining: Math.max(limit - hits, 0),
    resetAt,
    retryAfterSeconds: Math.max(Math.ceil((resetAt - Date.now()) / 1000), 1),
    windowSeconds,
    durable: true,
  };
}

/**
 * `hits` is deliberately not required: these headers describe the allowance,
 * not the traffic, so any verdict shape can be rendered with them.
 */
export function applyRateLimitHeaders(
  res: ApiResponse,
  result: Omit<RateLimitResult, 'hits'>
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
