import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';

// The HMAC secret is read lazily and memoised on first access, so it has to be
// in place before any token is produced.
process.env.BOOKING_HMAC_SECRET ??= 'test-booking-secret';

import { generateToken, newBookingId, verifyToken } from './tokens.js';

// Characterisation tests for the manage-link tokens. These pin the security
// properties the booking flow relies on: links expire, they are scoped to one
// booking and one purpose, and rescheduling revokes every previous link.

const BOOKING_ID = 'booking-1';
const OTHER_BOOKING_ID = 'booking-2';
const VERSION = 1;

let sample: string;

beforeAll(() => {
  sample = generateToken(BOOKING_ID, 'cancel', VERSION);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('generateToken', () => {
  it('produces an "<exp>.<signature>" pair with a future expiry', () => {
    const [expPart, signature] = sample.split('.');

    expect(Number.isInteger(Number(expPart))).toBe(true);
    expect(Number(expPart) * 1000).toBeGreaterThan(Date.now());
    expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('derives different tokens for different purposes', () => {
    const cancel = generateToken(BOOKING_ID, 'cancel', VERSION, 60_000);
    const reschedule = generateToken(BOOKING_ID, 'reschedule', VERSION, 60_000);

    expect(cancel.split('.')[1]).not.toBe(reschedule.split('.')[1]);
  });
});

describe('verifyToken — accepted', () => {
  it('accepts a freshly generated token for the same id, purpose and version', () => {
    expect(verifyToken(BOOKING_ID, 'cancel', VERSION, sample)).toBe(true);
  });

  it('accepts a token right up to its expiry', () => {
    const token = generateToken(BOOKING_ID, 'cancel', VERSION, 10_000);
    const exp = Number(token.split('.')[0]);

    vi.setSystemTime(new Date(exp * 1000));
    expect(verifyToken(BOOKING_ID, 'cancel', VERSION, token)).toBe(true);
  });
});

describe('verifyToken — rejected', () => {
  it('rejects a token issued for another booking', () => {
    expect(verifyToken(OTHER_BOOKING_ID, 'cancel', VERSION, sample)).toBe(false);
  });

  it('rejects a cancel token presented for rescheduling', () => {
    expect(verifyToken(BOOKING_ID, 'reschedule', VERSION, sample)).toBe(false);
  });

  it('rejects a token from a superseded version, so rescheduling revokes old links', () => {
    expect(verifyToken(BOOKING_ID, 'cancel', VERSION + 1, sample)).toBe(false);
  });

  it('rejects an expired token', () => {
    const token = generateToken(BOOKING_ID, 'cancel', VERSION, 1_000);
    const exp = Number(token.split('.')[0]);

    vi.setSystemTime(new Date(exp * 1000 + 1));
    expect(verifyToken(BOOKING_ID, 'cancel', VERSION, token)).toBe(false);
  });

  it('rejects a tampered signature of the same length', () => {
    const [exp, signature] = sample.split('.');
    const flipped = signature[0] === 'A' ? 'B' : 'A';

    expect(
      verifyToken(BOOKING_ID, 'cancel', VERSION, `${exp}.${flipped}${signature.slice(1)}`),
    ).toBe(false);
  });

  const malformed: Array<[string, string]> = [
    ['an empty string', ''],
    ['no separator', 'abcdef'],
    ['a leading separator', '.abcdef'],
    ['a non-numeric expiry', 'later.abcdef'],
    ['a fractional expiry', '1.5.abcdef'],
    ['an empty signature', `${Math.floor(Date.now() / 1000) + 60}.`],
  ];

  it.each(malformed)('rejects %s', (_label, candidate) => {
    expect(verifyToken(BOOKING_ID, 'cancel', VERSION, candidate)).toBe(false);
  });
});

describe('newBookingId', () => {
  it('returns a unique UUID each call', () => {
    const ids = new Set(Array.from({ length: 50 }, () => newBookingId()));

    expect(ids.size).toBe(50);
    for (const id of ids) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
  });
});
