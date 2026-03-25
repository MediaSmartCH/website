import { useTranslations } from "services/locales/safe";
import {
  AppLanguage,
  buildLocalizedPath,
  getNextLanguage,
  normalizeLanguage,
} from "config/languages";
import { setLanguage } from "store/slices/common/languageSlice";
import { setTheme } from "store/slices/common/themeSlice";
import { ThemePreference } from "store/slices/common/themeUtils";

import { useAppDispatch, useAppSelector } from "./hooks";

type UseInterfaceControlsOptions = {
  preserveScroll?: boolean;
};

export const useInterfaceControls = (
  options: UseInterfaceControlsOptions = {}
) => {
  const { preserveScroll = false } = options;
  const dispatch = useAppDispatch();

  const currentLanguage = normalizeLanguage(
    useAppSelector((state) => state.language.currentLanguage)
  );
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themePreference = useAppSelector((state) => state.theme.themePreference);

  const t = useTranslations(currentLanguage);

  const changeLanguage = (nextLanguage: AppLanguage) => {
    if (nextLanguage === currentLanguage) {
      return;
    }

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    dispatch(setLanguage(nextLanguage));

    try {
      const nextUrl = buildLocalizedPath(
        nextLanguage,
        window.location.pathname,
        window.location.search,
        window.location.hash
      );

      window.history.replaceState(null, "", nextUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));

      if (!preserveScroll) {
        return;
      }

      // Restore scroll position across multiple frames because layout may reflow after language change
      requestAnimationFrame(() => {
        window.scrollTo(scrollX, scrollY);
        setTimeout(() => window.scrollTo(scrollX, scrollY), 0);
        setTimeout(() => window.scrollTo(scrollX, scrollY), 50);
      });
    } catch (error) {
      console.warn("Language change URL swap failed:", error);
      dispatch(setLanguage(nextLanguage));
    }
  };

  const cycleLanguage = () => {
    changeLanguage(getNextLanguage(currentLanguage));
  };

  const changeTheme = (nextTheme: ThemePreference) => {
    dispatch(setTheme(nextTheme));
  };

  return {
    currentLanguage,
    currentTheme,
    themePreference,
    changeLanguage,
    cycleLanguage,
    changeTheme,
    labels: {
      languageSelector: t.text("navbar.languageSelector"),
      themeSelector: t.text("navbar.themeSelector"),
      themeLight: t.text("navbar.themeLight"),
      themeDark: t.text("navbar.themeDark"),
      themeSystem: t.text("navbar.themeSystem"),
    },
  };
};
