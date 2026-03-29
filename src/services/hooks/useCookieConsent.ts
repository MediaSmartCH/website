import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_UPDATED_EVENT,
  DEFAULT_CONSENT_PREFERENCES,
  getNormalizedConsentData,
  type ConsentPreferences,
} from "store/slices/common/cookieUtils";

// Returns the current cookie consent state and keeps it in sync with two sources:
// - COOKIE_CONSENT_UPDATED_EVENT: fired in the same tab when the user saves preferences.
// - "storage": fired by other tabs when localStorage changes, enabling cross-tab sync.
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentPreferences>(
    DEFAULT_CONSENT_PREFERENCES
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncConsent = () => {
      setConsent(getNormalizedConsentData());
    };

    // Read the current value immediately so the component does not render with
    // the default (all-false) preferences for one cycle.
    syncConsent();
    window.addEventListener(
      COOKIE_CONSENT_UPDATED_EVENT,
      syncConsent as EventListener
    );
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_UPDATED_EVENT,
        syncConsent as EventListener
      );
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  return consent;
}

export default useCookieConsent;
