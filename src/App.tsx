import React, { useEffect, useState } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";

import Config from "config/Config";
import { useAppDispatch, useAppSelector } from "../src/services/hooks/hooks";
import CookieConsent from "components/presentation/cookies/Cookies";
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getSafeConsentData,
} from "store/slices/common/cookieUtils";
import { getThemeMediaQuery } from "store/slices/common/themeUtils";
import { syncSystemTheme } from "store/slices/common/themeSlice";

function App() {
  const dispatch = useAppDispatch();
  const { currentTheme, themePreference } = useAppSelector((state) => state.theme);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect optional analytics consent before loading third-party telemetry.
    const syncAnalyticsConsent = () => {
      const consent = getSafeConsentData();
      setAnalyticsEnabled(Boolean(consent?.googleAnalytics));
    };

    syncAnalyticsConsent();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncAnalyticsConsent as EventListener);
    window.addEventListener("storage", syncAnalyticsConsent);

    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_UPDATED_EVENT,
        syncAnalyticsConsent as EventListener
      );
      window.removeEventListener("storage", syncAnalyticsConsent);
    };
  }, []);

  return (
    <div className={`${currentTheme === "light" ? "App" : "AppDark"} `}>
      <HelmetProvider>
        {import.meta.env.NODE_ENV === "production" && analyticsEnabled && <Analytics />}
        {import.meta.env.NODE_ENV === "production" && analyticsEnabled && <SpeedInsights />}
        <CookieConsent />
        <Config />
      </HelmetProvider>
    </div>
  );
}

export default App;
