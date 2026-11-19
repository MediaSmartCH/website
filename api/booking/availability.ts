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

import { MAX_HORIZON_DAYS } from './_lib/config.js';
import { getBusyIntervals } from './_lib/google-calendar.js';
import { buildAvailableSlots } from './_lib/slots.js';
import { parseAvailabilityRange } from './_lib/validators.js';

/** The widest range that can ever yield a slot, so the widest worth asking about. */
const MAX_RANGE_MS = MAX_HORIZON_DAYS * 24 * 60 * 60 * 1000;

/**
 * Caps how wide a range reaches Google.
 *
 * `buildAvailableSlots` already discards anything past the horizon, but the
 * freeBusy call was made with the caller's raw bounds — so
 * `?from=1000-01-01&to=9999-12-31` asked Google about a millennium to produce
 * at most 28 days of slots. Google refuses a range that wide, which turned a
 * well-formed request into a 502 from us; narrower-but-still-huge ranges just
 * bought the caller a large upstream query for free.
 *
 * The cap is on the span rather than on "now + horizon" so the decision does
 * not depend on the clock: a caller asking about the bookable window sees no
 * change, and nobody else gets to choose how much work the upstream call is.
 */
function capRangeWidth(from: Date, to: Date) {
  const end = Math.min(to.getTime(), from.getTime() + MAX_RANGE_MS);
  return { from, to: new Date(end) };
}

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

  const range = capRangeWidth(parsed.value.from, parsed.value.to);

  try {
    const busy = await getBusyIntervals(range.from, range.to);
    const slots = buildAvailableSlots({
      from: range.from,
      to: range.to,
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
