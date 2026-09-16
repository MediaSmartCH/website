/**
 * The company's own contact details and social profiles.
 *
 * ## Why the addresses are not written out here
 *
 * Address harvesting is done by fetching a site and running a regex over
 * everything it serves — the HTML, and increasingly the JavaScript bundles
 * too, because that is where a single-page app keeps its text. Spelling an
 * address out in this file would put that exact string in `dist/assets/*.js`,
 * one `grep` away.
 *
 * Writing it for display with `[at]` in place of the `@` does not fix that: it
 * only changes what the visitor reads. The address still has to reach the
 * `mailto:` link, so it is still in the source, in the bundle and in the
 * rendered DOM — while the visitor loses the ability to copy it.
 *
 * So each address is stored as its two halves, encoded, and assembled when
 * something asks for it. The literal never exists at rest: not in the file,
 * not in the bundle, not in the pre-rendered HTML. The visitor gets the real,
 * readable, copy-pasteable address, and the link still opens their mail client
 * (see `ObfuscatedEmail`, which also keeps the `mailto:` out of the DOM until
 * the visitor reaches for it).
 *
 * This raises the cost of harvesting; it does not make it impossible. Anything
 * that runs our JavaScript can still read what a human reads. That is the
 * ceiling for an address a visitor is meant to see, and the reason the real
 * defences against unsolicited mail live on the server.
 */

/** Decodes one half of an address. Split out so no call site holds a literal. */
function reveal(encoded: string): string {
  return atob(encoded);
}

/**
 * Joins a local part and a domain.
 *
 * The `@` comes from a char code rather than a literal so that no bundler can
 * fold the two halves back into a single recognisable string, which is exactly
 * what minifiers do to adjacent string constants.
 */
function address(localPart: string, domain: string): string {
  return `${reveal(localPart)}${String.fromCharCode(64)}${reveal(domain)}`;
}

const DOMAIN = "bWVkaWFzbWFydC5jaA==";

const LOCAL_PARTS = {
  hello: "aGVsbG8=",
  privacy: "cHJpdmFjeQ==",
  contact: "Y29udGFjdA==",
  booking: "Ym9va2luZw==",
} as const;

/** General enquiries — the address shown in the contact section. */
export const getContactEmail = () => address(LOCAL_PARTS.hello, DOMAIN);

/** Data-protection requests, as named in the privacy policy. */
export const getPrivacyEmail = () => address(LOCAL_PARTS.privacy, DOMAIN);

/** Used by the 404 page's "get in touch" action. */
export const getSupportEmail = () => address(LOCAL_PARTS.contact, DOMAIN);

/** Sender and reply-to for everything the booking flow sends. */
export const getBookingEmail = () => address(LOCAL_PARTS.booking, DOMAIN);

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
