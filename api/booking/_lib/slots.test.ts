import { describe, it, expect } from 'vitest';

import {
  buildAvailableSlots,
  isSlotValid,
  type BusyInterval,
} from './slots.js';

// All test inputs are anchored in UTC. The slots module renders them against
// Europe/Zurich (UTC+1 in winter, UTC+2 in summer), so the expected wall-clock
// times below assume the BOOKING_TIMEZONE constant stays Europe/Zurich.

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function utc(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
}

describe('buildAvailableSlots', () => {
  it('returns no slots on a Saturday or Sunday', () => {
    // 2027-01-09 is a Saturday in any timezone.
    const slots = buildAvailableSlots({
      from: utc(2027, 1, 9, 0),
      to: utc(2027, 1, 10, 0),
      busy: [],
      nowMs: utc(2027, 1, 1, 0).getTime(),
    });
    expect(slots).toEqual([]);
  });

  it('produces a 30-min grid inside business hours on a winter weekday', () => {
    // 2027-02-15 is a Monday. Winter time → Europe/Zurich = UTC+1.
    // Business window 09:00–18:00 ZRH == 08:00–17:00 UTC = 18 half-hour slots,
    // but the last slot must end by 18:00 local, so we expect slot starts
    // 08:00..16:30 UTC inclusive = 18 starts.
    const slots = buildAvailableSlots({
      from: utc(2027, 2, 15, 0),
      to: utc(2027, 2, 16, 0),
      busy: [],
      nowMs: utc(2027, 2, 1, 0).getTime(),
    });
    expect(slots.length).toBe(18);
    expect(slots[0].startUtc).toBe('2027-02-15T08:00:00.000Z');
    expect(slots[slots.length - 1].startUtc).toBe('2027-02-15T16:30:00.000Z');
  });

  it('produces a 30-min grid inside business hours on a summer weekday', () => {
    // 2027-07-12 is a Monday. Summer time → Europe/Zurich = UTC+2.
    // Business window 09:00–18:00 ZRH == 07:00–16:00 UTC.
    const slots = buildAvailableSlots({
      from: utc(2027, 7, 12, 0),
      to: utc(2027, 7, 13, 0),
      busy: [],
      nowMs: utc(2027, 6, 30, 0).getTime(),
    });
    expect(slots.length).toBe(18);
    expect(slots[0].startUtc).toBe('2027-07-12T07:00:00.000Z');
    expect(slots[slots.length - 1].startUtc).toBe('2027-07-12T15:30:00.000Z');
  });

  it('drops slots that overlap busy intervals', () => {
    // Monday 2027-02-15, winter. Block 09:00–10:00 local (08:00–09:00 UTC).
    const busy: BusyInterval[] = [
      {
        start: utc(2027, 2, 15, 8, 0),
        end: utc(2027, 2, 15, 9, 0),
      },
    ];
    const slots = buildAvailableSlots({
      from: utc(2027, 2, 15, 0),
      to: utc(2027, 2, 16, 0),
      busy,
      nowMs: utc(2027, 2, 1, 0).getTime(),
    });
    expect(slots.length).toBe(16);
    expect(slots[0].startUtc).toBe('2027-02-15T09:00:00.000Z');
  });

  it('respects the 24h minimum notice window', () => {
    // "Now" = Monday 2027-02-15 12:00 ZRH = 11:00 UTC. Earliest start is
    // Tuesday 2027-02-16 12:00 ZRH = 11:00 UTC. Anything before is hidden.
    const slots = buildAvailableSlots({
      from: utc(2027, 2, 15, 0),
      to: utc(2027, 2, 18, 0),
      busy: [],
      nowMs: utc(2027, 2, 15, 11, 0).getTime(),
    });
    const firstStarts = slots.slice(0, 3).map((s) => s.startUtc);
    expect(firstStarts).toEqual([
      '2027-02-16T11:00:00.000Z',
      '2027-02-16T11:30:00.000Z',
      '2027-02-16T12:00:00.000Z',
    ]);
  });

  it('caps the window at MAX_HORIZON_DAYS', () => {
    // Now = Monday 2027-02-01 08:00 UTC. Horizon = 28 days. Anything more
    // than 28 days ahead must be excluded even if `to` extends further.
    const nowMs = utc(2027, 2, 1, 8, 0).getTime();
    const slots = buildAvailableSlots({
      from: new Date(nowMs),
      to: new Date(nowMs + 60 * DAY_MS),
      busy: [],
      nowMs,
    });
    const lastSlotStart = new Date(slots[slots.length - 1].startUtc).getTime();
    expect(lastSlotStart - nowMs).toBeLessThanOrEqual(28 * DAY_MS);
  });

  it('handles the DST spring-forward day cleanly', () => {
    // 2027-03-29 is the Monday after Europe/Zurich switches to summer time
    // (Sunday 2027-03-28 02:00 → 03:00). The slot count for a normal Monday
    // should be the same as any other summer weekday: 18 slots.
    // We anchor `now` close to the target so the 28-day horizon cap doesn't
    // clip the test range.
    const slots = buildAvailableSlots({
      from: utc(2027, 3, 29, 0),
      to: utc(2027, 3, 30, 0),
      busy: [],
      nowMs: utc(2027, 3, 15, 0).getTime(),
    });
    expect(slots.length).toBe(18);
    // Summer time: 09:00 ZRH == 07:00 UTC.
    expect(slots[0].startUtc).toBe('2027-03-29T07:00:00.000Z');
  });
});

