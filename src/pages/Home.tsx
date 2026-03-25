import React, { lazy, Suspense } from "react";
import AOS from "aos";

import { useAppSelector } from "services/hooks/hooks";

import Hero from "components/presentation/home/Hero";
import useScrollToHash from "services/hooks/useScrolltoHash";

const About = lazy(() => import("components/presentation/home/About"));
const ITOverview = lazy(() => import("components/presentation/home/it-overview"));
const VideoOverview = lazy(
  () => import("components/presentation/home/video-overview")
);
const Contact = lazy(() => import("components/common/Contact"));

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
};

const getShouldDeferBelowFold = () => {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(max-width: 767px)");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
  const slowConnection =
    connection?.saveData === true ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "");

  return mediaQuery.matches || motionQuery.matches || slowConnection;
};

const Homepage = () => {
  useScrollToHash();

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const [shouldDeferBelowFold] = React.useState(() => getShouldDeferBelowFold());
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [showBelowFold, setShowBelowFold] = React.useState(
    typeof window !== "undefined"
      ? Boolean(window.location.hash) || !getShouldDeferBelowFold()
      : true
  );
  const [showContact, setShowContact] = React.useState(
    typeof window !== "undefined"
      ? window.location.hash === "#contact" || !getShouldDeferBelowFold()
      : true
  );
  const contactSentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (showBelowFold || typeof window === "undefined" || !shouldDeferBelowFold) {
      return;
    }

    const reveal = () => {
      React.startTransition(() => {
        setShowBelowFold(true);
      });
    };

    const handleHashNavigation = () => {
      if (window.location.hash === "#contact") {
        setShowContact(true);
      }
      reveal();
    };
    const handleUserIntent = () => reveal();

    window.addEventListener("hashchange", handleHashNavigation);
    window.addEventListener("scroll", handleUserIntent, { once: true, passive: true });
    window.addEventListener("wheel", handleUserIntent, { once: true, passive: true });
    window.addEventListener("touchstart", handleUserIntent, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", handleUserIntent, { once: true });

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const timeout = 600;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(reveal, { timeout });
    } else {
      timeoutId = window.setTimeout(reveal, timeout);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashNavigation);
      window.removeEventListener("scroll", handleUserIntent);
      window.removeEventListener("wheel", handleUserIntent);
      window.removeEventListener("touchstart", handleUserIntent);
      window.removeEventListener("keydown", handleUserIntent);

      if (typeof idleId === "number" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (typeof timeoutId === "number") {
        window.clearTimeout(timeoutId);
      }
    };
  }, [showBelowFold, shouldDeferBelowFold]);

  React.useEffect(() => {
    AOS.refresh();
    setHasAnimated(true);
  }, []);

  React.useEffect(() => {
    if (!showBelowFold) return;

    const rafId = window.requestAnimationFrame(() => {
      AOS.refresh();

      if (window.location.hash === "#contact" && !showContact) {
        setShowContact(true);
        return;
      }

      if (!window.location.hash) return;

      const sectionId = window.location.hash.replace("#", "");
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [showBelowFold, showContact]);

  React.useEffect(() => {
    if (
      !showBelowFold ||
      showContact ||
      typeof window === "undefined" ||
      !shouldDeferBelowFold
    ) {
      return;
    }

    if (window.location.hash === "#contact") {
      setShowContact(true);
      return;
    }

    const target = contactSentinelRef.current;
    if (!target || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShowContact(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [showBelowFold, showContact, shouldDeferBelowFold]);

  React.useEffect(() => {
    if (!showContact || typeof window === "undefined" || window.location.hash !== "#contact") {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [showContact]);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  React.useEffect(() => {
    if (hasAnimated) {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => {
        el.classList.add('aos-animate');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }, [themeReducer, hasAnimated, showBelowFold, showContact]);

  return (
    <>
      <Hero />
      {showBelowFold && (
        <Suspense fallback={null}>
          <About />
          <ITOverview />
          <VideoOverview />
          <div ref={contactSentinelRef} aria-hidden="true" className="h-px w-full" />
          {showContact && <Contact />}
        </Suspense>
      )}
    </>
  );
};

export default Homepage;
