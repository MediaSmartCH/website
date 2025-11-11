import React, { useEffect } from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";

import Config from "config/Config";
import { useAppSelector } from "../src/services/hooks/hooks";
import CookieConsent from "components/presentation/cookies/Cookies";

function App() {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // // Reset scroll on mount to ensure scroll is never blocked
  // useEffect(() => {
  //   document.body.style.overflow = "";
  //   document.documentElement.style.overflow = "";
  // }, []);

  return (
    <div className={`${themeReducer === "light" ? "App" : "AppDark"} `}>
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
