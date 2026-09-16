import { describe, expect, it } from "vitest";

// The module's own text, as Vite serves it, so the assertions below read the
// same bytes that get bundled.
import contactSource from "./contact.ts?raw";

import {
  getBookingEmail,
  getContactEmail,
  getPrivacyEmail,
  getSupportEmail,
} from "./contact";

// Two things have to hold at once, and they pull in opposite directions: the
// addresses must come out exactly right, and they must not exist as literals
// anywhere a harvester can read them.

describe("contact addresses", () => {
  it("assembles each address correctly", () => {
    expect(getContactEmail()).toBe("hello@mediasmart.ch");
    expect(getPrivacyEmail()).toBe("privacy@mediasmart.ch");
    expect(getSupportEmail()).toBe("contact@mediasmart.ch");
    expect(getBookingEmail()).toBe("booking@mediasmart.ch");
  });
});

describe("source hygiene", () => {
  const source = contactSource;

  it("holds no address a regex could lift out of the bundle", () => {
    // Deliberately the same shape a harvester would use. The comments in
    // contact.ts explain the addresses; none of them may spell one out.
    const harvester = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

    expect(source.match(harvester)).toBeNull();
  });

  it("keeps the two halves apart, so nothing can fold them together", () => {
    expect(source).not.toContain("mediasmart.ch\"");
    expect(source).toContain("String.fromCharCode(64)");
  });
});
