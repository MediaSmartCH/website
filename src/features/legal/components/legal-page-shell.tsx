/**
 * Shared chrome for the two text-only legal pages (legal notice, terms).
 *
 * Mirrors the privacy policy: same heading treatment, same measure, same
 * AOS handling. It is a shell rather than a copy so the three pages cannot
 * drift apart, and so the theme-dependent text classes are written once.
 */

import React, { useEffect, useState } from "react";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";

export interface LegalTextClasses {
  heading: string;
  body: string;
  h2: string;
  h3: string;
  list: string;
  link: string;
}

export interface LegalPageShellProps {
  title: string;
  /** Label preceding the date, e.g. "Dernière mise à jour :". */
  lastUpdatedLabel: string;
  /** ISO date this page was last reviewed. */
  lastUpdatedOn: string;
  children: (classes: LegalTextClasses) => React.ReactNode;
}

export default function LegalPageShell({
  title,
  lastUpdatedLabel,
  lastUpdatedOn,
  children,
}: LegalPageShellProps) {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const [formattedDate, setFormattedDate] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const locale = languageReducer === "en" ? "en-GB" : "fr-CH";
    setFormattedDate(new Date(lastUpdatedOn).toLocaleDateString(locale, options));
  }, [languageReducer, lastUpdatedOn]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      refreshAosAnimations();
      setHasAnimated(true);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  useEffect(() => {
    if (!hasAnimated) return;
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.add("aos-animate");
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "none";
    });
  }, [themeReducer, hasAnimated]);

  const isLight = themeReducer === "light";
  const textPrimary = isLight ? "text-[#14172D]" : "text-[#F6F6F6]";
  const textBody = isLight ? "text-[#413C58]" : "text-[#E5E5E5]";

  const classes: LegalTextClasses = {
    heading: textPrimary,
    body: textBody,
    h2: `text-xl font-semibold mt-8 mb-4 font-redDisplay ${textPrimary}`,
    h3: `font-semibold mt-4 ${textBody}`,
    list: `list-disc list-inside mt-2 mb-4 ml-4 ${textBody}`,
    link: "text-blue-600 underline",
  };

  return (
    <div className="w-full pt-[73px] md:pt-[130px] lg:pt-[100px]">
      <div className="relative z-10 px-[20px] pt-[28px] md:pt-[40px] lg:pt-[52px] xl:pt-[60px] 2xl:pt-[72px] flex justify-center items-start">
        <div>
          <h1
            className={`${textPrimary} w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          >
            {title} <span>-</span> <span className="gradient-text">MediaSmart</span>
          </h1>
          <p
            className={`${textBody} w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            {lastUpdatedLabel} {formattedDate}
          </p>
        </div>
      </div>

      <div className="relative z-10 font-poppins font-light text-sm w-full flex justify-center homepage-container px-[25px] md:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[18px] md:pt-[30px] lg:pt-[24px] pb-[70px]">
        <div className="max-w-3xl mx-auto">{children(classes)}</div>
      </div>
    </div>
  );
}
