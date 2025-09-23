// services/locales/safe.ts
import { dictionary } from "./index"; // ton dico existant
type Lang = string;                   // ou ton union 'en' | 'fr'
const DEFAULT_LANG: Lang = "en";      // adapte si besoin

// type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function getIn(obj: any, path: string): any {
  // path: "home.ITOverviewCards" ou "home.tile1.faqQuestion"
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function pickLang(section: string, lang: Lang) {
  const sec = (dictionary as any)[section];
  if (!sec) return undefined;
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
  /** Texte simple */
  text: (path: string, fallback?: string) => string;
  /** Objet typé */
  object: <T = Record<string, unknown>>(path: string, fallback?: T) => T;
  /** Tableau typé */
  array:  <T = unknown>(path: string, fallback?: T[]) => T[];
};

export function makeTranslator(lang: Lang): SafeTranslator {
  const warn = (path: string, why: string) => {
    if (process.env.NODE_ENV !== "production") {
      // évite le spam mais utile en dev
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

/** Hook pratique pour React */
export const useTranslations = (lang: Lang) => makeTranslator(lang);
