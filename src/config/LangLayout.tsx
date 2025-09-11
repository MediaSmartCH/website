import React, { useEffect } from "react";
import { Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";

const canonicalBase = "https://mediasmart.ch";

const LangLayout: React.FC = () => {
  const { lang: rawLang } = useParams<{ lang?: "fr" | "en" }>();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  
  // Récupérer la langue actuellement sélectionnée dans l'interface
  const currentInterfaceLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  // Typer lang AVANT les hooks
  const lang: "fr" | "en" = rawLang === "en" ? "en" : "fr";

  useEffect(() => {
    // Ne mettre à jour que si la langue est valide
    if (rawLang && ["fr", "en"].includes(rawLang)) {
      document.documentElement.setAttribute("lang", lang);
      dispatch(setLanguage(lang));
    }
  }, [lang, dispatch, rawLang]);

  // Vérifier si rawLang est une langue supportée APRÈS les hooks
  if (rawLang && !["fr", "en"].includes(rawLang)) {
    // Rediriger vers la 404 dans la langue de l'interface actuelle
    const targetLanguage = currentInterfaceLanguage || "fr";
    return <Navigate to={`/${targetLanguage}/404`} replace />;
  }

  if (!rawLang) {
    const alreadyPrefixed = /^\/(fr|en)(\/|$)/.test(pathname);
    const fixed = alreadyPrefixed ? pathname : `/fr${pathname === "/" ? "" : pathname}`;
    return <Navigate to={fixed} replace />;
  }

  const frPath = pathname.replace(/^\/(fr|en)/, "/fr");
  const enPath = pathname.replace(/^\/(fr|en)/, "/en");
  const xdefPath = pathname.replace(/^\/(fr|en)/, "/");

  return (
    <>
      <Helmet>
        <link rel="alternate" href={`${canonicalBase}${frPath}`} hrefLang="fr" />
        <link rel="alternate" href={`${canonicalBase}${enPath}`} hrefLang="en" />
        <link rel="alternate" href={`${canonicalBase}${xdefPath}`} hrefLang="x-default" />
        <link rel="canonical" href={`${canonicalBase}${pathname}`} />
      </Helmet>
      <Outlet />
    </>
  );
};

export default LangLayout;