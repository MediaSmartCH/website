import { useEffect, useState } from "react";

import { getSafeConsentData, saveConsentData } from "@store/slices/common/cookieUtils";

/**
 * The three optional consent categories and the actions that persist them.
 *
 * Reads the stored record once on mount and reports whether one existed, which
 * is what decides between showing the banner and showing the settings button.
 * Persistence itself stays in cookieUtils; this hook only owns the in-form state.
 */

/** A category is on, off, or partially on when it groups several services. */
export type ToggleState = "active" | "inactive" | "partial";

export interface ConsentPreferences {
  googleAnalytics: boolean;
  themePreference: boolean;
  languagePreference: boolean;
}

export function useConsentPreferences() {
  const [googleAnalytics, setGoogleAnalytics] = useState(false);
  const [themePreference, setThemePreference] = useState(false);
  const [languagePreference, setLanguagePreference] = useState(false);
  /** null until the stored record has been read, so callers can wait. */
  const [hasStoredConsent, setHasStoredConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = getSafeConsentData();

    if (!consent) {
      setHasStoredConsent(false);
      return;
    }

    // Boolean() guards against entries missing from an older stored record.
    setGoogleAnalytics(Boolean(consent.googleAnalytics));
    setThemePreference(Boolean(consent.themePreference));
    setLanguagePreference(Boolean(consent.languagePreference));
    setHasStoredConsent(true);
  }, []);

  /** Functionality groups two services, so it can sit between on and off. */
  const functionalityState: ToggleState = (() => {
    const enabled = [themePreference, languagePreference].filter(Boolean).length;
    if (enabled === 0) return "inactive";
    if (enabled === 2) return "active";
    return "partial";
  })();

  const performanceState: ToggleState = googleAnalytics ? "active" : "inactive";

  /** Partial counts as off, so one more tap turns the whole group on. */
  const toggleFunctionality = () => {
    const turningOn = functionalityState !== "active";
    setThemePreference(turningOn);
    setLanguagePreference(turningOn);
  };

  const togglePerformance = () => setGoogleAnalytics(performanceState === "inactive");

  const persist = (preferences: ConsentPreferences) => {
    setGoogleAnalytics(preferences.googleAnalytics);
    setThemePreference(preferences.themePreference);
    setLanguagePreference(preferences.languagePreference);
    saveConsentData(preferences);
  };

  const acceptAll = () =>
    persist({ googleAnalytics: true, themePreference: true, languagePreference: true });

  const rejectAll = () =>
    persist({ googleAnalytics: false, themePreference: false, languagePreference: false });

  const saveCurrent = () =>
    saveConsentData({ googleAnalytics, themePreference, languagePreference });

  return {
    googleAnalytics,
    themePreference,
    languagePreference,
    hasStoredConsent,
    functionalityState,
    performanceState,
    toggleFunctionality,
    togglePerformance,
    acceptAll,
    rejectAll,
    saveCurrent,
  };
}
