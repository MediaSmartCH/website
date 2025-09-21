// import { navbar } from "./navbar";
// import { footer } from "./footer"
// import { en } from "./en/index"
// import { home } from "./home"
// import { it } from "./it"
// import { video } from "./video"
// import { error404 } from "./error404"
// import { cookies } from "./cookies";

import type { Dictionary, Lang } from "./types";
import * as EN from "./en";
import * as FR from "./fr";

export const navbar = {
  en: EN.navbar,
  fr: FR.navbar,
};

export const footer = {
  en: EN.footer,
  fr: FR.footer,
};

export const home = {
  en: EN.home,
  fr: FR.home,
};

export const it = {
  en: EN.it,
  fr: FR.it,
};

export const video = {
  en: EN.video,
  fr: FR.video,
};

export const error404 = {
  en: EN.error404,
  fr: FR.error404,
};

export const cookies = {
  en: EN.cookies,
  fr: FR.cookies,
};

export const dictionary: any = {
  navbar,
  footer,
  home,
  it,
  video,
  error404,
  cookies,
};

export const t = <T = string>(
  section: keyof typeof dictionary,
  key: string,
  lang: string
): T => {
  const sec = dictionary[section as keyof typeof dictionary]?.[lang as any];
  if (!sec) throw new Error(`Missing section/lang: ${String(section)}.${String(lang)}`);

  const value = key.split(".").reduce<any>((acc, k) => acc?.[k], sec);
  if (value === undefined) {
    throw new Error(`Missing key: ${String(section)}.${String(lang)}.${key}`);
  }
  return value as T;
};
