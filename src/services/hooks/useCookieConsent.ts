import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_UPDATED_EVENT,
  DEFAULT_CONSENT_PREFERENCES,
  getNormalizedConsentData,
  type ConsentPreferences,
} from "store/slices/common/cookieUtils";

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentPreferences>(
    DEFAULT_CONSENT_PREFERENCES
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncConsent = () => {
      setConsent(getNormalizedConsentData());
    };

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
