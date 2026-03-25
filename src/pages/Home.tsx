import React, { lazy, Suspense } from "react";
import AOS from "aos";

import { useAppSelector } from "services/hooks/hooks";

import About from "components/presentation/home/About";
import Hero from "components/presentation/home/Hero";
import ITOverview from "components/presentation/home/it-overview";
import VideoOverview from "components/presentation/home/video-overview";
import useScrollToHash from "services/hooks/useScrolltoHash";

const Contact = lazy(() => import("components/common/Contact"));

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
};

const getShouldDeferContact = () => {
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
  const [shouldDeferContact] = React.useState(() => getShouldDeferContact());
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [showContact, setShowContact] = React.useState(
    typeof window !== "undefined"
      ? window.location.hash === "#contact" || !getShouldDeferContact()
      : true
  );
  const contactSentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    AOS.refresh();
    setHasAnimated(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleHashNavigation = () => {
      if (window.location.hash === "#contact") {
        setShowContact(true);
      }
    };

    window.addEventListener("hashchange", handleHashNavigation);

    return () => window.removeEventListener("hashchange", handleHashNavigation);
  }, []);

  React.useEffect(() => {
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
  }, [showContact]);

  React.useEffect(() => {
    if (
      showContact ||
      typeof window === "undefined" ||
      !shouldDeferContact
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
  }, [showContact, shouldDeferContact]);

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
  }, [themeReducer, hasAnimated, showContact]);

  return (
    <>
      <Hero />
      <About />
      <ITOverview />
      <VideoOverview />
      <div ref={contactSentinelRef} aria-hidden="true" className="h-px w-full" />
      {showContact && (
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      )}
    </>
  );
};

export default Homepage;
