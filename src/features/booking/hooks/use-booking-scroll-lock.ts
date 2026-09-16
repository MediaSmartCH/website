import React from 'react';

/**
 * Locks body scroll while the booking modal is open, so the page underneath
 * does not drift on iOS Safari or under a desktop scroll wheel.
 *
 * Restores whatever inline overflow was there rather than clearing it.
 *
 * This is the third scroll lock in the codebase, and the three are deliberately
 * not merged because they do different things:
 *   - this one   body overflow only
 *   - features/it-services/hooks/use-modal-scroll-lock — also compensates the
 *     scrollbar width and restores overscroll / touch-action
 *   - features/cookies/hooks/use-consent-scroll-lock — also locks
 *     documentElement, and declines to lock when an extension hid the banner
 * Unifying them would change the behaviour of two of the three.
 */
export function useBookingScrollLock(active: boolean): void {
  React.useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
