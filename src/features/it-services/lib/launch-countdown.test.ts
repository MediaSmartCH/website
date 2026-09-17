import { describe, it, expect } from "vitest";

import { getCountdownParts } from "./launch-countdown";

const at = (iso: string) => new Date(iso);

describe("getCountdownParts", () => {
  it("splits the remaining time into days, hours, minutes and seconds", () => {
    expect(
      getCountdownParts("2027-01-01T00:00:00Z", at("2026-12-30T22:58:50Z"))
    ).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 10, launched: false });
  });

  it("counts whole days only", () => {
    const parts = getCountdownParts("2027-01-01T00:00:00Z", at("2026-09-17T00:00:00Z"));

    expect(parts.days).toBe(106);
    expect(parts.hours).toBe(0);
    expect(parts.launched).toBe(false);
  });

  it("reports launched once the date is reached", () => {
    expect(getCountdownParts("2027-01-01T00:00:00Z", at("2027-01-01T00:00:00Z")).launched).toBe(
      true
    );
  });

  it("never runs backwards for a past date", () => {
    expect(getCountdownParts("2020-01-01T00:00:00Z", at("2026-09-17T00:00:00Z"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      launched: true,
    });
  });

  it("degrades to launched for an unparsable date", () => {
    expect(getCountdownParts("not-a-date", at("2026-09-17T00:00:00Z")).launched).toBe(true);
  });
});
