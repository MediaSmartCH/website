import { useEffect } from "react";

// Blocks pinch-to-zoom and double-tap zoom on mobile browsers that ignore
// the viewport meta `user-scalable=no` (e.g. Brave, DuckDuckGo on iOS/Android).
export const usePreventZoom = () => {
  useEffect(() => {
    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTap = 0;
    const preventDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
      }
      lastTap = now;
    };

    document.addEventListener("touchstart", preventPinch, { passive: false });
    document.addEventListener("touchmove", preventPinch, { passive: false });
    document.addEventListener("touchstart", preventDoubleTap, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventPinch);
      document.removeEventListener("touchmove", preventPinch);
      document.removeEventListener("touchstart", preventDoubleTap);
    };
  }, []);
};
