/**
 * Locally-served country flags for the phone field.
 *
 * react-international-phone points every flag at the Twemoji set on
 * cdnjs.cloudflare.com. That made the contact form depend on a third party at
 * render time — every visitor's browser reached Cloudflare — and when the CSP
 * stopped allowing that host the flags silently became empty squares, with no
 * error raised anywhere to say so.
 *
 * The SVGs now ship with the site. Regenerate them with
 * `node scripts/fetch-country-flags.mjs` if the library's country list changes;
 * a country without a file simply falls back to the library's own URL, so a
 * stale set degrades rather than breaks.
 */

import { defaultCountries, parseCountry, type CountryIso2 } from "react-international-phone";

/** Vite resolves these to hashed asset URLs at build time. */
const FLAG_URLS = import.meta.glob<string>("../../../assets/flags/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function urlForIso2(iso2: CountryIso2): string | undefined {
  return FLAG_URLS[`../../../assets/flags/${iso2}.svg`];
}

/**
 * Every country the library offers, paired with its local SVG.
 *
 * Countries whose file is missing are left out rather than pointed at a broken
 * path: the library falls back to its own source for anything absent here.
 */
export const COUNTRY_FLAGS = defaultCountries
  .map(parseCountry)
  .map((country) => ({ iso2: country.iso2, src: urlForIso2(country.iso2) }))
  .filter((flag): flag is { iso2: CountryIso2; src: string } => flag.src !== undefined);
