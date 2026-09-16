import { useEffect, useState } from "react";

/**
 * Lets a page ask the consent banner to stay out of its way.
 *
 * The banner is mounted above the router, so it cannot tell a matched route
 * from a 404 by reading the path — any unknown URL renders the error page. The
 * page therefore announces itself: `useSuppressConsentModal()` on the way in,
 * and the banner subscribes with `useConsentSuppressed()`.
 *
 * Only the blocking modal is suppressed; the floating cookie button stays, so
 * the choice is still one click away.
 */

const CONSENT_SUPPRESSION_EVENT = "mediasmart:consent-suppression";

// Counted rather than boolean so a remount (StrictMode mounts twice in dev)
// cannot leave the flag stuck in either direction.
let suppressorCount = 0;

const broadcast = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_SUPPRESSION_EVENT));
};

export function useSuppressConsentModal() {
  useEffect(() => {
    suppressorCount += 1;
    broadcast();

    return () => {
      suppressorCount -= 1;
      broadcast();
    };
  }, []);
}

export function useConsentSuppressed() {
  const [suppressed, setSuppressed] = useState(() => suppressorCount > 0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sync = () => setSuppressed(suppressorCount > 0);

    sync();
    window.addEventListener(CONSENT_SUPPRESSION_EVENT, sync);

    return () => window.removeEventListener(CONSENT_SUPPRESSION_EVENT, sync);
  }, []);

  return suppressed;
}
