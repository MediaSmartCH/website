import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for POST /api/booking/cancel. The behaviours worth
// protecting are the idempotent re-cancel, the refusal to cancel a past slot,
// and the fact that the calendar is cleared before the row is marked cancelled.

process.env.BOOKING_HMAC_SECRET ??= 'test-booking-secret';
process.env.SITE_ORIGIN ??= 'https://example.test';

const exec = vi.fn();
const queryFirst = vi.fn();
const deleteEvent = vi.fn();
const sendBookingCancellation = vi.fn();

vi.mock('../booking/_lib/d1.js', () => ({
  exec: (...args: unknown[]) => exec(...args),
  queryFirst: (...args: unknown[]) => queryFirst(...args),
  isUniqueConstraintError: vi.fn(),
}));

vi.mock('../booking/_lib/google-calendar.js', () => ({
  deleteEvent: (...args: unknown[]) => deleteEvent(...args),
  createEvent: vi.fn(),
  getBusyIntervals: vi.fn(),
  updateEventTime: vi.fn(),
}));

vi.mock('../booking/_lib/mailer.js', () => ({
  sendBookingCancellation: (...args: unknown[]) => sendBookingCancellation(...args),
  sendBookingConfirmation: vi.fn(),
}));

const { default: handler } = await import('../booking/cancel.js');
const { generateToken } = await import('../booking/_lib/tokens.js');

const BOOKING_ID = 'booking-1';
const FUTURE_START_SEC = Math.floor(Date.parse('2027-02-15T09:00:00.000Z') / 1000);
const PAST_START_SEC = Math.floor(Date.parse('2020-01-01T09:00:00.000Z') / 1000);

const ROW = {
  id: BOOKING_ID,
  attendee_name: 'Ada Lovelace',
  attendee_email: 'ada@example.ch',
  attendee_language: 'fr' as const,
  start_at: FUTURE_START_SEC,
  status: 'confirmed',
  calendar_event_id: 'evt-1',
  token_version: 0,
};

const validToken = () => generateToken(BOOKING_ID, 'cancel', 0);

function postCancel(body: Record<string, unknown> = {}) {
  return createRequest({
    headers: uniqueClientHeaders(),
    body: { id: BOOKING_ID, token: validToken(), ...body },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  queryFirst.mockResolvedValue({ ...ROW });
  exec.mockResolvedValue({ changes: 1 });
  deleteEvent.mockResolvedValue(undefined);
  sendBookingCancellation.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('booking/cancel — guards', () => {
  it('advertises POST-only, never caches, and rejects GET with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.header('Allow')).toBe('POST');
    expect(res.header('Cache-Control')).toBe('no-store');
    expect(res.statusCode()).toBe(405);
  });

  it('returns 400 when the id or the token is missing', async () => {
    for (const body of [{ token: undefined }, { id: undefined }]) {
      const res = createResponse();
      await handler(postCancel(body), res.res);

      expect(res.statusCode()).toBe(400);
      expect(res.body()).toEqual({ success: false, message: 'Missing id or token' });
    }
  });

  it('answers the same 403 for an unknown booking and a bad token', async () => {
    const unknown = createResponse();
    queryFirst.mockResolvedValue(null);
    await handler(postCancel(), unknown.res);

    queryFirst.mockResolvedValue({ ...ROW });
    const badToken = createResponse();
    await handler(postCancel({ token: 'forged.token' }), badToken.res);

    expect(unknown.statusCode()).toBe(403);
    expect(badToken.statusCode()).toBe(403);
    expect(unknown.body()).toEqual(badToken.body());
    expect(deleteEvent).not.toHaveBeenCalled();
  });

  it('rejects a reschedule token presented for cancellation', async () => {
    const res = createResponse();
    await handler(postCancel({ token: generateToken(BOOKING_ID, 'reschedule', 0) }), res.res);

    expect(res.statusCode()).toBe(403);
  });

  it('allows ten attempts per IP then answers 429', async () => {
    const headers = uniqueClientHeaders();
    const request = () =>
      createRequest({ headers, body: { id: BOOKING_ID, token: validToken() } });

    for (let attempt = 0; attempt < 10; attempt += 1) {
      await handler(request(), createResponse().res);
    }

    const blocked = createResponse();
    await handler(request(), blocked.res);
    expect(blocked.statusCode()).toBe(429);
  });
});

describe('booking/cancel — state rules', () => {
  it('is idempotent: re-cancelling reports success without side effects', async () => {
    queryFirst.mockResolvedValue({ ...ROW, status: 'cancelled' });

    const res = createResponse();
    await handler(postCancel(), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true, alreadyCancelled: true });
    expect(deleteEvent).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
  });

  it('refuses to cancel a slot that already started', async () => {
    queryFirst.mockResolvedValue({ ...ROW, start_at: PAST_START_SEC });

    const res = createResponse();
    await handler(postCancel(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Slot is in the past' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('booking/cancel — calendar and persistence', () => {
  it('clears the calendar event before marking the row cancelled', async () => {
    const order: string[] = [];
    deleteEvent.mockImplementation(async () => {
      order.push('deleteEvent');
    });
    exec.mockImplementation(async () => {
      order.push('update');
      return { changes: 1 };
    });

    await handler(postCancel(), createResponse().res);

    expect(order).toEqual(['deleteEvent', 'update']);
  });

  it('aborts with 502 and keeps the booking when the calendar delete fails', async () => {
    deleteEvent.mockRejectedValue(new Error('google down'));

    const res = createResponse();
    await handler(postCancel(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Could not update calendar' });
    expect(exec).not.toHaveBeenCalled();
  });

  it('skips the calendar call when the booking has no event', async () => {
    queryFirst.mockResolvedValue({ ...ROW, calendar_event_id: null });

    const res = createResponse();
    await handler(postCancel(), res.res);

    expect(deleteEvent).not.toHaveBeenCalled();
    expect(res.statusCode()).toBe(200);
  });

  it('stores a trimmed reason, capped at 500 characters', async () => {
    await handler(postCancel({ reason: `  ${'a'.repeat(600)}  ` }), createResponse().res);

    const params = exec.mock.calls[0][1] as unknown[];
    expect((params[1] as string).length).toBe(500);
  });

  it('stores null when no reason is given', async () => {
    await handler(postCancel({ reason: '   ' }), createResponse().res);

    expect((exec.mock.calls[0][1] as unknown[])[1]).toBeNull();
  });

  it('still answers 200 when the cancellation email fails', async () => {
    sendBookingCancellation.mockRejectedValue(new Error('resend down'));

    const res = createResponse();
    await handler(postCancel(), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true });
  });

  it('emails the attendee with a rebooking link in their language', async () => {
    await handler(postCancel({ reason: 'conflict' }), createResponse().res);

    expect(sendBookingCancellation).toHaveBeenCalledWith(
      expect.objectContaining({
        attendeeEmail: 'ada@example.ch',
        language: 'fr',
        reason: 'conflict',
        rebookUrl: 'https://example.test/#contact',
      }),
    );
  });
});
