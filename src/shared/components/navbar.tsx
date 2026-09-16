import React, { useEffect } from "react";

import ThemeSwitchOverlay from "@shared/components/theme-switch-overlay";
import NavbarDesktop from "@shared/components/navbar-desktop";
import NavbarMobile from "@shared/components/navbar-mobile";


import { ThemePreference } from "@store/slices/common/themeUtils";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";
import { useThemeSwitch } from "@shared/hooks/use-theme-switch";

import "@styles/components/preloader.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    }
  };
  const {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference,
    animationsEnabled,
    changeLanguage,
    changeTheme,
    flipAnimations,
    labels,
  } = useInterfaceControls({ preserveScroll: true });

  // Allow lottie assets time to swap before hiding the overlay.
  const { isThemeChanging, requestThemeChange } = useThemeSwitch(
    themeReducer,
    themePreference,
    changeTheme
  );

  // Both navigations render the same control with the same props.
  const localeControls = {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference,
    onLanguageChange: changeLanguage,
    onThemeChange: (nextTheme: ThemePreference) => requestThemeChange(nextTheme),
    labels,
    animationsEnabled,
    onAnimationsToggle: flipAnimations,
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 100) {
        const header = document.querySelector("header");
        if (header) {
          header.classList.add("shrink");
        }
      } else {
        const header = document.querySelector("header");
        if (header) {
          header.classList.remove("shrink");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Full-screen overlay shown while lottie animations reload after a theme change. */}
      {isThemeChanging && (
        <ThemeSwitchOverlay theme={themeReducer} language={languageReducer} />
      )}
      <header
        className={`${themeReducer === "light" ? "bg-white" : "bg-[#2B284C]"
          } navbar-shadow`}
      >
        <div className="w-full homepage-container mx-auto px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px]">
          <NavbarDesktop
            language={languageReducer}
            theme={themeReducer}
            localeControls={localeControls}
            onSectionClick={scrollToSection}
          />
          <NavbarMobile
            language={languageReducer}
            theme={themeReducer}
            localeControls={localeControls}
            onSectionClick={scrollToSection}
            isMenuOpen={mobileMenuOpen}
            onToggleMenu={() => setMobileMenuOpen((open) => !open)}
            onCloseMenu={closeMobileMenu}
          />
        </div>
      </header>
    </>
  );
};

export default Navbar;
