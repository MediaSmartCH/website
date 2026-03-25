import { dictionary } from "./index";
type Lang = string;
const DEFAULT_LANG: Lang = "en";

function getIn(obj: any, path: string): any {
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function pickLang(section: string, lang: Lang) {
  const sec = (dictionary as any)[section];
  if (!sec) return undefined;
  // Fall back to DEFAULT_LANG if the requested language is not available
  return sec[lang] ?? sec[DEFAULT_LANG];
}

function coerceArray<T = unknown>(val: any, fallback: T[]): T[] {
  return Array.isArray(val) ? (val as T[]) : fallback;
}

function coerceObject<T = Record<string, unknown>>(val: any, fallback: T): T {
  return (val && typeof val === "object" && !Array.isArray(val)) ? (val as T) : fallback;
}

function coerceString(val: any, fallback: string): string {
  return typeof val === "string" ? val : fallback;
}

export type SafeTranslator = {
  text: (path: string, fallback?: string) => string;
  object: <T = Record<string, unknown>>(path: string, fallback?: T) => T;
  array: <T = unknown>(path: string, fallback?: T[]) => T[];
};

export function makeTranslator(lang: Lang): SafeTranslator {
  const warn = (path: string, why: string) => {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] ${why} at "${path}" (lang=${lang})`);
    }
  };

  const resolve = (path: string): any => {
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

export const useTranslations = (lang: Lang) => makeTranslator(lang);
