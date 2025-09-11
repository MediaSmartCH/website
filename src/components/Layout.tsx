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

  React.useEffect(() => {
    AOS.init({ once: true, offset: 50 });
  }, []);

  React.useEffect(() => {
    const elements = document.querySelectorAll(".header-aos");
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
  }, [themeReducer]);

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
