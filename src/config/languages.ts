import englishFlag from "assets/images/flag1.png";
import frenchFlag from "assets/images/french.png";

export const DEFAULT_LANGUAGE = "fr";
export const FALLBACK_LANGUAGE = "en";

export const SUPPORTED_LANGUAGES = [
  {
    code: "fr",
    shortLabel: "FR",
    nativeLabel: "Français",
    flagSrc: frenchFlag,
  },
  {
    code: "en",
    shortLabel: "EN",
    nativeLabel: "English",
    flagSrc: englishFlag,
  },
] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const supportedLanguageCodes = SUPPORTED_LANGUAGES.map(({ code }) => code);
const supportedLanguageSet = new Set<string>(supportedLanguageCodes);

// Escape each code so it is safe to embed as a literal in a RegExp.
const escapedLanguageCodes = supportedLanguageCodes.map((code) =>
  code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
);

// Matches a leading language prefix such as "/fr" or "/en" followed by "/" or end-of-string.
export const LANGUAGE_PREFIX_REGEX = new RegExp(
  `^/(${escapedLanguageCodes.join("|")})(?=/|$)`
);

export const isSupportedLanguage = (
  value: string | null | undefined
): value is AppLanguage => Boolean(value && supportedLanguageSet.has(value));

export const normalizeLanguage = (
  value: string | null | undefined
): AppLanguage => {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  const normalizedValue = value.toLowerCase();

  if (isSupportedLanguage(normalizedValue)) {
    return normalizedValue;
  }

  // Accept BCP-47 tags like "en-US" by trying just the base language code.
  const baseLanguage = normalizedValue.split("-")[0];

  if (isSupportedLanguage(baseLanguage)) {
    return baseLanguage;
  }

  return DEFAULT_LANGUAGE;
};

export const getLanguageConfig = (
  language: string | null | undefined
) =>
  SUPPORTED_LANGUAGES.find(
    ({ code }) => code === normalizeLanguage(language)
  ) ?? SUPPORTED_LANGUAGES[0];

export const getNextLanguage = (language: string): AppLanguage => {
  const currentLanguage = normalizeLanguage(language);
  const currentIndex = SUPPORTED_LANGUAGES.findIndex(
    ({ code }) => code === currentLanguage
  );

  if (currentIndex < 0) {
    return DEFAULT_LANGUAGE;
  }

  // Wraps around to the first language after the last one.
  return SUPPORTED_LANGUAGES[
    (currentIndex + 1) % SUPPORTED_LANGUAGES.length
  ].code;
};

export const stripLanguageFromPath = (pathname: string): string =>
  pathname.replace(LANGUAGE_PREFIX_REGEX, "");

export const hasLanguagePrefix = (pathname: string): boolean =>
  LANGUAGE_PREFIX_REGEX.test(pathname);

export const buildLocalizedPath = (
  language: string,
  pathname: string,
  search = "",
  hash = ""
): string => {
  const nextLanguage = normalizeLanguage(language);
  const strippedPath = stripLanguageFromPath(pathname) || "";
  // Avoid a double slash when the path is exactly "/" or empty.
  const normalizedPath =
    strippedPath === "/" || strippedPath === "" ? "" : strippedPath;

  return `/${nextLanguage}${normalizedPath}${search}${hash}`;
};

export const getSystemLanguage = (): AppLanguage => {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(
    navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage
  );
};
