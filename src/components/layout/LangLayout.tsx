import React, { useEffect, useState } from "react";
import { Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";
import { ensureLocale, isLocaleReady } from "services/locales/registry";
import PreLoader from "components/preloader/preloader";
import RouteSeo from "components/layout/RouteSeo";
import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  hasLanguagePrefix,
  isSupportedLanguage,
  normalizeLanguage,
} from "config/languages";

const LangLayout: React.FC = () => {
  const { lang: rawLang } = useParams<{ lang?: string }>();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const currentInterfaceLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const lang = normalizeLanguage(rawLang);

  // Dictionaries are per-language chunks. The bootstrap loads the one the URL
  // asks for, and switching languages awaits the target before it commits, so
  // this is only ever false on a router-driven change to a language that was
  // never requested (e.g. the bare "/" redirect for a visitor whose stored
  // language is not the default one).
  const [localeReady, setLocaleReady] = useState(() => isLocaleReady(lang));

  useEffect(() => {
    if (isLocaleReady(lang)) {
      setLocaleReady(true);
      return;
    }

    let cancelled = false;
    setLocaleReady(false);

    ensureLocale(lang).then(() => {
      if (!cancelled) setLocaleReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Sync the <html lang> attribute and Redux state whenever the URL segment changes.
  useEffect(() => {
    if (rawLang && isSupportedLanguage(rawLang)) {
      document.documentElement.setAttribute("lang", lang);
      dispatch(setLanguage(lang));
    }
  }, [lang, dispatch, rawLang]);

  // Unknown language segment: redirect to 404 under the currently active locale.
  if (rawLang && !isSupportedLanguage(rawLang)) {
    const targetLanguage = normalizeLanguage(currentInterfaceLanguage);
    return <Navigate to={`/${targetLanguage}/404`} replace />;
  }

  // No language segment in URL: prepend the default locale and redirect.
  if (!rawLang) {
    const alreadyPrefixed = hasLanguagePrefix(pathname);
    const fixed = alreadyPrefixed
      ? pathname
      : buildLocalizedPath(DEFAULT_LANGUAGE, pathname);
    return <Navigate to={fixed} replace />;
  }

  if (!localeReady) {
    return <PreLoader />;
  }

  return (
    <>
      <RouteSeo language={lang} pathname={pathname} />
      <Outlet />
    </>
  );
};

export default LangLayout;
