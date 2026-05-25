import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

import { getRuntimeEnv } from './config';

// Cancellation / reschedule links are stateless: each booking gets a token
// derived from `HMAC(secret, bookingId + ":" + purpose)`. Storing nothing
// extra in the DB means we can't accidentally leak tokens via a DB dump and
// rotating the HMAC secret invalidates every outstanding link at once.

type TokenPurpose = 'cancel' | 'reschedule';

function compute(bookingId: string, purpose: TokenPurpose): string {
  const secret = getRuntimeEnv().bookingSecret;
  return createHmac('sha256', secret)
    .update(`${bookingId}:${purpose}`)
    .digest('base64url');
}

export function generateToken(bookingId: string, purpose: TokenPurpose): string {
  return compute(bookingId, purpose);
}

export function verifyToken(
  bookingId: string,
  purpose: TokenPurpose,
  candidate: string,
): boolean {
  const expected = compute(bookingId, purpose);
  // Constant-time comparison guards against the timing side-channel that
  // string equality would expose. Length mismatch is its own short-circuit
  // because timingSafeEqual throws otherwise.
  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function newBookingId(): string {
  return randomUUID();
}
