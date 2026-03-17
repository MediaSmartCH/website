import React, { useEffect } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";

import Config from "config/Config";
import { useAppDispatch, useAppSelector } from "../src/services/hooks/hooks";
import CookieConsent from "components/presentation/cookies/Cookies";
import { getThemeMediaQuery } from "store/slices/common/themeUtils";
import { syncSystemTheme } from "store/slices/common/themeSlice";

function App() {
  const dispatch = useAppDispatch();
  const { currentTheme, themePreference } = useAppSelector((state) => state.theme);

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

  // // Reset scroll on mount to ensure scroll is never blocked
  // useEffect(() => {
  //   document.body.style.overflow = "";
  //   document.documentElement.style.overflow = "";
  // }, []);

  return (
    <div className={`${currentTheme === "light" ? "App" : "AppDark"} `}>
      <HelmetProvider>
        {import.meta.env.NODE_ENV === "production" && <Analytics />}
        {import.meta.env.NODE_ENV === "production" && <SpeedInsights />}
        <CookieConsent />
        <Config />
      </HelmetProvider>
    </div>
  );
}

export default App;
