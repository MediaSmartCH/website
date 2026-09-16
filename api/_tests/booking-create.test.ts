import { describe, it, expect, beforeEach, vi } from 'vitest';

import { createRequest, createResponse, uniqueClientHeaders } from './http-fixtures.js';

// Characterisation tests for POST /api/booking/create.
//
// This is the only unauthenticated booking endpoint and the only one that
// mutates three systems at once (D1, Google Calendar, Resend). The ordering and
// the rollbacks are the whole point: the row is claimed first so the partial
// unique index arbitrates concurrent bookings, then the calendar event is
// created, then the two are linked — and any failure after the claim must undo
// what came before. These tests pin that sequence.

process.env.BOOKING_HMAC_SECRET ??= 'test-booking-secret';
process.env.SITE_ORIGIN ??= 'https://example.test';

const exec = vi.fn();
const queryFirst = vi.fn();
const isUniqueConstraintError = vi.fn();
const createEvent = vi.fn();
const deleteEvent = vi.fn();
const getBusyIntervals = vi.fn();
const sendBookingConfirmation = vi.fn();
const isSlotValid = vi.fn();
const verifyRecaptcha = vi.fn();

vi.mock('../booking/_lib/d1.js', () => ({
  exec: (...args: unknown[]) => exec(...args),
  queryFirst: (...args: unknown[]) => queryFirst(...args),
  isUniqueConstraintError: (...args: unknown[]) => isUniqueConstraintError(...args),
}));

vi.mock('../booking/_lib/google-calendar.js', () => ({
  createEvent: (...args: unknown[]) => createEvent(...args),
  deleteEvent: (...args: unknown[]) => deleteEvent(...args),
  getBusyIntervals: (...args: unknown[]) => getBusyIntervals(...args),
}));

vi.mock('../booking/_lib/mailer.js', () => ({
  sendBookingConfirmation: (...args: unknown[]) => sendBookingConfirmation(...args),
}));

vi.mock('../booking/_lib/slots.js', async () => {
  const actual = await vi.importActual<any>('../booking/_lib/slots.js');
  return { ...actual, isSlotValid: (...args: unknown[]) => isSlotValid(...args) };
});

vi.mock('../_shared/recaptcha.js', async () => {
  const actual = await vi.importActual<any>('../_shared/recaptcha.js');
  return {
    default: {
      ...actual.default,
      verifyRecaptcha: (...args: unknown[]) => verifyRecaptcha(...args),
    },
  };
});

const { default: handler } = await import('../booking/create.js');

const START_UTC = '2027-02-15T09:00:00.000Z';
const VALID_BODY = {
  name: 'Ada Lovelace',
  email: 'ada@example.ch',
  message: 'Looking forward to it',
  language: 'fr',
  startUtc: START_UTC,
};

function postBooking(body: Record<string, unknown> = {}) {
  return createRequest({ headers: uniqueClientHeaders(), body: { ...VALID_BODY, ...body } });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  getBusyIntervals.mockResolvedValue([]);
  isSlotValid.mockReturnValue(true);
  verifyRecaptcha.mockResolvedValue({ ok: true });
  isUniqueConstraintError.mockReturnValue(false);
  exec.mockResolvedValue({ changes: 1 });
  createEvent.mockResolvedValue({ id: 'evt-1', meetLink: 'https://meet.example/abc' });
  deleteEvent.mockResolvedValue(undefined);
  sendBookingConfirmation.mockResolvedValue(undefined);
  queryFirst.mockResolvedValue({
    id: 'row-id',
    start_at: Math.floor(new Date(START_UTC).getTime() / 1000),
    end_at: Math.floor(new Date(START_UTC).getTime() / 1000) + 1800,
    attendee_email: 'ada@example.ch',
    status: 'confirmed',
  });
});

