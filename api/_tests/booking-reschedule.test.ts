import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for POST /api/booking/reschedule.
//
// Two subtleties are pinned here. The booking's own calendar entry is filtered
// out of the busy set, so a visitor can move to an adjacent slot without
// colliding with themselves. And the DB claim rotates token_version in the same
// write, which revokes every previously e-mailed manage link — a calendar
// failure afterwards must revert that bump along with the new times.

process.env.BOOKING_HMAC_SECRET ??= 'test-booking-secret';
process.env.SITE_ORIGIN ??= 'https://example.test';

const exec = vi.fn();
const queryFirst = vi.fn();
const isUniqueConstraintError = vi.fn();
const getBusyIntervals = vi.fn();
const updateEventTime = vi.fn();
const sendBookingConfirmation = vi.fn();
const isSlotValid = vi.fn();

vi.mock('../booking/_lib/d1.js', () => ({
  exec: (...args: unknown[]) => exec(...args),
  queryFirst: (...args: unknown[]) => queryFirst(...args),
  isUniqueConstraintError: (...args: unknown[]) => isUniqueConstraintError(...args),
}));

vi.mock('../booking/_lib/google-calendar.js', () => ({
  getBusyIntervals: (...args: unknown[]) => getBusyIntervals(...args),
  updateEventTime: (...args: unknown[]) => updateEventTime(...args),
  createEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

vi.mock('../booking/_lib/mailer.js', () => ({
  sendBookingConfirmation: (...args: unknown[]) => sendBookingConfirmation(...args),
  sendBookingCancellation: vi.fn(),
}));

vi.mock('../booking/_lib/slots.js', async () => {
  const actual = await vi.importActual<any>('../booking/_lib/slots.js');
  return { ...actual, isSlotValid: (...args: unknown[]) => isSlotValid(...args) };
});

const { default: handler } = await import('../booking/reschedule.js');
const { generateToken } = await import('../booking/_lib/tokens.js');

const BOOKING_ID = 'booking-1';
const OLD_START_SEC = Math.floor(Date.parse('2027-02-15T09:00:00.000Z') / 1000);
const NEW_START = '2027-02-15T10:00:00.000Z';

const ROW = {
  id: BOOKING_ID,
  attendee_name: 'Ada Lovelace',
  attendee_email: 'ada@example.ch',
  attendee_message: 'Hello',
  attendee_language: 'fr' as const,
  start_at: OLD_START_SEC,
  end_at: OLD_START_SEC + 1800,
  status: 'confirmed',
  calendar_event_id: 'evt-1',
  token_version: 0,
};

const validToken = () => generateToken(BOOKING_ID, 'reschedule', 0);

function postReschedule(body: Record<string, unknown> = {}) {
  return createRequest({
    headers: uniqueClientHeaders(),
    body: { id: BOOKING_ID, token: validToken(), startUtc: NEW_START, ...body },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  queryFirst.mockResolvedValue({ ...ROW });
  exec.mockResolvedValue({ changes: 1 });
  getBusyIntervals.mockResolvedValue([]);
  isSlotValid.mockReturnValue(true);
  isUniqueConstraintError.mockReturnValue(false);
  updateEventTime.mockResolvedValue(undefined);
  sendBookingConfirmation.mockResolvedValue(undefined);
});

describe('booking/reschedule — input guards', () => {
  it('advertises POST-only and rejects GET with 405', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.header('Allow')).toBe('POST');
    expect(res.statusCode()).toBe(405);
  });

  it('returns 400 when id, token or startUtc is missing', async () => {
    for (const body of [{ id: undefined }, { token: undefined }, { startUtc: undefined }]) {
      const res = createResponse();
      await handler(postReschedule(body), res.res);

      expect(res.statusCode()).toBe(400);
      expect(res.body()).toEqual({
        success: false,
        message: 'Missing id, token, or startUtc',
      });
    }
  });

  it('returns 400 on an unparseable startUtc', async () => {
    const res = createResponse();
    await handler(postReschedule({ startUtc: 'not-a-date' }), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ success: false, message: 'Invalid startUtc' });
  });

  it('answers the same 403 for an unknown booking and a bad token', async () => {
    const unknown = createResponse();
    queryFirst.mockResolvedValue(null);
    await handler(postReschedule(), unknown.res);

    queryFirst.mockResolvedValue({ ...ROW });
    const badToken = createResponse();
    await handler(postReschedule({ token: 'forged.token' }), badToken.res);

    expect(unknown.statusCode()).toBe(403);
    expect(badToken.statusCode()).toBe(403);
    expect(unknown.body()).toEqual(badToken.body());
  });

  it('rejects a cancel token presented for rescheduling', async () => {
    const res = createResponse();
    await handler(
      postReschedule({ token: generateToken(BOOKING_ID, 'cancel', 0) }),
      res.res,
    );

    expect(res.statusCode()).toBe(403);
  });
});

describe('booking/reschedule — booking state', () => {
  it('refuses a booking that is not confirmed', async () => {
    queryFirst.mockResolvedValue({ ...ROW, status: 'cancelled' });

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Booking is not active' });
  });

  it('refuses a booking with no calendar event', async () => {
    queryFirst.mockResolvedValue({ ...ROW, calendar_event_id: null });

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Booking has no calendar event' });
  });
});

describe('booking/reschedule — availability', () => {
  it('answers 502 when the free/busy lookup fails', async () => {
    getBusyIntervals.mockRejectedValue(new Error('google down'));

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Calendar unavailable' });
    expect(exec).not.toHaveBeenCalled();
  });

  it("excludes the booking's own slot from the busy set", async () => {
    const own = {
      start: new Date(ROW.start_at * 1000),
      end: new Date(ROW.end_at * 1000),
    };
    const other = {
      start: new Date('2027-02-15T11:00:00.000Z'),
      end: new Date('2027-02-15T11:30:00.000Z'),
    };
    getBusyIntervals.mockResolvedValue([own, other]);

    await handler(postReschedule(), createResponse().res);

    expect(isSlotValid).toHaveBeenCalledWith(expect.any(Date), [other]);
  });

  it('answers 409 when the new slot is not bookable', async () => {
    isSlotValid.mockReturnValue(false);

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Slot is no longer available' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('booking/reschedule — claim and calendar move', () => {
  it('claims the new slot and bumps token_version before touching the calendar', async () => {
    await handler(postReschedule(), createResponse().res);

    const params = exec.mock.calls[0][1] as unknown[];
    expect(params[2]).toBe(ROW.token_version + 1);
    expect(updateEventTime).toHaveBeenCalledWith(
      'evt-1',
      expect.any(Date),
      expect.any(Date),
      expect.any(String),
    );
  });

  it('answers 409 when the unique index rejects the new slot', async () => {
    exec.mockRejectedValueOnce(new Error('UNIQUE constraint failed'));
    isUniqueConstraintError.mockReturnValue(true);

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(updateEventTime).not.toHaveBeenCalled();
  });

  it('answers 500 on any other claim failure', async () => {
    exec.mockRejectedValueOnce(new Error('disk full'));

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: 'Could not update booking' });
  });

  it('answers 409 when the booking was cancelled between the read and the claim', async () => {
    exec.mockResolvedValueOnce({ changes: 0 });

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Booking is not active' });
    expect(updateEventTime).not.toHaveBeenCalled();
  });

  it('reverts the times and the version bump when the calendar move fails', async () => {
    updateEventTime.mockRejectedValue(new Error('google down'));

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Could not update event' });

    const revertParams = exec.mock.calls[1][1] as unknown[];
    expect(revertParams[0]).toBe(ROW.start_at);
    expect(revertParams[1]).toBe(ROW.end_at);
    expect(revertParams[2]).toBe(ROW.token_version);
  });
});

describe('booking/reschedule — success', () => {
  it('answers 200 with the new slot and freshly versioned manage links', async () => {
    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(200);
    const body = res.body() as any;
    expect(body.booking.startUtc).toBe(NEW_START);
    expect(body.booking.endUtc).toBe('2027-02-15T10:30:00.000Z');
    expect(body.booking.manageUrl).toContain('/fr/booking/manage?id=');
    expect(body.booking.cancelUrl).toContain('&action=cancel');
  });

  it('issues links that only the bumped token_version accepts', async () => {
    const res = createResponse();
    await handler(postReschedule(), res.res);

    const manageUrl = new URL((res.body() as any).booking.manageUrl);
    const issued = manageUrl.searchParams.get('token') as string;
    const { verifyToken } = await import('../booking/_lib/tokens.js');

    expect(verifyToken(BOOKING_ID, 'reschedule', 1, issued)).toBe(true);
    expect(verifyToken(BOOKING_ID, 'reschedule', 0, issued)).toBe(false);
  });

  it('still answers 200 when the confirmation email fails', async () => {
    sendBookingConfirmation.mockRejectedValue(new Error('resend down'));

    const res = createResponse();
    await handler(postReschedule(), res.res);

    expect(res.statusCode()).toBe(200);
  });
});
