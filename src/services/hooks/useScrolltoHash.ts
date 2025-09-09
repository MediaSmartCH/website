import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls smoothly to the element referenced by the current URL hash
 * after route changes and after the page content has rendered.
 */
export function useScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    // Try multiple times in case the target is rendered asynchronously
    let attemptsRemaining = 10;

    const tryScroll = () => {
      const id = location.hash.replace(/^#/, "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attemptsRemaining > 0) {
        attemptsRemaining -= 1;
        requestAnimationFrame(tryScroll);
      }
    };

    // Delay slightly to allow layout and images to settle
    const timeout = setTimeout(() => requestAnimationFrame(tryScroll), 0);
    return () => clearTimeout(timeout);
  }, [location.pathname, location.hash]);
}

export default useScrollToHash;

