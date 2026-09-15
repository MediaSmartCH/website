import React, { useEffect } from "react";

import ThemeSwitchOverlay from "@shared/components/theme-switch-overlay";
import NavbarDesktop from "@shared/components/navbar-desktop";
import NavbarMobile from "@shared/components/navbar-mobile";
import { Link } from "react-router-dom";

import BookingButton from "@features/booking/components/booking-button";
import { useTranslations } from "@shared/i18n/translator";
import logo from "@assets/images/logo-header.webp";
import logoDark from "@assets/images/logo-footer.webp";
import toggler from "@assets/icons/toggler.svg";

import { useLangLink } from "@shared/hooks/use-localized-path";
import LocaleThemeControls from "@shared/components/locale-theme-controls";
import {
  resolveThemePreference,
  ThemePreference,
} from "@store/slices/common/themeUtils";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";

import "@styles/components/preloader.css";

const Navbar = () => {
  const { L, Lhash } = useLangLink();

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
  const [isThemeChanging, setIsThemeChanging] = React.useState(false);


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

  const t = useTranslations(languageReducer);

  // Both navigations render the same control with the same props.
  const localeControls = {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference,
    onLanguageChange: changeLanguage,
    onThemeChange: (nextTheme: ThemePreference) => handleThemeChange(nextTheme),
    labels,
    animationsEnabled,
    onAnimationsToggle: flipAnimations,
  };

  const handleThemeChange = (nextTheme: ThemePreference) => {
    if (isThemeChanging || nextTheme === themePreference) return;

    const nextResolvedTheme = resolveThemePreference(nextTheme);
    // Only show the loading overlay when the resolved (visual) theme actually changes.
    const shouldShowLoader = nextResolvedTheme !== themeReducer;

    if (shouldShowLoader) {
      setIsThemeChanging(true);
    }

    changeTheme(nextTheme);

    if (!shouldShowLoader) return;

    // Allow lottie assets time to swap before hiding the overlay.
    setTimeout(() => {
      setIsThemeChanging(false);
    }, 500);
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
