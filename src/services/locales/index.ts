import { dictionary } from "./registry";

export { dictionary, registerLocale, ensureLocale, isLocaleReady } from "./registry";

export const t = <T = string>(
  section: string,
  key: string,
  lang: string
): T => {
  const sec = dictionary[section]?.[lang as never];
  if (!sec) throw new Error(`Missing section/lang: ${String(section)}.${String(lang)}`);

  const value = key.split(".").reduce<any>((acc, k) => acc?.[k], sec);
  if (value === undefined) {
    throw new Error(`Missing key: ${String(section)}.${String(lang)}.${key}`);
  }
  return value as T;
};
