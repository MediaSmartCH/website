import { useEffect } from "react";

/**
 * Locks body scroll while the portfolio modal is open.
 *
 * Compensates for the vanishing scrollbar so the page does not jump sideways,
 * and restores whatever the inline styles were rather than clearing them.
 *
 * Not the same as the consent banner's lock in
 * features/cookies/hooks/use-body-scroll-lock.ts: that one also locks the
 * documentElement and refuses to lock when an extension has hidden the banner.
 * The two behave differently on purpose and are deliberately not merged.
 */
export function useModalScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    const originalBodyStyles = {
      overscrollBehavior: document.body.style.overscrollBehavior,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      touchAction: document.body.style.touchAction,
    };
    // Add padding to compensate for the scrollbar disappearing and prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overscrollBehavior =
        originalBodyStyles.overscrollBehavior;
      document.body.style.overflow = originalBodyStyles.overflow;
      document.body.style.paddingRight = originalBodyStyles.paddingRight;
      document.body.style.touchAction = originalBodyStyles.touchAction;
    };
  }, [isLocked]);
}
