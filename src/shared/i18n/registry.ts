import { type AppLanguage, isSupportedLanguage } from "@shared/config/languages";

type SectionDict = Record<string, any>;
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

const LOCALE_LOADERS: Record<AppLanguage, () => Promise<LocaleModule>> = {
  fr: () => import("@shared/i18n/fr") as Promise<LocaleModule>,
  en: () => import("@shared/i18n/en") as Promise<LocaleModule>,
};

/**
 * Resolves a language to its loader, or undefined when it is not one we ship.
 *
 * The language reaching here is derived from the URL, so the lookup is guarded
 * rather than done straight on the record: an unsupported code would otherwise
 * index into Object.prototype and dispatch to whatever it found there.
 */
function getLocaleLoader(language: AppLanguage) {
  return isSupportedLanguage(language) ? LOCALE_LOADERS[language] : undefined;
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
    const load = getLocaleLoader(language);
    if (!load) {
      return Promise.reject(new Error(`Unsupported language: ${String(language)}`));
    }

    pending = load().then((bundle) => {
      registerLocale(language, bundle);
    });
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
