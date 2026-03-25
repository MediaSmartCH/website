import React from "react";
import AOS from "aos";
import { useAppSelector } from "services/hooks/hooks";
import Navbar from "components/common/Navbar";
import Footer from "components/common/Footer";
import PageTopBackdrop from "components/common/PageTopBackdrop";
import { useLocation } from "react-router-dom";

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const { pathname, hash } = useLocation();
  const firstRenderRef = React.useRef(true);

  // Defer AOS init until the window load event to avoid layout shifts (FOUC)
  React.useEffect(() => {
    const onLoad = () => {
      AOS.init({
        once: true,
        offset: 50,
        startEvent: "load",
        disableMutationObserver: true,
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // AOS animations can hide elements — force header visibility after a theme change
  React.useEffect(() => {
    const elements = document.querySelectorAll(".header-aos");
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
  }, [themeReducer]);

  // Scroll to top on route change, skipping the initial render and hash links
  React.useEffect(() => {
    if (firstRenderRef.current) { firstRenderRef.current = false; return; }
    if (window.location.hash) return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, [pathname]);

  // Scroll to the target element when a hash is present. If the element isn't
  // mounted yet (cross-page navigation), retry after a short delay.
  React.useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return true; }
      return false;
    };
    if (!scroll()) {
      const timer = setTimeout(scroll, 120);
      return () => clearTimeout(timer);
    }
  }, [hash, pathname]);

  return (
    <div>
      <Navbar />
      <main className="relative">
        <PageTopBackdrop />
        <div className="relative z-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
