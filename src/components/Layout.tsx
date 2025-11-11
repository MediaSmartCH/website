import React from "react";
import AOS from "aos";
import { useAppSelector } from "services/hooks/hooks";
import Navbar from "components/common/Navbar";
import Footer from "components/common/Footer";
import { useLocation } from "react-router-dom";

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const { pathname } = useLocation();
  const firstRenderRef = React.useRef(true);

  // ⚠️ Init AOS après que TOUT soit chargé pour éviter le reflow (FOUC)
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

  // Forcer l’en-tête à rester visible après changement de thème
  React.useEffect(() => {
    const elements = document.querySelectorAll(".header-aos");
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
  }, [themeReducer]);

  // Scroll top sur changement de route (hors ancres)
  React.useEffect(() => {
    if (firstRenderRef.current) { firstRenderRef.current = false; return; }
    if (window.location.hash) return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, [pathname]);

  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;