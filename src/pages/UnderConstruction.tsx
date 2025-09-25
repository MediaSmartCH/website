import React, { useState, useEffect, lazy, Suspense } from "react";
import { PopupButton } from "react-calendly";
import { Calendar } from "lucide-react";
// import DotAnim from "components/common/DotAnim";
import emailjs from "@emailjs/browser";

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verifyRecaptchaToken } from 'services/api/recaptcha';

import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";
import { setTheme } from "store/slices/common/themeSlice";

import logo from "assets/images/logo-header.png";
import logoDark from "assets/images/logo-footer.png";
import bookLine from "assets/icons/bookLine.svg";
import contactEmail from "assets/icons/contactEmail.svg";
import arrow from "assets/icons/rightArrow.svg";
import flag1 from "assets/images/flag1.png";
import flag2 from "assets/images/french.png";
import light from "assets/images/light.png";
import dark from "assets/images/dark.png";

import { CONSTRUCTION_CONFIG } from "config/constructionConfig";
import { useTranslations } from "services/locales/safe";


const UnderConstruction: React.FC = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useAppDispatch();

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setRootEl(document.getElementById("root") as HTMLElement | null);
  }, []);

  // États pour la gestion du formulaire
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressPercentage = CONSTRUCTION_CONFIG.progressPercentage;

  const handleLanguageChange = (languageCode: string) => {
    const x = window.scrollX;
    const y = window.scrollY;

    dispatch(setLanguage(languageCode));

    try {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;

      const stripped = currentPath.replace(/^\/(fr|en)/, "");
      const newUrl = `/${languageCode}${stripped}${currentSearch}${currentHash}`;

      window.history.replaceState(null, "", newUrl);

      requestAnimationFrame(() => {
        window.scrollTo(x, y);
        setTimeout(() => window.scrollTo(x, y), 0);
        setTimeout(() => window.scrollTo(x, y), 50);
      });
    } catch (e) {
      console.warn("Lang change URL swap failed:", e);
    }
  };

  const toggleLanguage = () => {
    const next = languageReducer === "fr" ? "en" : "fr";
    handleLanguageChange(next);
  };

  const handleThemeChange = () => {
    const newTheme = themeReducer === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || loading) return;

    if (!email.trim()) {
      setError(t.text("UnderConstruction.errorEmailRequired"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t.text("UnderConstruction.errorEmailInvalid"));
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError("");

    try {
      const isLocalHost =
        ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
        /^192\.168\./.test(window.location.hostname) ||
        window.location.hostname.endsWith(".local");

      if (!isLocalHost) {
        if (!executeRecaptcha) {
          setError(t.text("UnderConstruction.sendErrorGeneric"));
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
        const token = await executeRecaptcha("uc_newsletter");
        const verification = await verifyRecaptchaToken(token);
        if (!verification?.success) {
          setError(t.text("UnderConstruction.sendErrorGeneric"));
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
      } else {
        // console.log("🏠 Localhost : ReCAPTCHA bypassed");
      }

      await emailjs.send(
        "REMOVED_EMAILJS_SERVICE_ID",
        "REMOVED_EMAILJS_TEMPLATE_ID",
        {
          name: "Inscription Newsletter",
          email: email.trim(),
          phone: "",
          message: `Nouvelle inscription newsletter depuis la page en construction.\n\nEmail: ${email.trim()}\nDate: ${new Date().toLocaleString("fr-FR")}\nSource: Page en construction`,
        },
        "REMOVED_EMAILJS_PUBLIC_KEY"
      );

      setDone(true);
      setEmail("");
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      // console.log("FAILED...", err);
      setError(t.text("UnderConstruction.sendErrorGeneric"));
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="under-construction"
      className={`${themeReducer === "light"
        ? "bg-[#F7F7FF]"
        : "bg-[#2B284C]"
        } min-h-screen relative overflow-hidden flex items-center justify-center px-6 sm:px-8 md:px-4 py-8`}
    >
      <div className="hero-bg absolute inset-0 z-0"></div>

      {/* Boutons de contrôle discrets - positionnés différemment sur mobile */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:top-6 sm:translate-x-0 z-20 flex items-center gap-2 sm:gap-4">
        {/* Bouton changement de langue */}
        <button
          onClick={toggleLanguage}
          className={`${themeReducer === "light"
            ? "bg-white/80 hover:bg-white border-gray-200"
            : "bg-[#685A9C]/80 hover:bg-[#685A9C] border-purple-600/30"
            } backdrop-blur-sm flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md`}
          title={t.text("cookies.ariaToggleLanguage")}
          aria-label={t.text("cookies.ariaToggleLanguage")}
        >
          <img
            src={languageReducer === "en" ? flag1 : flag2}
            alt={languageReducer === "en" ? "English" : "Français"}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full"
          />
          <span className={`${themeReducer === "light" ? "text-gray-700" : "text-[#E5E5E5]"
            } font-helvetica font-light text-xs sm:text-sm uppercase`}>
            {languageReducer}
          </span>
        </button>

        {/* Bouton changement de thème */}
        <button
          onClick={handleThemeChange}
          className={`${themeReducer === "light"
            ? "bg-white/80 hover:bg-white border-gray-200"
            : "bg-[#685A9C]/80 hover:bg-[#685A9C] border-purple-600/30"
            } backdrop-blur-sm p-1.5 sm:p-2 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md`}
          title={themeReducer === "light" ? "Mode sombre" : "Mode clair"}
          aria-label={themeReducer === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
        >
          <img
            src={themeReducer === "light" ? light : dark}
            alt={themeReducer === "light" ? "Mode sombre" : "Mode clair"}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
          />
        </button>
      </div>

      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        <div className="mb-12 sm:mb-16 flex flex-col items-center mt-12 sm:mt-0">
          <img
            src={themeReducer === "light" ? logo : logoDark}
            alt="MediaSmart Logo"
            className="w-[300px] sm:w-[350px] md:w-[400px] xl:w-[420px] 2xl:w-[440px] mx-auto mb-8"
          />
          <img
            src={bookLine}
            alt="decorative line"
            className="w-[200px] sm:w-[250px] md:w-auto max-w-[300px]"
          />
        </div>

        {/* Main title */}
        <h2 className={`${themeReducer === "light" ? "text-gray-800" : "text-[#F6F6F6]"
          } font-redDisplay font-bold text-3xl sm:text-4xl md:text-6xl mb-6 sm:mb-8 px-2`}>
          {t.text("UnderConstruction.title")}
        </h2>

        {/* Subtitle */}
        <p className={`${themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]"
          } font-poppins font-normal text-lg sm:text-xl md:text-2xl mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed px-4`}>
          {t.text("UnderConstruction.subtitle")}{" "}
          <span className="font-semibold text-purple-600">
            {t.text("UnderConstruction.connectingWorlds")}
          </span>{" "}
          {t.text("UnderConstruction.tagline")}
        </p>

        {/* Main Lottie animation */}
        <div className="relative mb-16 sm:mb-20">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
            <Suspense
              fallback={
                <div className="h-[220px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                </div>
              }
            >
              <DotAnim
                anim="it.services.maintenance"
                style={{ width: "100%", height: "100%" }}
                crisp
                protect
              />
            </Suspense>
          </div>
        </div>

        {/* Services cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
          <div className={`${themeReducer === "light"
            ? "bg-white/90 border-purple-100"
            : "bg-[#685A9C]/90 border-purple-600/30"
            } backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="it.services.website"
                  style={{ width: "100%", height: "100%" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
            <h3 className={`${themeReducer === "light" ? "text-gray-800" : "text-[#F6F6F6]"
              } font-redDisplay font-bold text-lg sm:text-xl mb-3`}>
              {t.text("UnderConstruction.itSolutionsTitle")}
            </h3>
            <p className={`${themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]"
              } font-poppins font-normal text-sm sm:text-base`}>
              {t.text("UnderConstruction.itSolutionsDescription")}
            </p>
          </div>

          <div className={`${themeReducer === "light"
            ? "bg-white/90 border-blue-100"
            : "bg-[#685A9C]/90 border-blue-600/30"
            } backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="video.production"
                  style={{ width: "100%", height: "100%" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
            <h3 className={`${themeReducer === "light" ? "text-gray-800" : "text-[#F6F6F6]"
              } font-redDisplay font-bold text-lg sm:text-xl mb-3`}>
              {t.text("UnderConstruction.videoServicesTitle")}
            </h3>
            <p className={`${themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]"
              } font-poppins font-normal text-sm sm:text-base`}>
              {t.text("UnderConstruction.videoServicesDescription")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-10 sm:mb-12 px-4">
          <div className="flex items-center justify-between mb-4">
            <span className={`${themeReducer === "light" ? "text-gray-700" : "text-[#E5E5E5]"
              } font-poppins font-medium text-base sm:text-lg`}>
              {t.text("UnderConstruction.progressLabel")}
            </span>
            <span className="font-redDisplay font-bold text-base sm:text-lg text-purple-600">
              {progressPercentage}%
            </span>
          </div>
          <div className={`${themeReducer === "light" ? "bg-gray-200" : "bg-gray-700"
            } w-full rounded-full h-3 sm:h-4 overflow-hidden`}>
            <div
              className="h-3 sm:h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-2000 ease-out"
              style={{
                width: `${progressPercentage}%`,
                animation: "progressBar 3s ease-out",
              }}
            ></div>
          </div>
        </div>

        {/* Subscription form */}
        <div className={`${themeReducer === "light"
          ? "bg-white/90 border-gray-100"
          : "bg-[#685A9C]/90 border-gray-700"
          } backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border mb-10 sm:mb-12 mx-4`}>
          <h3 className={`${themeReducer === "light" ? "text-gray-800" : "text-[#F6F6F6]"
            } font-redDisplay font-bold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center justify-center gap-3`}>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            {t.text("UnderConstruction.stayInformed")}
          </h3>
          <p className={`${themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]"
            } font-poppins font-normal text-base sm:text-lg mb-4 sm:mb-6`}>
            {t.text("UnderConstruction.launchNotice")}
          </p>

          <form noValidate onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] flex-1`}>
                <input
                  placeholder={t.text("UnderConstruction.emailPlaceholder")}
                  className={`custom-contact-input ${themeReducer === "light"
                    ? "text-[#222222] placeholder:text-[#222222]"
                    : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"
                    } w-full`}
                  type="email"
                  name="email"
                  onChange={handleEmailChange}
                  value={email}
                  disabled={loading || isSubmitting}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!error}
                  aria-describedby={error ? "uc-email-error" : undefined}
                />
                <img src={contactEmail} alt="Email" className="ml-2" />
              </div>

              <button
                type="submit"
                disabled={loading || isSubmitting || done}
                className="custom-btn rounded-[80px] text-white px-[50px] lg:px-[54px] py-[11px] lg:py-[16px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {done ? (
                  <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                    {t.text("UnderConstruction.ctaSubscribed")}
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                    {t.text("UnderConstruction.ctaSending")}
                  </span>
                ) : (
                  <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                    {t.text("UnderConstruction.ctaNotify")}
                    <img src={arrow} alt="arrow" className="" />
                  </span>
                )}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p id="uc-email-error" className="text-red-500 font-poppins font-light text-sm text-center" aria-live="polite">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Emergency contact */}
        <div className="text-center px-4">
          <p className={`${themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]"
            } font-poppins font-normal text-base sm:text-lg mb-4`}>
            {t.text("UnderConstruction.needHelp")}
          </p>
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {rootEl && (
              <PopupButton
                rootElement={rootEl}
                className="font-helvetica font-light text-base sm:text-lg text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 underline decoration-purple-600 hover:decoration-purple-700"
                url="https://calendly.com/mediasmartch/30min"
                text={t.text("UnderConstruction.bookAppointment")}
                pageSettings={{
                  backgroundColor: themeReducer === "light" ? "#ffffff" : "#14172d",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: themeReducer === "light" ? "#7c3aed" : "#F6F6F6",
                  textColor: themeReducer === "light" ? "#1f2937" : "#F6F6F6",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* CSS styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 85%; }
          }

          .hero-bg {
            transform: translateY(-68vh);
          }

          @media (max-width: 768px) {
            .hero-bg {
              transform: translateY(-99vh);
            }
          }

          .custom-contact-input {
            background: transparent;
            border: none;
            outline: none;
            width: 100%;
            font-family: inherit;
          }

          .calendly-overlay {
            padding: 15px !important;
          }
          
          .calendly-popup {
            margin: 15px !important;
            border-radius: 12px !important;
            max-width: calc(100vw - 30px) !important;
            max-height: calc(100vh - 30px) !important;
          }
          
          @media (max-width: 768px) {
            .calendly-overlay {
              padding: 10px !important;
            }
            
            .calendly-popup {
              margin: 10px !important;
              max-width: calc(100vw - 20px) !important;
              max-height: calc(100vh - 20px) !important;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default UnderConstruction;