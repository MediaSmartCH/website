import type { ApiRequest, ApiResponse } from '../_shared/http-types.js';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit.js';

import { getRuntimeEnv } from './_lib/config.js';
import { exec, queryFirst } from './_lib/d1.js';
import { deleteEvent } from './_lib/google-calendar.js';
import { sendBookingCancellation } from './_lib/mailer.js';
import { verifyToken } from './_lib/tokens.js';

const CANCEL_RATE_LIMIT = {
  limit: 10,
  windowMs: 10 * 60 * 1000,
};

interface BookingRow {
  id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_language: 'fr' | 'en';
  start_at: number;
  status: string;
  calendar_event_id: string | null;
  token_version: number;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const rateLimitResult = checkRateLimit({
    namespace: 'booking-cancel',
    identifier: getRateLimitIdentifier(req.headers),
    ...CANCEL_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({ success: false, message: 'Rate limited' });
  }

  const body = (req.body ?? {}) as {
    id?: unknown;
    token?: unknown;
    reason?: unknown;
  };
  const id = typeof body.id === 'string' ? body.id : '';
  const token = typeof body.token === 'string' ? body.token : '';
  const reasonRaw = typeof body.reason === 'string' ? body.reason.trim() : '';
  const reason = reasonRaw.length > 0 ? reasonRaw.slice(0, 500) : null;

  if (!id || !token) {
    return res.status(400).json({ success: false, message: 'Missing id or token' });
  }

  // Fetch the row first: the token is versioned, so verification needs the
  // booking's current token_version. A missing row and a bad token return the
  // same 403 so an outsider cannot probe which booking ids exist.
  const row = await queryFirst<BookingRow>(
    `SELECT id, attendee_name, attendee_email, attendee_language, start_at, status, calendar_event_id, token_version
     FROM bookings WHERE id = ?`,
    [id],
  );

  if (!row || !verifyToken(id, 'cancel', row.token_version, token)) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }

  // Already cancelled = success (idempotent). Saves us reasoning about double
  // submits from a flaky network or a user mashing the button.
  if (row.status === 'cancelled') {
    return res.status(200).json({ success: true, alreadyCancelled: true });
  }

  // Refuse cancellations for past slots — the meeting either happened or was
  // missed; there is nothing to cancel and we don't want to send a confusing
  // cancellation email after the fact.
  const startMs = row.start_at * 1000;
  if (startMs < Date.now()) {
    return res
      .status(409)
      .json({ success: false, message: 'Slot is in the past' });
  }

  if (row.calendar_event_id) {
    try {
      await deleteEvent(row.calendar_event_id);
    } catch (err) {
      console.error('booking/cancel calendar delete failed', err);
      return res.status(502).json({ success: false, message: 'Could not update calendar' });
    }
  }

  const nowMs = Math.floor(Date.now() / 1000);
  await exec(
    `UPDATE bookings SET status = 'cancelled', cancelled_at = ?, cancel_reason = ?, updated_at = ? WHERE id = ?`,
    [nowMs, reason, nowMs, id],
  );

  try {
    const env = getRuntimeEnv();
    await sendBookingCancellation({
      attendeeName: row.attendee_name,
      attendeeEmail: row.attendee_email,
      start: new Date(startMs),
      language: row.attendee_language,
      rebookUrl: `${env.siteOrigin}/#contact`,
      reason,
    });
  } catch (err) {
    console.error('booking/cancel email failed', err);
  }

  return res.status(200).json({ success: true });
}
