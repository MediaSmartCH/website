import type { ApiRequest, ApiResponse } from '../_shared/http-types';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit';

import {
  BOOKING_TIMEZONE,
  MEETING_DURATION_MIN,
  getRuntimeEnv,
} from './_lib/config';
import { exec, queryFirst } from './_lib/d1';
import { getBusyIntervals, updateEventTime } from './_lib/google-calendar';
import { sendBookingConfirmation } from './_lib/mailer';
import { isSlotValid } from './_lib/slots';
import { generateToken, verifyToken } from './_lib/tokens';

const RESCHEDULE_RATE_LIMIT = {
  limit: 5,
  windowMs: 30 * 60 * 1000,
};

interface BookingRow {
  id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_message: string | null;
  attendee_language: 'fr' | 'en';
  start_at: number;
  end_at: number;
  status: string;
  calendar_event_id: string | null;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const rateLimitResult = checkRateLimit({
    namespace: 'booking-reschedule',
    identifier: getRateLimitIdentifier(req.headers),
    ...RESCHEDULE_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({ success: false, message: 'Rate limited' });
  }

  const body = (req.body ?? {}) as {
    id?: unknown;
    token?: unknown;
    startUtc?: unknown;
  };
  const id = typeof body.id === 'string' ? body.id : '';
  const token = typeof body.token === 'string' ? body.token : '';
  const startRaw = typeof body.startUtc === 'string' ? body.startUtc : '';

  if (!id || !token || !startRaw) {
    return res.status(400).json({ success: false, message: 'Missing id, token, or startUtc' });
  }

  if (!verifyToken(id, 'reschedule', token)) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }

  const newStart = new Date(startRaw);
  if (Number.isNaN(newStart.getTime())) {
    return res.status(400).json({ success: false, message: 'Invalid startUtc' });
  }
  const newEnd = new Date(newStart.getTime() + MEETING_DURATION_MIN * 60_000);

  const row = await queryFirst<BookingRow>(
    `SELECT id, attendee_name, attendee_email, attendee_message, attendee_language,
            start_at, end_at, status, calendar_event_id
     FROM bookings WHERE id = ?`,
    [id],
  );

  if (!row) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  if (row.status !== 'confirmed') {
    return res.status(409).json({ success: false, message: 'Booking is not active' });
  }
  if (!row.calendar_event_id) {
    return res.status(409).json({ success: false, message: 'Booking has no calendar event' });
  }

  // Same availability check as create: the new slot has to be free, future,
  // and within business hours. We exclude the booking's own current event
  // from the busy set so the user can move to an adjacent slot without
  // self-collision; Calendar reports the still-pending old slot as busy.
  let busy;
  try {
    busy = await getBusyIntervals(
      new Date(newStart.getTime() - 60_000),
      new Date(newEnd.getTime() + 60_000),
    );
  } catch (err) {
    console.error('booking/reschedule freebusy failed', err);
    return res.status(502).json({ success: false, message: 'Calendar unavailable' });
  }
  const filteredBusy = busy.filter((b) => {
    const matches =
      b.start.getTime() === row.start_at * 1000 &&
      b.end.getTime() === row.end_at * 1000;
    return !matches;
  });

  if (!isSlotValid(newStart, filteredBusy)) {
    return res.status(409).json({
      success: false,
      message: 'Slot is no longer available',
    });
  }

  try {
    await updateEventTime(row.calendar_event_id, newStart, newEnd, BOOKING_TIMEZONE);
  } catch (err) {
    console.error('booking/reschedule calendar update failed', err);
    return res.status(502).json({ success: false, message: 'Could not update event' });
  }

  const nowMs = Math.floor(Date.now() / 1000);
  await exec(
    `UPDATE bookings SET start_at = ?, end_at = ?, updated_at = ? WHERE id = ?`,
    [
      Math.floor(newStart.getTime() / 1000),
      Math.floor(newEnd.getTime() / 1000),
      nowMs,
      id,
    ],
  );

  const env = getRuntimeEnv();
  const cancelToken = generateToken(id, 'cancel');
  const rescheduleToken = generateToken(id, 'reschedule');
  const manageUrl = `${env.siteOrigin}/booking/manage?id=${encodeURIComponent(id)}&token=${encodeURIComponent(rescheduleToken)}`;
  const cancelUrl = `${env.siteOrigin}/booking/manage?id=${encodeURIComponent(id)}&token=${encodeURIComponent(cancelToken)}&action=cancel`;

  try {
    await sendBookingConfirmation({
      bookingId: id,
      attendeeName: row.attendee_name,
      attendeeEmail: row.attendee_email,
      message: row.attendee_message,
      start: newStart,
      end: newEnd,
      language: row.attendee_language,
      meetLink: null,
      manageUrl,
      cancelUrl,
    });
  } catch (err) {
    console.error('booking/reschedule email failed', err);
  }

  return res.status(200).json({
    success: true,
    booking: {
      id,
      startUtc: newStart.toISOString(),
      endUtc: newEnd.toISOString(),
      manageUrl,
      cancelUrl,
    },
  });
}
