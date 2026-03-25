import React, { useEffect } from "react";
import { Outlet, useParams, useLocation, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";
import RouteSeo from "components/seo/RouteSeo";
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

  return (
    <>
      <RouteSeo language={lang} pathname={pathname} />
      <Outlet />
    </>
  );
};

export default LangLayout;
