import React, { useEffect } from "react";
import { Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";
import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  hasLanguagePrefix,
  isSupportedLanguage,
  normalizeLanguage,
  stripLanguageFromPath,
  SUPPORTED_LANGUAGES,
} from "config/languages";

const canonicalBase = "https://mediasmart.ch";

const LangLayout: React.FC = () => {
  const { lang: rawLang } = useParams<{ lang?: string }>();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const currentInterfaceLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const lang = normalizeLanguage(rawLang);

  useEffect(() => {
    if (rawLang && isSupportedLanguage(rawLang)) {
      document.documentElement.setAttribute("lang", lang);
      dispatch(setLanguage(lang));
    }
  }, [lang, dispatch, rawLang]);

  if (rawLang && !isSupportedLanguage(rawLang)) {
    const targetLanguage = normalizeLanguage(currentInterfaceLanguage);
    return <Navigate to={`/${targetLanguage}/404`} replace />;
  }

  if (!rawLang) {
    const alreadyPrefixed = hasLanguagePrefix(pathname);
    const fixed = alreadyPrefixed
      ? pathname
      : buildLocalizedPath(DEFAULT_LANGUAGE, pathname);
    return <Navigate to={fixed} replace />;
  }

  const xdefPath = stripLanguageFromPath(pathname) || "/";

  return (
    <>
      <Helmet>
        {SUPPORTED_LANGUAGES.map((language) => (
          <link
            key={language.code}
            rel="alternate"
            href={`${canonicalBase}${buildLocalizedPath(language.code, pathname)}`}
            hrefLang={language.code}
          />
        ))}
        <link rel="alternate" href={`${canonicalBase}${xdefPath}`} hrefLang="x-default" />
        <link rel="canonical" href={`${canonicalBase}${pathname}`} />
      </Helmet>
      <Outlet />
    </>
  );
};

export default LangLayout;
