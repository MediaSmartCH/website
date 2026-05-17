import type { ApiRequest, ApiResponse } from '../_shared/http-types';
import {
  applyRateLimitHeaders,
  checkRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit';

import { getBusyIntervals } from './_lib/google-calendar';
import { buildAvailableSlots } from './_lib/slots';
import { parseAvailabilityRange } from './_lib/validators';

const AVAILABILITY_RATE_LIMIT = {
  limit: 60,
  windowMs: 5 * 60 * 1000,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Allow', 'GET');
  // Slots are computed against live calendar data; never cache.
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const rateLimitResult = checkRateLimit({
    namespace: 'booking-availability',
    identifier: getRateLimitIdentifier(req.headers),
    ...AVAILABILITY_RATE_LIMIT,
  });
  applyRateLimitHeaders(res, rateLimitResult);

  if (!rateLimitResult.ok) {
    return res.status(429).json({ success: false, message: 'Rate limited' });
  }

  const queryFrom = pickQueryString(req.query?.from);
  const queryTo = pickQueryString(req.query?.to);

  const parsed = parseAvailabilityRange(queryFrom, queryTo);
  if (!parsed.ok) {
    return res.status(400).json({ success: false, error: parsed.error });
  }

  try {
    const busy = await getBusyIntervals(parsed.value.from, parsed.value.to);
    const slots = buildAvailableSlots({
      from: parsed.value.from,
      to: parsed.value.to,
      busy,
    });

    return res.status(200).json({
      success: true,
      slots,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('booking/availability failed', err);
    return res.status(502).json({ success: false, message: 'Calendar unavailable' });
  }
}

function pickQueryString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
