import {
  BOOKING_TIMEZONE,
  BUSINESS_DAYS,
  BUSINESS_HOURS,
  MAX_HORIZON_DAYS,
  MEETING_DURATION_MIN,
  MIN_NOTICE_MS,
  SLOT_GRANULARITY_MIN,
} from './config.js';

// All timestamps in this module are UTC. The "9-18 Europe/Zurich" window is
// resolved per-day using Intl.DateTimeFormat in BOOKING_TIMEZONE because that
// is the only standards-correct way to handle DST shifts in pure JS without
// pulling a tz library.

export interface Slot {
  /** Start of the slot, UTC ISO string. */
  startUtc: string;
  /** End of the slot, UTC ISO string. */
  endUtc: string;
}

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const tzFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BOOKING_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  weekday: undefined,
});

function partsInBookingTz(date: Date): DateParts {
  const parts = tzFormatter.formatToParts(date);
  const lookup = Object.fromEntries(
    parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]),
  );
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    // formatToParts emits "24" for midnight in some runtimes; normalize that.
    hour: Number(lookup.hour) % 24,
    minute: Number(lookup.minute),
  };
}

// Returns the UTC instant that corresponds to a given Europe/Zurich wall-clock
// time. Uses the well-known DST trick: format the candidate UTC date in the
// target TZ, compute the offset, then shift. Two iterations converge.
function zonedWallClockToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  // Initial UTC guess assuming +0 offset.
  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  for (let iter = 0; iter < 2; iter += 1) {
    const parts = partsInBookingTz(candidate);
    const candidateWallMs = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      0,
      0,
    );
    const targetWallMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
    const drift = candidateWallMs - targetWallMs;
    if (drift === 0) break;
    candidate = new Date(candidate.getTime() - drift);
  }
  return candidate;
}

export interface BusyInterval {
  start: Date;
  end: Date;
}

function overlapsBusy(
  startMs: number,
  endMs: number,
  busy: BusyInterval[],
): boolean {
  for (const interval of busy) {
    if (interval.start.getTime() < endMs && interval.end.getTime() > startMs) {
      return true;
    }
  }
  return false;
}

export interface BuildSlotsOptions {
  /** Beginning of the visible range (UTC). Slots strictly before "now + min notice" are dropped. */
  from: Date;
  /** End of the visible range (UTC, exclusive). */
  to: Date;
  /** Busy intervals fetched from Google Calendar. */
  busy: BusyInterval[];
  /** Optional override of "now" for deterministic tests. */
  nowMs?: number;
}

// Generates every business-window slot in [from, to] that is fully free.
// Strategy: walk each day in BOOKING_TIMEZONE between the bounds, compute its
// business window as UTC, then step through the window in granularity chunks
// and check each chunk against the busy list and the min-notice cutoff.
export function buildAvailableSlots(options: BuildSlotsOptions): Slot[] {
  const { busy } = options;
  const nowMs = options.nowMs ?? Date.now();
  const earliestStartMs = nowMs + MIN_NOTICE_MS;
  const horizonCapMs = nowMs + MAX_HORIZON_DAYS * 24 * 60 * 60 * 1000;
  const fromMs = Math.max(options.from.getTime(), nowMs);
  const toMs = Math.min(options.to.getTime(), horizonCapMs);

  if (fromMs >= toMs) return [];

  const slots: Slot[] = [];

  // Iterate one local-TZ day at a time starting at the first day touched by
  // `from`. We use the local date parts to avoid skipping/duplicating a day
  // around midnight when the request straddles DST.
  const fromParts = partsInBookingTz(new Date(fromMs));
  let cursorYear = fromParts.year;
  let cursorMonth = fromParts.month;
  let cursorDay = fromParts.day;

  // Walk for at most MAX_HORIZON_DAYS days. Hard cap protects against an
  // infinite loop if the date math drifts.
  for (let dayOffset = 0; dayOffset <= MAX_HORIZON_DAYS + 1; dayOffset += 1) {
    const dayStartUtc = zonedWallClockToUtc(
      cursorYear,
      cursorMonth,
      cursorDay,
      BUSINESS_HOURS.startHour,
      0,
    );
    if (dayStartUtc.getTime() >= toMs) break;

    const weekday = new Date(
      Date.UTC(cursorYear, cursorMonth - 1, cursorDay),
    ).getUTCDay();

    if (BUSINESS_DAYS.has(weekday)) {
      const dayEndUtc = zonedWallClockToUtc(
        cursorYear,
        cursorMonth,
        cursorDay,
        BUSINESS_HOURS.endHour,
        0,
      );

      for (
        let cursor = dayStartUtc.getTime();
        cursor + MEETING_DURATION_MIN * 60_000 <= dayEndUtc.getTime();
        cursor += SLOT_GRANULARITY_MIN * 60_000
      ) {
        const slotStart = cursor;
        const slotEnd = cursor + MEETING_DURATION_MIN * 60_000;

        if (slotStart < earliestStartMs) continue;
        if (slotStart < fromMs) continue;
        if (slotEnd > toMs) break;
        if (overlapsBusy(slotStart, slotEnd, busy)) continue;

        slots.push({
          startUtc: new Date(slotStart).toISOString(),
          endUtc: new Date(slotEnd).toISOString(),
        });
      }
    }

    // Advance one calendar day in BOOKING_TIMEZONE. We do this via a UTC
    // midpoint of the next day to avoid the DST 23h/25h day edge cases.
    const nextMidday = new Date(
      Date.UTC(cursorYear, cursorMonth - 1, cursorDay, 12, 0, 0) +
        24 * 60 * 60 * 1000,
    );
    const nextParts = partsInBookingTz(nextMidday);
    cursorYear = nextParts.year;
    cursorMonth = nextParts.month;
    cursorDay = nextParts.day;
  }

  return slots;
}

// Validates that a candidate booking slot (provided by the visitor) actually
// lands on the public schedule. Done independently from buildAvailableSlots
// so a tampered request can't slip a booking outside business hours.
export function isSlotValid(startUtc: Date, busy: BusyInterval[], nowMs = Date.now()): boolean {
  const startMs = startUtc.getTime();
  const endMs = startMs + MEETING_DURATION_MIN * 60_000;

  if (startMs < nowMs + MIN_NOTICE_MS) return false;
  if (startMs > nowMs + MAX_HORIZON_DAYS * 24 * 60 * 60 * 1000) return false;

  const parts = partsInBookingTz(startUtc);
  // Must align to the slot grid.
  if (parts.minute % SLOT_GRANULARITY_MIN !== 0) return false;

  // Must be inside business hours.
  if (parts.hour < BUSINESS_HOURS.startHour) return false;
  if (parts.hour >= BUSINESS_HOURS.endHour) return false;

  // Must be a business day (weekday in BOOKING_TIMEZONE).
  const weekdayUtc = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  ).getUTCDay();
  if (!BUSINESS_DAYS.has(weekdayUtc)) return false;

  if (overlapsBusy(startMs, endMs, busy)) return false;

  return true;
}
