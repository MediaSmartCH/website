import React, { useEffect } from "react";
import { Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppDispatch } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";

const canonicalBase = "https://mediasmart.ch";

const LangLayout: React.FC = () => {
  const { lang: rawLang } = useParams<{ lang?: "fr" | "en" }>();
  const lang: "fr" | "en" = rawLang === "en" ? "en" : "fr";
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    dispatch(setLanguage(lang));
  }, [lang, dispatch]);

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
