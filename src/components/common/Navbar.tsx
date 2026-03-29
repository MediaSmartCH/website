import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import ConsentAwareCalendlyButton from "components/common/ConsentAwareCalendlyButton";
import { useTranslations } from "services/locales/safe";
import logo from "assets/images/logo-header.webp";
import logoDark from "assets/images/logo-footer.webp";
import toggler from "assets/icons/toggler.svg";

import { useLangLink } from "services/router/langPath";
import LocaleThemeControls from "./LocaleThemeControls";
import {
  resolveThemePreference,
  ThemePreference,
} from "store/slices/common/themeUtils";
import { useInterfaceControls } from "services/hooks/useInterfaceControls";

import "components/preloader/preloader.css";

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
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${themeReducer === 'light' ? 'bg-white/90' : 'bg-black/90'
            }`}
        >
          <div className={`text-center p-8 rounded-lg border shadow-2xl ${themeReducer === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-gray-800 border-gray-700'
            }`}>
            <div className="flex justify-center mb-6">
              <div className="preloader-orbit-loading">
                <div className="cssload-inner cssload-one"></div>
                <div className="cssload-inner cssload-two"></div>
                <div className="cssload-inner cssload-three"></div>
              </div>
            </div>

            <h3 className={`font-medium text-xl mb-2 ${themeReducer === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
              {t.text("navbar.themeChangingTitle")}
            </h3>
            <p className={`text-sm ${themeReducer === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
              {t.text("navbar.themeChangingDescription")}
            </p>
          </div>
        </div>
      )}
      <header
        className={`${themeReducer === "light" ? "bg-white" : "bg-[#2B284C]"
          } navbar-shadow`}
      >
        <div className="w-full homepage-container mx-auto px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px]">
          {/* Desktop navigation (lg and up) */}
          <nav className="shift hidden lg:block lg:flex lg:items-center lg:justify-between h-[100px]">
            <Link to={L("/")}
              className="header-aos"
              data-aos="fade-down"
              data-aos-easing="ease-in-sine"
              data-aos-duration="700"
            >
              <img
                src={themeReducer === "light" ? logo : logoDark}
                alt="MediaSmart"
                className="w-[170px] xl:w-[190px] 2xl:w-[206px]"
                width="412"
                height="53"
              />
            </Link>
            <ul className="nav-list flex items-center justify-center lg:gap-x-[0px] xl:gap-x-[10px] 2xl:gap-x-[20px] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] lg:ml-[50px] lg:mr-[34px] xl:ml-[75px] xl:mr-[44px]">
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="900"
              >
                <Link
                  to={L("/")}
                  className={
                    themeReducer === "light"
                      ? "text-[#14172D] hover:text-[#fff]"
                      : "text-[#FFFFFF] hover:text-[#fff]"
                  }
                >
                  {t.text("navbar.navItem1")}
                </Link>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1100"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={L("/it-services")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {t.text("navbar.navItem2")}
                  </Link>
                </div>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1300"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={L("/video-services")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {t.text("navbar.navItem3")}
                  </Link>
                </div>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1500"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={Lhash("#about")}
                    onClick={(e) => scrollToSection("about", e)}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {t.text("navbar.navItem4")}
                  </Link>
                </div>
              </li>
            </ul>
            <div
              className="flex justify-center items-center gap-x-[26px] xl:gap-x-[30px] 2xl:gap-x-[36px]"
              data-aos="fade-down"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1900"
            >
              <LocaleThemeControls
                currentLanguage={languageReducer}
                currentTheme={themeReducer}
                themePreference={themePreference}
                onLanguageChange={changeLanguage}
                onThemeChange={handleThemeChange}
                labels={labels}
                animationsEnabled={animationsEnabled}
                onAnimationsToggle={flipAnimations}
              />
              <ConsentAwareCalendlyButton
                className="custom-btn2 middle-out px-[15px] xl:px-[18px] lg:min-h-[40px] xl:min-h-[44px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
                blockedTitle={t.text("cookies.manageCookies")}
                text={t.text("navbar.navbarButton")}
                pageSettings={{
                  backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                  textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                }}
              />
            </div>
          </nav>
          {/* Mobile navigation (below lg) */}
          <div className="block lg:hidden flex items-center justify-between h-[72px]">
            <Link to={L("/")} className="header-aos">
              <img
                src={themeReducer === "light" ? logo : logoDark}
                alt="MediaSmart"
                className="w-[130px]"
                width="412"
                height="53"
              />
            </Link>
            <div className="flex justify-center items-center gap-x-[12px] sm:gap-x-[20px]">
              <LocaleThemeControls
                currentLanguage={languageReducer}
                currentTheme={themeReducer}
                themePreference={themePreference}
                onLanguageChange={changeLanguage}
                onThemeChange={handleThemeChange}
                size="xs"
                labels={labels}
                animationsEnabled={animationsEnabled}
                onAnimationsToggle={flipAnimations}
              />
              <div className="">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle menu"
                  className="flex items-center justify-center"
                >
                  <img src={toggler} alt="Menu" className="w-[28px] h-[24px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div
            className={`${themeReducer === "light" ? "bg-white/95" : "bg-[#1D1B35]/95"
              } absolute inset-x-0 top-full z-50 border-t ${themeReducer === "light" ? "border-gray-200" : "border-white/10"
              } px-[25px] py-5 shadow-2xl backdrop-blur-md lg:hidden`}
          >
            <div className="homepage-container mx-auto flex flex-col gap-3">
              <Link
                to={Lhash("#home")}
                onClick={closeMobileMenu}
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-white"
                  } rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
              >
                {t.text("navbar.navItem1")}
              </Link>
              <Link
                to={L("/it-services")}
                onClick={closeMobileMenu}
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-white"
                  } rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
              >
                {t.text("navbar.navItem2")}
              </Link>
              <Link
                to={L("/video-services")}
                onClick={closeMobileMenu}
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-white"
                  } rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
              >
                {t.text("navbar.navItem3")}
              </Link>
              <Link
                to={Lhash("#about")}
                onClick={(e) => scrollToSection("about", e)}
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-white"
                  } rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
              >
                {t.text("navbar.navItem4")}
              </Link>
              <div className="pt-2">
                <ConsentAwareCalendlyButton
                  className="navbar-btn w-full px-[16px] min-h-[42px] py-[8px] rounded-[8px] text-[#fff] font-poppins font-medium text-[16px]"
                  blockedTitle={t.text("cookies.manageCookies")}
                  text={t.text("navbar.navbarButton")}
                  pageSettings={{
                    backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                    textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {mobileMenuOpen && (
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </header>
    </>
  );
};

export default Navbar;
