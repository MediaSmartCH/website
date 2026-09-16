import type { ApiRequest, ApiResponse } from '../_shared/http-types.js';
import {
  BOOKING_MAIL_POLICY,
  reserveOutboundMail,
} from '../_shared/outbound-mail-guard.js';
import {
  applyRateLimitHeaders,
  enforceRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit.js';
import recaptcha from '../_shared/recaptcha.js';
import {
  applyApiResponseHeaders,
  guardRequest,
} from '../_shared/request-guard.js';

import {
  BOOKING_TIMEZONE,
  MEETING_DURATION_MIN,
  getRuntimeEnv,
} from './_lib/config.js';
import { exec, isUniqueConstraintError, queryFirst } from './_lib/d1.js';
import { createEvent, deleteEvent, getBusyIntervals } from './_lib/google-calendar.js';
import { sendBookingConfirmation } from './_lib/mailer.js';
import { isSlotValid } from './_lib/slots.js';
import { generateToken, newBookingId } from './_lib/tokens.js';
import { validateCreatePayload } from './_lib/validators.js';

const { extractClientIp, verifyRecaptcha } = recaptcha;

// Best-effort release of a reserved-but-not-finalised booking row. Awaited by
// callers so the DELETE actually runs before the serverless response is flushed.
async function releaseBookingRow(bookingId: string): Promise<void> {
  try {
    await exec('DELETE FROM bookings WHERE id = ?', [bookingId]);
  } catch (err) {
    console.error('booking/create failed to release reserved slot', bookingId, err);
  }
}

const CREATE_RATE_LIMIT = {
  limit: 5,
  windowMs: 30 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  applyApiResponseHeaders(res, ['POST']);

  const guard = guardRequest(req, { methods: ['POST'], maxBodyBytes: 16 * 1024 });
  if (!guard.ok) {
    console.warn(`booking/create refused: ${guard.reason}`);
    return res.status(guard.status).json({ success: false, message: guard.message });
  }

  const rateLimitResult = await enforceRateLimit({
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

  // Anti-automation: create is the only unauthenticated booking endpoint (the
  // others require a signed manage token), so it gets reCAPTCHA v3 like the
  // contact form. The honeypot above stays as cheap defense-in-depth.
  const recaptchaResult = await verifyRecaptcha({
    token: (req.body as { recaptchaToken?: unknown } | undefined)?.recaptchaToken,
    expectedAction: 'booking_create',
    remoteIp: extractClientIp(req.headers),
  });
  if (!recaptchaResult.ok) {
    return res
      .status(recaptchaResult.status ?? 400)
      .json({ success: false, message: recaptchaResult.message });
  }

  // A booking always mails the attendee. Claiming that budget before we touch
  // the calendar means one address cannot be used to fill the agenda — and be
  // mailed for it — over and over, and that a distributed attempt runs out of
  // site-wide allowance before it runs out of slots. Rejected here nothing has
  // been written, so there is no state to unwind.
  const mailBudget = await reserveOutboundMail(
    BOOKING_MAIL_POLICY,
    parsed.value.email,
  );

  if (!mailBudget.allowed) {
    console.warn(`booking/create refused by the ${mailBudget.refusedBy} mail budget`);
    return res.status(429).json({ success: false, message: 'Rate limited' });
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
    await mailBudget.release();
    return res.status(502).json({ success: false, message: 'Calendar unavailable' });
  }

  if (!isSlotValid(start, busy)) {
    await mailBudget.release();
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

  const nowMs = Math.floor(Date.now() / 1000);
  const startSec = Math.floor(start.getTime() / 1000);
  const endSec = Math.floor(end.getTime() / 1000);

  // 1. Claim the slot in the database FIRST. The partial unique index
  //    `(start_at) WHERE status='confirmed'` is the authoritative mutual-
  //    exclusion guarantee: if a concurrent request already booked this slot the
  //    insert fails and we return 409 instead of silently double-booking.
  //    calendar_event_id is filled in once the event below is created.
  try {
    await exec(
      `INSERT INTO bookings (
        id, calendar_event_id, attendee_name, attendee_email, attendee_message,
        attendee_language, start_at, end_at, status, token_version, created_at, updated_at
      ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 'confirmed', 0, ?, ?)`,
      [
        bookingId,
        parsed.value.name,
        parsed.value.email,
        parsed.value.message,
        parsed.value.language,
        startSec,
        endSec,
        nowMs,
        nowMs,
      ],
    );
  } catch (err) {
    await mailBudget.release();
    if (isUniqueConstraintError(err)) {
      return res
        .status(409)
        .json({ success: false, message: 'Slot is no longer available' });
    }
    console.error('booking/create db claim failed', err);
    return res.status(500).json({ success: false, message: 'Could not save booking' });
  }

  // 2. Create the calendar event now that the slot is durably reserved. On
  //    failure we release the claimed row (awaited) so it never lingers and the
  //    slot is freed for someone else.
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
    console.error('booking/create calendar insert failed; releasing slot', err);
    await Promise.all([releaseBookingRow(bookingId), mailBudget.release()]);
    return res.status(502).json({ success: false, message: 'Could not create event' });
  }

  // 3. Attach the calendar event id to the reserved row. If this fails we undo
  //    both the event and the row (awaited) so we never leave a confirmed slot
  //    without a matching calendar entry — the previous fire-and-forget rollback
  //    could be dropped when the serverless instance froze after responding.
  try {
    const updateMeta = await exec(
      `UPDATE bookings SET calendar_event_id = ?, updated_at = ? WHERE id = ?`,
      [event.id, Math.floor(Date.now() / 1000), bookingId],
    );
    // D1 does not throw when the WHERE matches zero rows, so confirm the
    // reserved row is still present before reporting success.
    if (updateMeta.changes === 0) {
      throw new Error(`reserved booking row ${bookingId} vanished before event link`);
    }
  } catch (err) {
    console.error('booking/create db update failed; rolling back', err);
    await Promise.allSettled([
      deleteEvent(event.id),
      releaseBookingRow(bookingId),
      mailBudget.release(),
    ]);
    return res.status(500).json({ success: false, message: 'Could not save booking' });
  }

  const cancelToken = generateToken(bookingId, 'cancel', 0);
  const rescheduleToken = generateToken(bookingId, 'reschedule', 0);
  // Manage links are language-prefixed so the visitor lands on the page in
  // the language they used to book; the rest of the site is also localised.
  const langPrefix = parsed.value.language;
  const manageUrl = `${env.siteOrigin}/${langPrefix}/booking/manage?id=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(rescheduleToken)}`;
  const cancelUrl = `${env.siteOrigin}/${langPrefix}/booking/manage?id=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(cancelToken)}&action=cancel`;

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
    await mailBudget.release();
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
