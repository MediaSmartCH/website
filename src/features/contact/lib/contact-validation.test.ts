import { describe, it, expect } from "vitest";

import {
  getLocalDigits,
  isDialCodeOnly,
  isValidEmailStrict,
} from "./contact-validation";

// These rules used to live inline in a 762-line component and could not be
// tested. They mirror api/_shared/input-validation.js, so the cases below match
// that suite: if the two ever drift, the form and the server disagree about
// what a valid address is.

describe("isValidEmailStrict", () => {
  const accepted = [
    "ada@example.ch",
    "ada.lovelace@example.co.uk",
    "ada+tag@example.com",
    "ADA@EXAMPLE.COM",
    "a_b%c@example-host.com",
  ];

  it.each(accepted)("accepts %s", (email) => {
    expect(isValidEmailStrict(email)).toBe(true);
  });

  const rejected: Array<[string, string]> = [
    ["no domain", "ada@"],
    ["no local part", "@example.com"],
    ["no @", "ada.example.com"],
    ["consecutive dots", "ada..lovelace@example.com"],
    ["a leading dot in the local part", ".ada@example.com"],
    ["a trailing dot in the local part", "ada.@example.com"],
    ["a label starting with a hyphen", "ada@-example.com"],
    ["a label ending with a hyphen", "ada@example-.com"],
    ["an empty label", "ada@example..com"],
    ["a one-letter TLD", "ada@example.c"],
    ["trailing text after the address", "ada@example.com nope"],
    ["an empty string", ""],
  ];

  it.each(rejected)("rejects %s", (_label, email) => {
    expect(isValidEmailStrict(email)).toBe(false);
  });
});

describe("getLocalDigits", () => {
  it("strips the dial code and keeps only the subscriber digits", () => {
    expect(getLocalDigits("+41 79 657 86 12")).toBe("796578612");
  });

  it("drops formatting characters", () => {
    expect(getLocalDigits("+33 (0)1-23-45-67-89")).toBe("0123456789");
  });

  it("returns an empty string for a dial code with no number", () => {
    expect(getLocalDigits("+41")).toBe("");
  });

  it("never throws on a partially typed value", () => {
    for (const value of ["", "+", "+4", "not a number"]) {
      expect(() => getLocalDigits(value)).not.toThrow();
    }
  });
});

describe("isDialCodeOnly", () => {
  it("treats a bare dial code as no number given", () => {
    // The country selector pre-fills a dial code, so "+41" must not count as an
    // invalid phone number — the field is optional.
    expect(isDialCodeOnly("+41")).toBe(true);
    expect(isDialCodeOnly("")).toBe(true);
  });

  it("is false as soon as a subscriber digit is typed", () => {
    expect(isDialCodeOnly("+417")).toBe(false);
    expect(isDialCodeOnly("+41 79 657 86 12")).toBe(false);
  });
});
