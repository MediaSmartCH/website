import type { AppLanguage } from "@shared/config/languages";

type SectionDict = Record<string, unknown>;
/** Shape of a `services/locales/<lang>` barrel namespace. */
type LocaleModule = Record<string, SectionDict>;

// Maps the section key components use in `t.text("<section>.<path>")` to the
// export name in the per-language barrels. Only `UnderConstruction` differs.
const SECTION_EXPORTS: Record<string, string> = {
  navbar: "navbar",
  footer: "footer",
  home: "home",
  it: "it",
  video: "video",
  error404: "error404",
  cookies: "cookies",
  UnderConstruction: "underconstruction",
  booking: "booking",
  privacy: "privacy",
  legal: "legal",
  terms: "terms",
  agency: "agency",
  work: "work",
};

/**
 * The same section-major dictionary the app has always read from, except that a
 * language only appears once its bundle has been registered. Bundling both
 * languages on every page cost ~27KB gzipped in the entry chunk; each locale now
 * ships in the entry graph of its own prerendered page.
 */
export const dictionary: Record<string, Partial<Record<AppLanguage, SectionDict>>> =
  Object.fromEntries(Object.keys(SECTION_EXPORTS).map((section) => [section, {}]));

export function registerLocale(language: AppLanguage, bundle: LocaleModule) {
  for (const [section, exportName] of Object.entries(SECTION_EXPORTS)) {
    dictionary[section][language] = bundle[exportName];
  }
}

/**
 * Imports a language bundle.
 *
 * A switch, not a lookup table: the language reaching here comes from the URL,
 * and resolving a call target by indexing any container with it is a dynamic
 * dispatch on user input — the import below is a literal in every branch, so
 * there is nothing to dispatch. With two locales the table bought nothing.
 */
function importLocaleBundle(language: AppLanguage): Promise<LocaleModule> {
  switch (language) {
    case "fr":
      return import("@shared/i18n/fr") as Promise<LocaleModule>;
    case "en":
      return import("@shared/i18n/en") as Promise<LocaleModule>;
    default:
      return Promise.reject(new Error(`Unsupported language: ${String(language)}`));
  }
}

const inFlight = new Map<AppLanguage, Promise<void>>();

/** True once `language` can be read synchronously by the translators. */
export const isLocaleReady = (language: AppLanguage) =>
  dictionary.navbar[language] !== undefined;

/** Loads and registers a language, de-duplicating concurrent requests. */
export function ensureLocale(language: AppLanguage): Promise<void> {
  if (isLocaleReady(language)) {
    return Promise.resolve();
  }

  let pending = inFlight.get(language);

  if (!pending) {
    pending = importLocaleBundle(language).then(
      (bundle) => {
        registerLocale(language, bundle);
      },
      (error) => {
        // Drop the failed attempt so the next call retries, instead of handing
        // every later caller the same rejection for the rest of the session.
        inFlight.delete(language);
        throw error;
      }
    );
    inFlight.set(language, pending);
  }

  return pending;
}

/**
 * Warms a language ahead of time so switching to it never blocks. Failures are
 * ignored on purpose: `ensureLocale` will retry when the language is needed.
 */
export function prefetchLocale(language: AppLanguage) {
  void ensureLocale(language).catch(() => undefined);
}
