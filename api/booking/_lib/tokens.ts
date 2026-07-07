import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

import { getRuntimeEnv } from './config';

// Cancellation / reschedule links are stateless-ish: each booking gets a token
// derived from `HMAC(secret, bookingId + ":" + purpose + ":" + exp + ":" + version)`.
//
// Two properties are bound into the signed message so a leaked link is not a
// permanent, unrevocable bearer credential:
//   - `exp`     — a unix-seconds expiry. verifyToken refuses expired tokens, so
//                 a link that leaks (forwarded email, referrer, proxy log) only
//                 grants access for a bounded window.
//   - `version` — the booking's `token_version` column. Rescheduling bumps it,
//                 which invalidates every previously-issued link for that
//                 booking without touching the global HMAC secret.
//
// The wire format is `${exp}.${signature}` where signature is base64url. The
// server still stores nothing token-specific beyond the small integer
// token_version, so a DB dump cannot leak usable tokens.

type TokenPurpose = 'cancel' | 'reschedule';

// Manage links stay valid comfortably past the 28-day booking horizon so a
// visitor can always cancel/reschedule up to (and shortly after) their slot.
const MANAGE_TOKEN_TTL_MS = 45 * 24 * 60 * 60 * 1000;

function compute(
  bookingId: string,
  purpose: TokenPurpose,
  exp: number,
  version: number,
): string {
  const secret = getRuntimeEnv().bookingSecret;
  return createHmac('sha256', secret)
    .update(`${bookingId}:${purpose}:${exp}:${version}`)
    .digest('base64url');
}

export function generateToken(
  bookingId: string,
  purpose: TokenPurpose,
  version: number,
  ttlMs: number = MANAGE_TOKEN_TTL_MS,
): string {
  const exp = Math.floor((Date.now() + ttlMs) / 1000);
  return `${exp}.${compute(bookingId, purpose, exp, version)}`;
}

export function verifyToken(
  bookingId: string,
  purpose: TokenPurpose,
  version: number,
  candidate: string,
): boolean {
  const dot = candidate.indexOf('.');
  if (dot <= 0) return false;

  const expStr = candidate.slice(0, dot);
  const signature = candidate.slice(dot + 1);
  const exp = Number(expStr);
  // Reject non-integer or already-expired tokens before touching the HMAC.
  if (!Number.isInteger(exp) || exp * 1000 < Date.now()) return false;

  const expected = compute(bookingId, purpose, exp, version);
  // Constant-time comparison guards against the timing side-channel that
  // string equality would expose. Length mismatch is its own short-circuit
  // because timingSafeEqual throws otherwise.
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function newBookingId(): string {
  return randomUUID();
}
