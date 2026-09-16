import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToHash(offset = -25) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    let attempts = 50;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const header = document.querySelector("header") as HTMLElement | null;
        const headerH = header?.offsetHeight ?? 0;
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerH - offset;
        window.scrollTo({ top, left: 0, behavior: "smooth" });
        return;
      }
      // Retry via rAF up to 50 times to handle elements that render asynchronously
      if (attempts-- > 0) requestAnimationFrame(tick);
    };

    const t = setTimeout(() => requestAnimationFrame(tick), 50);
    return () => { cancelled = true; clearTimeout(t); };
  }, [pathname, hash, offset]);
}
