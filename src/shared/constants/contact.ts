/**
 * The company's own contact details and social profiles.
 *
 * These were written out by hand in the contact section, the privacy policy,
 * the footer and the 404 page. Changing a phone number meant grepping for it.
 *
 * Display values are kept alongside the href values on purpose: the obfuscated
 * "hello[at]mediasmart.ch" form and the spaced phone number are what the pages
 * actually render, and they must not drift from what the links point at.
 */

export const CONTACT_EMAIL = "hello@mediasmart.ch";
/** Rendered form — "[at]" keeps the address out of naive scrapers. */
export const CONTACT_EMAIL_DISPLAY = "hello[at]mediasmart.ch";

export const PRIVACY_EMAIL = "privacy@mediasmart.ch";
export const PRIVACY_EMAIL_DISPLAY = "privacy[at]mediasmart.ch";

/** Used by the 404 page's "get in touch" action. */
export const SUPPORT_EMAIL = "contact@mediasmart.ch";

/** E.164, for tel: links. */
export const CONTACT_PHONE = "+41796578612";
/** Grouped for reading. */
export const CONTACT_PHONE_DISPLAY = "+41 79 657 86 12";

/** Google Maps entry for the office. */
export const OFFICE_MAP_URL = "https://maps.app.goo.gl/CthoJ9r99naTzbTA9";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/MediaSmartCH",
  instagram: "https://www.instagram.com/MediaSmartCH",
  telegram: "https://t.me/MediaSmartCH",
} as const;
