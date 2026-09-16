import type { ApiRequest, ApiResponse } from '../_shared/http-types.js';
import {
  applyRateLimitHeaders,
  enforceRateLimit,
  getRateLimitIdentifier,
} from '../_shared/rate-limit.js';
import {
  applyApiResponseHeaders,
  guardRequest,
} from '../_shared/request-guard.js';

import { getBusyIntervals } from './_lib/google-calendar.js';
import { buildAvailableSlots } from './_lib/slots.js';
import { parseAvailabilityRange } from './_lib/validators.js';

const AVAILABILITY_RATE_LIMIT = {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  // Browsing the calendar legitimately costs a handful of calls per visit, and
  // each shared-store lookup is a round-trip the visitor waits for. Stay
  // per-instance for normal browsing; escalate once the pattern stops looking
  // like one person picking a slot.
  durableAfter: 10,
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Slots are computed against live calendar data; never cache.
  applyApiResponseHeaders(res, ['GET']);

  const guard = guardRequest(req, { methods: ['GET'] });
  if (!guard.ok) {
    return res.status(guard.status).json({ success: false, message: guard.message });
  }

  const rateLimitResult = await enforceRateLimit({
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
