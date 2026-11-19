import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element named by the URL hash, and keeps it there until the
 * page stops moving under it.
 *
 * ## Why this is not a one-shot scroll
 *
 * It used to scroll once, as soon as it found the element. That works for an
 * in-page anchor and for a client-side navigation, and fails for the case that
 * matters most for a link someone shares: opening `/fr#services` cold.
 *
 * On a cold load the element is found immediately — the page ships
 * pre-rendered, so `#services` is in the HTML before any JavaScript runs — and
 * the scroll happens. Then React mounts, empties `#root` to render into it,
 * and for one frame the document is a few hundred pixels tall instead of
 * thirteen thousand. The browser clamps the scroll position to 0, React paints
 * the real page, and nothing ever scrolls again: the hash has not changed, so
 * a one-shot effect has no reason to run twice.
 *
 * Late layout shifts do the same thing more quietly — a poster resolving above
 * the target moves it after the scroll has finished.
 *
 * So this follows the target instead of aiming at it once. Each frame it
 * recomputes where the element should sit, and re-issues the scroll if the
 * page is not converging on it: smoothly the first time, instantly afterwards,
 * because a second animation on top of a correction reads as a stutter.
 *
 * It gives up on three conditions, so it can never fight the reader or spin:
 * once the position has held for a few frames, after a bounded number of
 * frames, and immediately on any wheel, touch or key — at which point the
 * reader has taken over and where they are is where they want to be.
 */

/** ~1.3s at 60fps. Long enough for a cold load, short enough to not linger. */
const MAX_FRAMES = 80;
/** Consecutive frames on target before we consider the page settled. */
const SETTLED_FRAMES = 5;
/** Sub-pixel scroll positions make exact comparison useless. */
const TOLERANCE_PX = 2;

export default function useScrollToHash(offset = -25) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1);
    let cancelled = false;
    let frames = 0;
    let settled = 0;
    let issued = false;
    let previousY = -1;
    let rafId = 0;

    // The reader taking over ends this, whatever state it is in.
    const yieldToReader = () => {
      cancelled = true;
    };
    const listeners: Array<[keyof WindowEventMap, EventListener]> = [
      ["wheel", yieldToReader],
      ["touchstart", yieldToReader],
      ["keydown", yieldToReader],
    ];
    listeners.forEach(([type, listener]) =>
      window.addEventListener(type, listener, { passive: true, once: true })
    );

    const targetFor = (element: HTMLElement) => {
      const header = document.querySelector("header") as HTMLElement | null;
      const headerHeight = header?.offsetHeight ?? 0;
      const top =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        offset;

      return Math.max(0, Math.round(top));
    };

    const tick = () => {
      if (cancelled) return;

      if (frames++ > MAX_FRAMES) return;

      const element = document.getElementById(id);

      // The element can be late: a lazy route chunk, or a section behind a
      // Suspense boundary. Keep looking within the frame budget.
      if (!element) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const target = targetFor(element);
      const current = Math.round(window.pageYOffset);

      if (Math.abs(current - target) <= TOLERANCE_PX) {
        if (++settled >= SETTLED_FRAMES) return;
      } else {
        settled = 0;

        // Only re-issue when the page is not already moving towards it;
        // interrupting a smooth scroll every frame turns it into a jump.
        const moving = current !== previousY;

        if (!issued || !moving) {
          window.scrollTo({
            top: target,
            left: 0,
            behavior: issued ? "auto" : "smooth",
          });
          issued = true;
        }
      }

      previousY = current;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      listeners.forEach(([type, listener]) =>
        window.removeEventListener(type, listener)
      );
    };
  }, [pathname, hash, offset]);
}
