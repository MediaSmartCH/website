/**
 * Navigation below the `lg` breakpoint: a compact bar, the drop-down it opens,
 * and the backdrop that closes it.
 *
 * Kept in one file because the bar, the menu and the backdrop are three parts
 * of a single control — splitting them would hide the relationship.
 */

import React from "react";
import { Link } from "react-router-dom";

import BookingButton from "@features/booking/components/booking-button";

import LocaleThemeControls from "@shared/components/locale-theme-controls";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";
import type { NavbarSectionProps } from "@shared/components/navbar-desktop";


import logo from "@assets/images/logo-header.webp";
import logoDark from "@assets/images/logo-footer.webp";
import toggler from "@assets/icons/toggler.svg";

export interface NavbarMobileProps extends NavbarSectionProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

export default function NavbarMobile({
  language: languageReducer,
  theme: themeReducer,
  localeControls,
  onSectionClick: scrollToSection,
  isMenuOpen: mobileMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: NavbarMobileProps) {
  const t = useTranslations(languageReducer);
  const { L, Lhash } = useLangLink();

  return (
    <>
      <div className="block lg:hidden flex items-center justify-between h-[72px]">
        <Link to={L("/")} className="header-aos">
          <img
            src={themeReducer === "light" ? logo : logoDark}
            alt="MediaSmart"
            className="w-[130px]"
            width="412"
            height="53"
            fetchPriority="high"
            decoding="async"
          />
        </Link>
        <div className="flex justify-center items-center gap-x-[12px] sm:gap-x-[20px]">
          <LocaleThemeControls {...localeControls}
                size="xs" />
          <div className="">
            <button
              type="button"
              onClick={() => onToggleMenu()}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t.text("navbar.closeMenu") : t.text("navbar.openMenu")}
              className="flex items-center justify-center"
            >
              <img src={toggler} alt="Menu" className="w-[28px] h-[24px]" width="28" height="24" decoding="async" />
            </button>
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
              onClick={onCloseMenu}
              className={`text-heading-invert rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
            >
              {t.text("navbar.navItem1")}
            </Link>
            <Link
              to={L("/web-development")}
              onClick={onCloseMenu}
              className={`text-heading-invert rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
            >
              {t.text("navbar.navItem2")}
            </Link>
            <Link
              to={L("/projects")}
              onClick={onCloseMenu}
              className={`text-heading-invert rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
            >
              {t.text("navbar.navWork")}
            </Link>
            {/* ================================================================
                VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
                Lien vidéo du menu mobile mis en pause (site 100% informatique).
                Décommenter pour réactiver l'offre vidéo.
                ================================================================ */}
            {/*
            <Link
              to={L("/video-services")}
              onClick={onCloseMenu}
              className={`text-heading-invert rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
            >
              {t.text("navbar.navItem3")}
            </Link>
            */}
            <Link
              to={Lhash("#about")}
              onClick={(e) => scrollToSection("about", e)}
              className={`text-heading-invert rounded-xl px-3 py-2.5 font-poppins text-[16px] font-medium`}
            >
              {t.text("navbar.navItem4")}
            </Link>
            <div className="pt-2">
              <BookingButton
                className="navbar-btn w-full px-[16px] min-h-[42px] py-[8px] rounded-[8px] text-[#fff] font-poppins font-medium text-[16px]"
                text={t.text("navbar.navbarButton")}
              />
            </div>
          </div>
        </div>
      )}
      {mobileMenuOpen && (
        <button
          aria-label={t.text("navbar.closeMenu")}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onCloseMenu}
        />
      )}
    </>
  );
}
