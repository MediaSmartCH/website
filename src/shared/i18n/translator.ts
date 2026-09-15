import { dictionary } from "@shared/i18n";

type SectionDict = Record<string, unknown>;
type Lang = string;
const DEFAULT_LANG: Lang = "en";

/**
 * Traverses a nested object along a dot-separated path.
 *
 * Returns undefined rather than throwing when a segment is missing: the whole
 * point of this module is that a translation gap degrades to a fallback instead
 * of taking the page down.
 */
function getIn(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) =>
      acc == null ? acc : (acc as Record<string, unknown>)[key],
    obj
  );
}

// Resolves the translation bucket for a top-level section (e.g. "navbar").
// Falls back to DEFAULT_LANG when the requested language has no entry for
// that section, so the site always renders something readable.
function pickLang(section: string, lang: Lang) {
  const sec = dictionary[section];
  if (!sec) return undefined;
  // `lang` is a plain string on purpose: it arrives from Redux and from the URL,
  // and an unrecognised value has to fall back rather than fail to compile.
  const byLang = sec as Record<string, SectionDict | undefined>;
  return byLang[lang] ?? byLang[DEFAULT_LANG];
}

function coerceArray<T = unknown>(val: unknown, fallback: T[]): T[] {
  return Array.isArray(val) ? (val as T[]) : fallback;
}

function coerceObject<T = Record<string, unknown>>(val: unknown, fallback: T): T {
  return (val && typeof val === "object" && !Array.isArray(val)) ? (val as T) : fallback;
}

function coerceString(val: unknown, fallback: string): string {
  return typeof val === "string" ? val : fallback;
}

export type SafeTranslator = {
  text: (path: string, fallback?: string) => string;
  object: <T = Record<string, unknown>>(path: string, fallback?: T) => T;
  array: <T = unknown>(path: string, fallback?: T[]) => T[];
};

export function makeTranslator(lang: Lang): SafeTranslator {
  // Warns in development only so translation gaps are caught during development
  // without cluttering the production console.
  const warn = (path: string, why: string) => {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] ${why} at "${path}" (lang=${lang})`);
    }
  };

  // Splits "section.key.subkey" into the top-level section and the remaining
  // dot path, then delegates deep access to getIn.
  const resolve = (path: string): unknown => {
    const [section, ...rest] = path.split(".");
    const bucket = pickLang(section, lang);
    if (!bucket) {
      warn(path, "missing section");
      return undefined;
    }
    const value = getIn(bucket, rest.join("."));
    if (value === undefined) warn(path, "missing key");
    return value;
  };

  return {
    // Falls back to a bracketed key name (⟪path⟫) when the value is missing,
    // making untranslated strings immediately visible in the UI.
    text(path, fb = `⟪${path}⟫`) {
      return coerceString(resolve(path), fb);
    },
    object<T = Record<string, unknown>>(path: string, fb = {} as T) {
      return coerceObject<T>(resolve(path), fb as T);
    },
    array<T = unknown>(path: string, fb: T[] = []) {
      return coerceArray<T>(resolve(path), fb);
    },
  };
}

import { useMemo } from "react";

// Memoize per language so callers can safely put `t` in effect / memo deps
// without re-firing the effect on every parent render. The translator is
// stateless; the only thing that matters for identity is the language.
export const useTranslations = (lang: Lang) =>
  useMemo(() => makeTranslator(lang), [lang]);
