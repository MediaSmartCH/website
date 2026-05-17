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
import { createEvent, getBusyIntervals } from './_lib/google-calendar';
import { sendBookingConfirmation } from './_lib/mailer';
import { isSlotValid } from './_lib/slots';
import { generateToken, newBookingId } from './_lib/tokens';
import { validateCreatePayload } from './_lib/validators';

const CREATE_RATE_LIMIT = {
  limit: 5,
  windowMs: 30 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'POST');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const rateLimitResult = checkRateLimit({
    namespace: 'booking-create',
    identifier: getRateLimitIdentifier(req.headers),
    ...CREATE_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({ success: false, message: 'Rate limited' });
  }

  const parsed = validateCreatePayload(req.body ?? {});
  if (!parsed.ok) {
    return res.status(400).json({ success: false, error: parsed.error });
  }

  // Honeypot: silently accept and drop bots that fill the hidden field.
  if (typeof parsed.value.honeypot === 'string' && parsed.value.honeypot.trim()) {
    console.warn('Booking honeypot triggered');
    return res.status(200).json({ success: true, bookingId: 'honeypot' });
  }

  const start = parsed.value.startUtc;
  const end = new Date(start.getTime() + MEETING_DURATION_MIN * 60_000);

  // We re-check availability server-side: the client can't trust the slot
  // wasn't already taken between page render and submit, and neither can we.
  let busy;
  try {
    busy = await getBusyIntervals(
      new Date(start.getTime() - 60_000),
      new Date(end.getTime() + 60_000),
    );
  } catch (err) {
    console.error('booking/create freebusy failed', err);
    return res.status(502).json({ success: false, message: 'Calendar unavailable' });
  }

  if (!isSlotValid(start, busy)) {
    return res.status(409).json({
      success: false,
      message: 'Slot is no longer available',
    });
  }

  const bookingId = newBookingId();
  const env = getRuntimeEnv();

  const meetingSummary =
    parsed.value.language === 'fr'
      ? `Rendez-vous MediaSmart — ${parsed.value.name}`
      : `MediaSmart meeting — ${parsed.value.name}`;
  const meetingDescription = [
    parsed.value.message ? `Message:\n${parsed.value.message}` : null,
    `Booking ID: ${bookingId}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  let event;
  try {
    event = await createEvent({
      summary: meetingSummary,
      description: meetingDescription,
      start,
      end,
      timeZone: BOOKING_TIMEZONE,
      attendeeName: parsed.value.name,
      attendeeEmail: parsed.value.email,
    });
  } catch (err) {
    console.error('booking/create calendar insert failed', err);
    return res.status(502).json({ success: false, message: 'Could not create event' });
  }

  // Persist after the calendar write so we never have a row pointing at a
  // non-existent event. If the DB write fails after the event was created,
  // we fall through to the catch and undo the event — better to lose a row
  // than leave a phantom booking on the user's calendar.
  const nowMs = Math.floor(Date.now() / 1000);
  try {
    await exec(
      `INSERT INTO bookings (
        id, calendar_event_id, attendee_name, attendee_email, attendee_message,
        attendee_language, start_at, end_at, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)`,
      [
        bookingId,
        event.id,
        parsed.value.name,
        parsed.value.email,
        parsed.value.message,
        parsed.value.language,
        Math.floor(start.getTime() / 1000),
        Math.floor(end.getTime() / 1000),
        nowMs,
        nowMs,
      ],
    );
  } catch (err) {
    console.error('booking/create db write failed; rolling back event', err);
    // Best-effort rollback — we don't await this because we want to respond
    // quickly. A leftover event is a degraded state we'll log and recover.
    void import('./_lib/google-calendar')
      .then((mod) => mod.deleteEvent(event.id))
      .catch((rollbackErr) =>
        console.error('booking/create rollback failed', rollbackErr),
      );
    return res.status(500).json({ success: false, message: 'Could not save booking' });
  }

  const cancelToken = generateToken(bookingId, 'cancel');
  const rescheduleToken = generateToken(bookingId, 'reschedule');
  const manageUrl = `${env.siteOrigin}/booking/manage?id=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(rescheduleToken)}`;
  const cancelUrl = `${env.siteOrigin}/booking/manage?id=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(cancelToken)}&action=cancel`;

  try {
    await sendBookingConfirmation({
      bookingId,
      attendeeName: parsed.value.name,
      attendeeEmail: parsed.value.email,
      message: parsed.value.message,
      start,
      end,
      language: parsed.value.language,
      meetLink: event.meetLink ?? null,
      manageUrl,
      cancelUrl,
    });
  } catch (err) {
    // We've already booked. Log loudly but don't fail the response — the user
    // can read the confirmation page; we'll see the missing email in logs and
    // can manually follow up.
    console.error('booking/create email send failed', err);
  }

  // Look up the canonical row so the response always reflects what is stored.
  const row = await queryFirst<{
    id: string;
    start_at: number;
    end_at: number;
    attendee_email: string;
    status: string;
  }>(
    'SELECT id, start_at, end_at, attendee_email, status FROM bookings WHERE id = ?',
    [bookingId],
  );

  return res.status(201).json({
    success: true,
    booking: {
      id: bookingId,
      startUtc: row ? new Date(row.start_at * 1000).toISOString() : start.toISOString(),
      endUtc: row ? new Date(row.end_at * 1000).toISOString() : end.toISOString(),
      meetLink: event.meetLink ?? null,
      manageUrl,
      cancelUrl,
    },
  });
}
