import React, { useEffect } from "react";
import "@styles/app.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";

import Config from "@app/router";
import { useAppDispatch, useAppSelector } from "@shared/hooks/store-hooks";
import CookieConsent from "@features/cookies/components/cookie-banner";
import { getThemeMediaQuery } from "@store/slices/common/themeUtils";
import { syncSystemTheme } from "@store/slices/common/themeSlice";
import useCookieConsent from "@shared/hooks/use-cookie-consent";
import { useKonamiCode } from "@shared/hooks/use-konami-code";
import { usePreventZoom } from "@shared/hooks/use-prevent-zoom";

function App() {
  const dispatch = useAppDispatch();
  const { currentTheme, themePreference } = useAppSelector((state) => state.theme);
  const consent = useCookieConsent();
  usePreventZoom();
  useKonamiCode("https://apps.mediasmart.ch/CC-Voice/");

  // Keep the theme in sync with the OS color-scheme when the user has not
  // chosen a manual preference. Uses the modern addEventListener API and
  // falls back to the deprecated addListener for older browsers.
  useEffect(() => {
    if (themePreference !== "system") return;

    const mediaQuery = getThemeMediaQuery();
    if (!mediaQuery) return;

    const handleSystemThemeChange = () => {
      dispatch(syncSystemTheme());
    };

    handleSystemThemeChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }

    mediaQuery.addListener(handleSystemThemeChange);

    return () => {
      mediaQuery.removeListener(handleSystemThemeChange);
    };
  }, [dispatch, themePreference]);

  return (
    <div className={`${currentTheme === "light" ? "App" : "AppDark"} `}>
      <HelmetProvider>
        {import.meta.env.NODE_ENV === "production" && consent.googleAnalytics && <Analytics />}
        {import.meta.env.NODE_ENV === "production" && consent.googleAnalytics && <SpeedInsights />}
        <CookieConsent />
        <Config />
      </HelmetProvider>
    </div>
  );
}

export default App;
