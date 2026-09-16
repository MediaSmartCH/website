/**
 * 404 page.
 *
 * Rendered outside the site shell (see the route in `app/router.tsx`): no
 * fixed header sitting on top of it, no footer to discover by scrolling. It is
 * a self-contained screen — the logo is the way back in, and every other
 * control points at somewhere that actually exists.
 *
 * The consent modal is suppressed here too: a blocking dialog on top of an
 * error page is one dead end stacked on another.
 */

import React from "react";
import { ArrowLeft, Boxes, Mail, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import BookingButton from "@features/booking/components/booking-button";
import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import LocaleThemeControls from "@shared/components/locale-theme-controls";
import ThemeSwitchOverlay from "@shared/components/theme-switch-overlay";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useSuppressConsentModal } from "@shared/hooks/use-consent-suppression";
import { useThemeSwitch } from "@shared/hooks/use-theme-switch";
import { useTranslations } from "@shared/i18n/translator";
import { getSupportEmail } from "@shared/constants/contact";

import logo from "@assets/images/logo-header.webp";
import logoDark from "@assets/images/logo-footer.webp";

const Error404Page: React.FC = () => {
  const navigate = useNavigate();
  const { L } = useLangLink();

  useSuppressConsentModal();

  // The navbar is not rendered here, so this page carries its own copy of the
  // language / theme / animation pills — otherwise a visitor who lands on a
  // 404 in the wrong language has no way to switch.
  const {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference,
    animationsEnabled,
    changeLanguage,
    changeTheme,
    flipAnimations,
    labels,
  } = useInterfaceControls();

  const { isThemeChanging, requestThemeChange } = useThemeSwitch(
    themeReducer,
    themePreference,
    changeTheme
  );

  const t = useTranslations(languageReducer);
  const classes = getPortfolioThemeClasses(themeReducer);

  const isLight = themeReducer === "light";

  const handleContact = () => {
    window.location.href = `mailto:${getSupportEmail()}`;
  };

  const secondaryButtonClass = `flex min-h-[45px] items-center justify-center gap-2 rounded-[5px] border px-[20px] font-poppins text-[14px] font-light transition duration-200 ${
    isLight
      ? "border-[#D9DCF2] bg-white/70 text-[#2C3A87] hover:bg-[#EEF0FF]"
      : "border-white/15 text-[#DAD7FF] hover:bg-white/10"
  }`;

  // The two shortcuts out of the dead end. Both land on the services page —
  // one at the top, one straight on the products section.
  const destinations = [
    {
      to: L("/it-services"),
      Icon: Wrench,
      title: t.text("error404.itServicesTitle"),
      description: t.text("error404.itServicesDescription"),
    },
    {
      to: `${L("/it-services")}#saas`,
      Icon: Boxes,
      title: t.text("error404.saasTitle"),
      description: t.text("error404.saasDescription"),
    },
  ];

  return (
    <div
      className={`relative flex min-h-[100dvh] flex-col overflow-hidden ${
        isLight ? "bg-white" : "bg-[#14172D]"
      }`}
    >
      {isThemeChanging && (
        <ThemeSwitchOverlay theme={themeReducer} language={languageReducer} />
      )}

      <LocaleThemeControls
        currentLanguage={languageReducer}
        currentTheme={themeReducer}
        themePreference={themePreference}
        onLanguageChange={changeLanguage}
        onThemeChange={requestThemeChange}
        animationsEnabled={animationsEnabled}
        onAnimationsToggle={flipAnimations}
        labels={labels}
        themeDisabled={isThemeChanging}
        className="absolute right-5 top-5 z-20 md:right-8 md:top-7"
      />

      {/* Bounded decorative wave. `hero-bg` scales with `background-size:
          cover`, so letting it own the whole screen turns the curve into a
          full-height smear. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-[560px] md:h-[640px] ${
          isLight ? "hero-bg" : "hero-bg-dark"
        }`}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full homepage-container mx-auto px-[25px] md:px-[50px] xl:px-[100px] py-[48px] md:py-[60px]">
        {/* The logo is the main way back to the site, so it gets the size to
            match rather than being tucked into a bar that is not there. */}
        <Link
          to={L("/")}
          aria-label="MediaSmart"
          className="transition-opacity duration-200 hover:opacity-80"
        >
          <img
            src={isLight ? logo : logoDark}
            alt="MediaSmart"
            className="w-[220px] md:w-[260px] xl:w-[300px]"
            width="412"
            height="53"
            fetchPriority="high"
            decoding="async"
          />
        </Link>

        <div className="mt-[44px] max-w-[720px] text-center md:mt-[56px]">
          <span
            className={`inline-block rounded-full border px-3 py-1 font-poppins text-[11px] font-medium uppercase tracking-[0.18em] ${
              isLight
                ? "border-[#D9DCF2] bg-white/70 text-[#2C3A87]"
                : "border-white/10 bg-white/5 text-[#DAD7FF]"
            }`}
          >
            {t.text("error404.badge")}
          </span>

          <p className="mt-4 bg-[linear-gradient(90deg,#b514fd_1.42%,#5f75f5_97.8%)] bg-clip-text font-redDisplay text-[64px] font-bold leading-none text-transparent md:text-[88px] xl:text-[104px]">
            404
          </p>

          <h1
            className={`mt-3 font-redDisplay font-bold text-[26px] md:text-[32px] xl:text-[36px] ${
              isLight ? "text-[#14172D]" : "text-[#F6F6F6]"
            }`}
          >
            {t.text("error404.title")}
          </h1>
          <p
            className={`${classes.mutedText} mx-auto mt-3 max-w-[600px] font-poppins font-light text-[14px] md:text-[15px] leading-7`}
          >
            {t.text("error404.description")}
          </p>

          <div className="mt-[28px] flex flex-wrap justify-center gap-3">
            <Link to={L("/")}>
              <button className="custom-btn middle-out flex min-h-[45px] items-center justify-center rounded-[5px] px-[22px] font-poppins text-[14px] font-light text-white">
                {t.text("error404.homeButton")}
              </button>
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={secondaryButtonClass}
            >
              <ArrowLeft className="h-4 w-4" />
              {t.text("error404.backButton")}
            </button>
            <button
              type="button"
              onClick={handleContact}
              className={secondaryButtonClass}
            >
              <Mail className="h-4 w-4" />
              {t.text("error404.emailButton")}
            </button>
          </div>
        </div>

        <div
          className="mt-[40px] grid w-full justify-center gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 400px))",
          }}
        >
          {destinations.map(({ to, Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className={`flex h-full items-start gap-4 rounded-[20px] border p-5 transition duration-300 hover:-translate-y-1 ${classes.card}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b514fd,#5f75f5)]">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0">
                <span
                  className={`${classes.strongText} block font-redDisplay text-[17px] font-bold leading-6`}
                >
                  {title}
                </span>
                <span
                  className={`${classes.mutedText} mt-1 block font-helvetica text-[13px] font-light leading-6`}
                >
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-[32px] flex flex-col items-center gap-3 text-center">
          <p
            className={`${classes.mutedText} font-poppins text-[14px] font-light`}
          >
            {t.text("error404.contactTitle")}
          </p>
          <BookingButton
            className="custom-btn middle-out flex min-h-[45px] items-center justify-center rounded-[5px] px-[22px] font-poppins text-[14px] font-light text-white"
            text={t.text("error404.bookingButton")}
          />
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
