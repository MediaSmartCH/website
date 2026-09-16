/**
 * Field-level validation rules for the contact form.
 *
 * These mirror the server-side rules in api/_shared/input-validation.js. They
 * are duplicated rather than shared because the API runs as CommonJS Vercel
 * functions and the app as an ESM bundle, with no shared build step. The server
 * remains the authority: this module exists to give immediate feedback, never to
 * decide whether a submission is accepted.
 *
 * Contains no React and no I/O.
 */

import { guessCountryByPartialPhoneNumber, removeDialCode } from "react-international-phone";

const EMAIL_BASE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;

/**
 * Stricter than the base regex: also rejects consecutive dots, a leading or
 * trailing dot in the local part, and hyphens at domain-label boundaries.
 */
export function isValidEmailStrict(value: string): boolean {
  if (!EMAIL_BASE.test(value)) return false;
  if (value.includes("..")) return false;

  const [local, domain] = value.split("@");
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;

  const labels = domain.split(".");
  return !labels.some((label) => label.startsWith("-") || label.endsWith("-") || label.length === 0);
}

/**
 * Returns the subscriber digits of a phone number, with the dial code removed.
 *
 * Falls back to stripping a leading "+<digits>" when the country cannot be
 * guessed, so a half-typed number never throws.
 */
export function getLocalDigits(phone: string): string {
  const { country } = guessCountryByPartialPhoneNumber({ phone });
  const dialCode = country?.dialCode || "";

  try {
    return removeDialCode({ phone, dialCode }).replace(/\D/g, "");
  } catch {
    return phone.replace(/^\+\d{1,4}\s*/, "").replace(/\D/g, "");
  }
}

/**
 * True when the field holds only a dial code and no subscriber digits.
 *
 * The phone field is optional, and the country selector pre-fills a dial code,
 * so "+41" alone must count as "no number given" rather than as an invalid one.
 */
export function isDialCodeOnly(phone: string): boolean {
  return getLocalDigits(phone).length === 0;
}