describe('booking/create — guards before any write', () => {
  it('rejects a non-POST method with 405 and advertises POST', async () => {
    const res = createResponse();
    await handler(createRequest({ method: 'GET', headers: uniqueClientHeaders() }), res.res);

    expect(res.statusCode()).toBe(405);
    expect(res.header('Allow')).toBe('POST');
    expect(res.header('Cache-Control')).toBe('no-store');
    expect(exec).not.toHaveBeenCalled();
  });

  it('allows five attempts per IP then answers 429', async () => {
    const headers = uniqueClientHeaders();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const res = createResponse();
      await handler(createRequest({ headers, body: VALID_BODY }), res.res);
      expect(res.statusCode()).toBe(201);
    }

    const blocked = createResponse();
    await handler(createRequest({ headers, body: VALID_BODY }), blocked.res);

    expect(blocked.statusCode()).toBe(429);
    expect(blocked.body()).toEqual({ success: false, message: 'Rate limited' });
  });

  it('returns the structured validation error on a bad payload', async () => {
    const res = createResponse();
    await handler(postBooking({ email: 'nope' }), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toMatchObject({
      success: false,
      error: { field: 'email', code: 'invalid' },
    });
    expect(verifyRecaptcha).not.toHaveBeenCalled();
  });

  it('silently accepts a filled honeypot without touching the calendar or DB', async () => {
    const res = createResponse();
    await handler(postBooking({ website: 'spam' }), res.res);

    expect(res.statusCode()).toBe(200);
    expect(res.body()).toEqual({ success: true, bookingId: 'honeypot' });
    expect(verifyRecaptcha).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
    expect(createEvent).not.toHaveBeenCalled();
  });

  it('verifies reCAPTCHA against the booking_create action', async () => {
    await handler(postBooking({ recaptchaToken: 'tok' }), createResponse().res);

    expect(verifyRecaptcha).toHaveBeenCalledWith(
      expect.objectContaining({ token: 'tok', expectedAction: 'booking_create' }),
    );
  });

  it('propagates a reCAPTCHA rejection, defaulting a missing status to 400', async () => {
    verifyRecaptcha.mockResolvedValue({ ok: false, message: 'nope' });

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(400);
    expect(res.body()).toEqual({ success: false, message: 'nope' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('booking/create — availability re-check', () => {
  it('answers 502 when the calendar free/busy lookup fails', async () => {
    getBusyIntervals.mockRejectedValue(new Error('google down'));

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Calendar unavailable' });
    expect(exec).not.toHaveBeenCalled();
  });

  it('answers 409 when the slot is no longer valid server-side', async () => {
    isSlotValid.mockReturnValue(false);

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Slot is no longer available' });
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('booking/create — claim, event, link ordering', () => {
  it('claims the row before creating the calendar event', async () => {
    const order: string[] = [];
    exec.mockImplementation(async (sql: string) => {
      order.push(sql.trim().startsWith('INSERT') ? 'insert' : 'update');
      return { changes: 1 };
    });
    createEvent.mockImplementation(async () => {
      order.push('createEvent');
      return { id: 'evt-1', meetLink: null };
    });

    await handler(postBooking(), createResponse().res);

    expect(order).toEqual(['insert', 'createEvent', 'update']);
  });

  it('answers 409 when the unique index rejects a concurrent claim', async () => {
    exec.mockRejectedValueOnce(new Error('UNIQUE constraint failed'));
    isUniqueConstraintError.mockReturnValue(true);

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(409);
    expect(res.body()).toEqual({ success: false, message: 'Slot is no longer available' });
    expect(createEvent).not.toHaveBeenCalled();
  });

  it('answers 500 on any other claim failure', async () => {
    exec.mockRejectedValueOnce(new Error('disk full'));

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: 'Could not save booking' });
    expect(createEvent).not.toHaveBeenCalled();
  });

  it('releases the claimed row when the calendar insert fails', async () => {
    createEvent.mockRejectedValue(new Error('calendar down'));

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(502);
    expect(res.body()).toEqual({ success: false, message: 'Could not create event' });
    expect(exec).toHaveBeenCalledWith(
      'DELETE FROM bookings WHERE id = ?',
      expect.any(Array),
    );
  });

  it('undoes both the event and the row when linking them fails', async () => {
    exec.mockResolvedValueOnce({ changes: 1 }).mockRejectedValueOnce(new Error('db gone'));

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(res.body()).toEqual({ success: false, message: 'Could not save booking' });
    expect(deleteEvent).toHaveBeenCalledWith('evt-1');
    expect(exec).toHaveBeenCalledWith(
      'DELETE FROM bookings WHERE id = ?',
      expect.any(Array),
    );
  });

  it('treats a vanished reserved row as a rollback case', async () => {
    exec.mockResolvedValueOnce({ changes: 1 }).mockResolvedValueOnce({ changes: 0 });

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(500);
    expect(deleteEvent).toHaveBeenCalledWith('evt-1');
  });
});

describe('booking/create — success', () => {
  it('answers 201 with the stored slot, the meet link and both manage URLs', async () => {
    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(201);
    const body = res.body() as any;
    expect(body.success).toBe(true);
    expect(body.booking.startUtc).toBe(START_UTC);
    expect(body.booking.meetLink).toBe('https://meet.example/abc');
    expect(body.booking.manageUrl).toContain('/fr/booking/manage?id=');
    expect(body.booking.cancelUrl).toContain('&action=cancel');
  });

  it('prefixes the manage links with the language used to book', async () => {
    const res = createResponse();
    await handler(postBooking({ language: 'en' }), res.res);

    expect((res.body() as any).booking.manageUrl).toContain('/en/booking/manage');
  });

  it('still answers 201 when the confirmation email fails', async () => {
    sendBookingConfirmation.mockRejectedValue(new Error('resend down'));

    const res = createResponse();
    await handler(postBooking(), res.res);

    expect(res.statusCode()).toBe(201);
    expect((res.body() as any).success).toBe(true);
  });

  it('sends the confirmation with the attendee details and both links', async () => {
    await handler(postBooking(), createResponse().res);

    expect(sendBookingConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        attendeeName: 'Ada Lovelace',
        attendeeEmail: 'ada@example.ch',
        language: 'fr',
        meetLink: 'https://meet.example/abc',
      }),
    );
  });
});
