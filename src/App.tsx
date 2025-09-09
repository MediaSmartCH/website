import React from "react";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Config from "config/Config";
import { useAppSelector } from "../src/services/hooks/hooks";
import CookieConsent from "components/presentation/cookies/Cookies";

function App() {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className={`${themeReducer === "light" ? "App" : "AppDark"} `}>
      {/* Vercel analytics */}
      <Analytics />
      <SpeedInsights />

      {/* ✅ GDPR Cookie Banner */}
      <CookieConsent />

      {/* App Config */}
      <Config />
    </div>
  );
}

export default App;
