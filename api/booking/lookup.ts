import type { ApiRequest, ApiResponse } from '../_shared/http-types';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit';

import { queryFirst } from './_lib/d1';
import { verifyToken } from './_lib/tokens';

const LOOKUP_RATE_LIMIT = {
  limit: 30,
  windowMs: 5 * 60 * 1000,
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

// Read-only endpoint backing the `/booking/manage?id=&token=` page. The token
// can be either a `cancel` or `reschedule` token — we accept either because
// both kinds of links lead to the same manage screen and we want the visitor
// to be able to flip between actions without a new email round-trip.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'GET');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const rateLimitResult = checkRateLimit({
    namespace: 'booking-lookup',
    identifier: getRateLimitIdentifier(req.headers),
    ...LOOKUP_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({ success: false, message: 'Rate limited' });
  }

  const id = pickQueryString(req.query?.id);
  const token = pickQueryString(req.query?.token);
  if (!id || !token) {
    return res.status(400).json({ success: false, message: 'Missing id or token' });
  }

  if (!verifyToken(id, 'cancel', token) && !verifyToken(id, 'reschedule', token)) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }

  const row = await queryFirst<BookingRow>(
    `SELECT id, attendee_name, attendee_email, attendee_message, attendee_language,
            start_at, end_at, status, calendar_event_id
     FROM bookings WHERE id = ?`,
    [id],
  );

  if (!row) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  return res.status(200).json({
    success: true,
    booking: {
      id: row.id,
      attendeeName: row.attendee_name,
      attendeeEmail: row.attendee_email,
      message: row.attendee_message,
      language: row.attendee_language,
      startUtc: new Date(row.start_at * 1000).toISOString(),
      endUtc: new Date(row.end_at * 1000).toISOString(),
      status: row.status,
    },
  });
}

function pickQueryString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
