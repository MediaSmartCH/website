import { useParams, useLocation } from "react-router-dom";
import {
  AppLanguage,
  buildLocalizedPath,
  normalizeLanguage,
  stripLanguageFromPath,
} from "config/languages";

export type Lang = AppLanguage;

export const useLang = (): Lang => {
  const { lang } = useParams<{ lang?: string }>();
  return normalizeLanguage(lang);
};

export const useLangLink = () => {
  const lang = useLang();
  const { pathname } = useLocation();

  const normalize = (p: string) => {
    if (!p) return "/";
    if (p.startsWith("#")) return p;
    return p.startsWith("/") ? p : `/${p}`;
  };

  const L = (path: string) => {
    const n = normalize(path);
    if (n.startsWith("#")) return `/${lang}${n}`;
    return buildLocalizedPath(lang, n);
  };

  const Lhash = (hash: string, opts?: { keepPath?: boolean }) => {
    const clean = hash.startsWith("#") ? hash : `#${hash}`;
    if (opts?.keepPath) {
      const base = stripLanguageFromPath(pathname) || "/";
      return buildLocalizedPath(lang, base, "", clean);
    }
    return buildLocalizedPath(lang, "/", "", clean);
  };

  return { lang, L, Lhash };
};
