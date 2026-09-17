/**
 * Navigation shown from the `lg` breakpoint up: logo, links, locale and theme
 * controls, and the booking call to action.
 */

import React from "react";
import { Link } from "react-router-dom";

import BookingButton from "@features/booking/components/booking-button";

import LocaleThemeControls from "@shared/components/locale-theme-controls";
import type { AppLanguage } from "@shared/config/languages";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

import type { ResolvedTheme } from "@store/slices/common/themeUtils";

import logo from "@assets/images/logo-header.webp";
import logoDark from "@assets/images/logo-footer.webp";

export interface NavbarSectionProps {
  language: AppLanguage;
  theme: ResolvedTheme;
  /** Forwarded straight to LocaleThemeControls. */
  localeControls: Omit<React.ComponentProps<typeof LocaleThemeControls>, "size">;
  /** Smooth-scrolls to a section on the current page instead of navigating. */
  onSectionClick: (id: string, event: React.MouseEvent) => void;
}

export default function NavbarDesktop({
  language: languageReducer,
  theme: themeReducer,
  localeControls,
  onSectionClick: scrollToSection,
}: NavbarSectionProps) {
  const t = useTranslations(languageReducer);
  const { L, Lhash } = useLangLink();

  return (
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
          fetchPriority="high"
          decoding="async"
        />
      </Link>
      {/* ml-auto pushes the links to the right of the bar, next to the locale
          controls and the booking CTA, instead of centring them between the
          logo and the controls. */}
      <ul className="nav-list flex items-center justify-end ml-auto lg:gap-x-[14px] xl:gap-x-[20px] 2xl:gap-x-[26px] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] lg:mr-[26px] xl:mr-[36px] 2xl:mr-[44px]">
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
              to={L("/web-development")}
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
        {/* ====================================================================
            VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
            Lien vers les services vidéo mis en pause (site 100% informatique).
            Conservé tel quel : décommenter pour réactiver l'offre vidéo.
            ==================================================================== */}
        {/*
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
        */}
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
        <LocaleThemeControls {...localeControls} />
        <BookingButton
          className="custom-btn2 middle-out px-[15px] xl:px-[18px] lg:min-h-[40px] xl:min-h-[44px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center"
          text={t.text("navbar.navbarButton")}
        />
      </div>
    </nav>
  );
}
