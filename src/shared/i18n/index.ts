/**
 * Public face of the i18n layer.
 *
 * Everything lives in registry.ts; this file exists so `translator.ts` and the
 * entry points import from one stable path, and so the test suite has a single
 * module to mock.
 *
 * Read translations through `useTranslations` / `makeTranslator` in
 * translator.ts, never from `dictionary` directly: the translator falls back to
 * a readable placeholder, whereas a raw lookup returns undefined and renders
 * nothing.
 */

export {
  dictionary,
  ensureLocale,
  isLocaleReady,
  registerLocale,
} from "@shared/i18n/registry";
