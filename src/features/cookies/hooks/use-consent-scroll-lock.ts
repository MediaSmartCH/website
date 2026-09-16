import { useEffect } from "react";

/** Re-check delay, for extensions that hide the banner asynchronously. */
const RECHECK_DELAY_MS = 100;

/**
 * Locks page scroll while the consent modal is open.
 *
 * The extension check is not defensive coding for its own sake: ad blockers
 * routinely hide cookie banners with `display:none`. Without it, the banner is
 * invisible, the lock stays on, and the site looks frozen. So before locking we
 * confirm the banner is actually painted, and re-check shortly after in case the
 * extension acts on a delay.
 *
 * Scroll is always released on unmount, whatever path got us here.
 *
 * Distinct from the portfolio modal's lock in
 * features/it-services/hooks/use-modal-scroll-lock.ts, which compensates for
 * the scrollbar width and restores prior inline styles instead. The two differ
 * on purpose.
 */
export function useConsentScrollLock(locked: boolean) {
  useEffect(() => {
    const release = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    if (!locked) {
      release();
      return release;
    }

    const lockUnlessHidden = () => {
      const banner =
        document.querySelector('[style*="z-index: 999999"]') ||
        document.querySelector(".fixed.inset-0.z-50");

      if (banner) {
        const style = window.getComputedStyle(banner);
        const hiddenByExtension =
          style.display === "none" || style.visibility === "hidden" || style.opacity === "0";

        if (hiddenByExtension) {
          release();
          return;
        }
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };

    lockUnlessHidden();
    const timer = setTimeout(lockUnlessHidden, RECHECK_DELAY_MS);

    return () => {
      clearTimeout(timer);
      release();
    };
  }, [locked]);
}