describe('isSlotValid', () => {
  const nowMs = utc(2027, 2, 1, 8, 0).getTime();
  const busy: BusyInterval[] = [];

  it('accepts a valid mid-morning weekday slot', () => {
    // Monday 2027-02-15 10:00 ZRH = 09:00 UTC.
    expect(isSlotValid(utc(2027, 2, 15, 9, 0), busy, nowMs)).toBe(true);
  });

  it('rejects a slot before business hours', () => {
    // 07:00 UTC = 08:00 ZRH (winter) — before 09:00 opening.
    expect(isSlotValid(utc(2027, 2, 15, 7, 0), busy, nowMs)).toBe(false);
  });

  it('rejects a slot after business hours', () => {
    // 17:30 UTC = 18:30 ZRH (winter) — past 18:00 close.
    expect(isSlotValid(utc(2027, 2, 15, 17, 30), busy, nowMs)).toBe(false);
  });

  it('rejects a weekend slot', () => {
    // Saturday 2027-02-13 10:00 ZRH = 09:00 UTC.
    expect(isSlotValid(utc(2027, 2, 13, 9, 0), busy, nowMs)).toBe(false);
  });

  it('rejects a slot inside the min-notice window', () => {
    // 1 hour from now.
    expect(isSlotValid(new Date(nowMs + HOUR_MS), busy, nowMs)).toBe(false);
  });

  it('rejects a slot beyond the max horizon', () => {
    expect(isSlotValid(new Date(nowMs + 60 * DAY_MS), busy, nowMs)).toBe(false);
  });

  it('rejects a slot that does not align to the 30-min grid', () => {
    // 09:15 ZRH = 08:15 UTC on Monday 2027-02-15.
    expect(isSlotValid(utc(2027, 2, 15, 8, 15), busy, nowMs)).toBe(false);
  });

  it('rejects a slot that overlaps a busy interval', () => {
    const busyMid: BusyInterval[] = [
      { start: utc(2027, 2, 15, 9, 0), end: utc(2027, 2, 15, 10, 0) },
    ];
    // 09:00 UTC start overlaps the 09:00–10:00 busy block.
    expect(isSlotValid(utc(2027, 2, 15, 9, 0), busyMid, nowMs)).toBe(false);
  });
});
