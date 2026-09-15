import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for GET /api/booking/lookup, the read-only endpoint
// behind the manage page. Two properties matter and are pinned here: a cancel
// token and a reschedule token both grant read access, and a missing booking
// is indistinguishable from a bad token so ids cannot be enumerated.

process.env.BOOKING_HMAC_SECRET ??= 'test-booking-secret';

const queryFirst = vi.fn();

vi.mock('../booking/_lib/d1.js', () => ({
  queryFirst: (...args: unknown[]) => queryFirst(...args),
  exec: vi.fn(),
  isUniqueConstraintError: vi.fn(),
}));

const { default: handler } = await import('../booking/lookup.js');
const { generateToken } = await import('../booking/_lib/tokens.js');

const BOOKING_ID = 'booking-1';
const START_SEC = Math.floor(Date.parse('2027-02-15T09:00:00.000Z') / 1000);

const ROW = {
  id: BOOKING_ID,
  attendee_name: 'Ada Lovelace',
  attendee_email: 'ada@example.ch',
  attendee_message: 'Hello',
  attendee_language: 'fr' as const,
  start_at: START_SEC,
  end_at: START_SEC + 1800,
  status: 'confirmed',
  calendar_event_id: 'evt-1',
  token_version: 0,
};

function getLookup(query: Record<string, string | string[]>) {
  return createRequest({ method: 'GET', headers: uniqueClientHeaders(), query });
}

beforeEach(() => {
  vi.clearAllMocks();
  queryFirst.mockResolvedValue({ ...ROW });
});

describe('booking/lookup — method and caching', () => {
  it('advertises GET-only and never caches', async () => {
    const res = createResponse();
    await handler(
      getLookup({ id: BOOKING_ID, token: generateToken(BOOKING_ID, 'cancel', 0) }),
      res.res,
    );

    expect(res.header('Allow')).toBe('GET');
    expect(res.header('Cache-Control')).toBe('no-store');
  });

  it('rejects a non-GET method with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'POST', headers: uniqueClientHeaders() }), res.res);

    expect(res.statusCode()).toBe(405);
    expect(queryFirst).not.toHaveBeenCalled();
  });
});

describe('booking/lookup — authorisation', () => {
  it('accepts a cancel token', async () => {
    const res = createResponse();
    await handler(
      getLookup({ id: BOOKING_ID, token: generateToken(BOOKING_ID, 'cancel', 0) }),
      res.res,
    );

    expect(res.statusCode()).toBe(200);
  });

  it('accepts a reschedule token for the same manage screen', async () => {
    const res = createResponse();
    await handler(
      getLookup({ id: BOOKING_ID, token: generateToken(BOOKING_ID, 'reschedule', 0) }),
      res.res,
    );

    expect(res.statusCode()).toBe(200);
  });

  it('returns 400 when the id or the token is missing', async () => {
    for (const query of [{ id: BOOKING_ID }, { token: 'whatever' }, {}]) {
      const res = createResponse();
      await handler(getLookup(query), res.res);

      expect(res.statusCode()).toBe(400);
      expect(res.body()).toEqual({ success: false, message: 'Missing id or token' });
    }
  });

  it('answers the same 403 for an unknown booking and for a bad token', async () => {
    const unknown = createResponse();
    queryFirst.mockResolvedValue(null);
    await handler(getLookup({ id: 'ghost', token: 'anything' }), unknown.res);

    const badToken = createResponse();
    queryFirst.mockResolvedValue({ ...ROW });
    await handler(getLookup({ id: BOOKING_ID, token: 'forged.token' }), badToken.res);

    expect(unknown.statusCode()).toBe(403);
    expect(badToken.statusCode()).toBe(403);
    expect(unknown.body()).toEqual(badToken.body());
  });

  it('rejects a token issued for a superseded token_version', async () => {
    const staleToken = generateToken(BOOKING_ID, 'reschedule', 0);
    queryFirst.mockResolvedValue({ ...ROW, token_version: 1 });

    const res = createResponse();
    await handler(getLookup({ id: BOOKING_ID, token: staleToken }), res.res);

    expect(res.statusCode()).toBe(403);
  });
});

describe('booking/lookup — payload', () => {
  it('maps the stored row to the public booking shape', async () => {
    const res = createResponse();
    await handler(
      getLookup({ id: BOOKING_ID, token: generateToken(BOOKING_ID, 'cancel', 0) }),
      res.res,
    );

    expect(res.body()).toEqual({
      success: true,
      booking: {
        id: BOOKING_ID,
        attendeeName: 'Ada Lovelace',
        attendeeEmail: 'ada@example.ch',
        message: 'Hello',
        language: 'fr',
        startUtc: '2027-02-15T09:00:00.000Z',
        endUtc: '2027-02-15T09:30:00.000Z',
        status: 'confirmed',
      },
    });
  });

  it('never leaks the calendar event id or the token version', async () => {
    const res = createResponse();
    await handler(
      getLookup({ id: BOOKING_ID, token: generateToken(BOOKING_ID, 'cancel', 0) }),
      res.res,
    );

    expect(JSON.stringify(res.body())).not.toContain('evt-1');
    expect(res.body()).not.toHaveProperty('booking.tokenVersion');
  });
});
