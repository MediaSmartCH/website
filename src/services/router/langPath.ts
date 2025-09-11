import { useParams, useLocation } from "react-router-dom";
export type Lang = "fr" | "en";

export const useLang = (): Lang => {
  const { lang } = useParams<{ lang?: Lang }>();
  return (lang === "en" ? "en" : "fr");
};

export const useLangLink = () => {
  const lang = useLang();
  const { pathname } = useLocation();

  const normalize = (p: string) => {
    if (!p) return "/";
    if (p.startsWith("#")) return "/" + p;
    return p.startsWith("/") ? p : `/${p}`;
  };

  const L = (path: string) => `/${lang}${normalize(path)}`;

  const Lhash = (hash: string, opts?: { keepPath?: boolean }) => {
    const clean = hash.startsWith("#") ? hash : `#${hash}`;
    if (opts?.keepPath) {
      const stripped = pathname.replace(/^\/(fr|en)/, "");
      return `/${lang}${stripped}${clean}`;
    }
    return `/${lang}${clean}`;
  };

  return { lang, L, Lhash };
};
