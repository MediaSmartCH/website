// src/services/router/langPath.ts
import { useParams, useLocation } from "react-router-dom";
export type Lang = "fr" | "en";

export const useLang = (): Lang => {
  const { lang } = useParams<{ lang?: Lang }>();
  return lang === "en" ? "en" : "fr";
};

export const useLangLink = () => {
  const lang = useLang();
  const { pathname } = useLocation();

  const normalize = (p: string) => {
    if (!p) return "/";
    if (p.startsWith("#")) return p; // ⬅️ IMPORTANT: pas de "/#..."
    return p.startsWith("/") ? p : `/${p}`;
  };

  /** L("/it-services") -> "/fr/it-services" */
  const L = (path: string) => {
    const n = normalize(path);
    // si on reçoit juste un hash ("#about"), on colle directement après /:lang
    if (n.startsWith("#")) return `/${lang}${n}`; // "/fr#about"
    return `/${lang}${n}`;                       // "/fr/it-services"
  };

  /**
   * Lhash("#about") -> "/fr#about" (vers la Home par défaut)
   * Lhash("#about", { keepPath:true }) -> "/fr/it-services#about" (garde la page courante)
   */
  const Lhash = (hash: string, opts?: { keepPath?: boolean }) => {
    const clean = hash.startsWith("#") ? hash : `#${hash}`;
    if (opts?.keepPath) {
      const stripped = pathname.replace(/^\/(fr|en)/, "");
      const base = stripped || "/";
      // "/fr/<page>#about"
      return `/${lang}${base}${clean}`;
    }
    // "/fr#about" (section de la Home)
    return `/${lang}${clean}`;
  };

  return { lang, L, Lhash };
};
