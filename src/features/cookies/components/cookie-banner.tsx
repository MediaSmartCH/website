import React, { useState, useEffect } from "react";
import {
  X,
  Cookie,
  Shield,
  BarChart3,
  Settings,
  Zap
} from "lucide-react";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@store/slices/common/cookieUtils";
import CategoryToggle from "@features/cookies/components/category-toggle";
import CompactConsentBar from "@features/cookies/components/compact-consent-bar";
import ConsentPreferencesPanel from "@features/cookies/components/consent-preferences-panel";
import ConsentSummaryPanel from "@features/cookies/components/consent-summary-panel";
import ThemeSwitchOverlay from "@features/cookies/components/theme-switch-overlay";
import { getConsentThemeClasses } from "@features/cookies/lib/consent-theme-classes";
import { useConsentScrollLock } from "@features/cookies/hooks/use-consent-scroll-lock";
import { useConsentPreferences } from "@features/cookies/hooks/use-consent-preferences";
import { useLocationPath } from "@shared/hooks/use-location-path";
import { useTranslations } from "@shared/i18n/translator";
import { Link, useInRouterContext } from "react-router-dom";
import { CONSTRUCTION_CONFIG } from "@shared/config/construction";
import LocaleThemeControls from "@shared/components/locale-theme-controls";
import {
  resolveThemePreference,
  ThemePreference,
} from "@store/slices/common/themeUtils";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";

const ModernCookieBanner = () => {
  const inRouter = useInRouterContext();

  // Rendered above RouterProvider, so the path has to come from the History API.
  const currentPath = useLocationPath("");

  const consent = useConsentPreferences();
  const {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference: themeModePreference,
    changeLanguage,
    changeTheme,
    labels,
  } = useInterfaceControls();
  const t = useTranslations(languageReducer);

  const isConstruction = !!CONSTRUCTION_CONFIG?.isUnderConstruction;
  const onPrivacy = currentPath.includes("privacy-policy");
  const shouldHide = isConstruction || onPrivacy;
  const privacyPath = `/${languageReducer}/privacy-policy`;

  const [openedManually, setOpenedManually] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const actuallyVisible = isVisible && (!shouldHide || openedManually);
  const [showCustomize, setShowCustomize] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    googleAnalytics,
    themePreference,
    languagePreference,
    setGoogleAnalytics,
    setThemePreference,
    setLanguagePreference,
    hasStoredConsent,
    functionalityState,
    performanceState,
    toggleFunctionality,
    togglePerformance,
    acceptAll,
    rejectAll,
    saveCurrent,
  } = consent;
  const showCompactBanner = actuallyVisible && isMobile && !showCustomize;

  const handleThemeChange = (nextTheme: ThemePreference) => {
    if (isThemeChanging || nextTheme === themeModePreference) return;

    const nextResolvedTheme = resolveThemePreference(nextTheme);
    const shouldShowLoader = nextResolvedTheme !== themeReducer;

    if (shouldShowLoader) {
      setIsThemeChanging(true);
    }

    changeTheme(nextTheme);

    if (!shouldShowLoader) return;

    setTimeout(() => setIsThemeChanging(false), 300);
  };


  // The hook reads the stored record; this only decides what to show for it.
  useEffect(() => {
    if (hasStoredConsent === null) return;

    if (hasStoredConsent) {
      setIsVisible(false);
      setShowSettingsButton(true);
      return;
    }

    setIsVisible(!shouldHide);
    setShowSettingsButton(shouldHide);
  }, [currentPath, shouldHide, hasStoredConsent]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useConsentScrollLock(actuallyVisible && !showCompactBanner);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setOpenedManually(false);
      setShowSettingsButton(true);
    }, 300);
  };

  const reopenSettings = () => {
    setOpenedManually(true);
    setIsVisible(true);
    setShowCustomize(false);
    setShowSettingsButton(false);
    setIsClosing(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOpenCookieSettings = () => {
      reopenSettings();
    };

    window.addEventListener(
      OPEN_COOKIE_SETTINGS_EVENT,
      handleOpenCookieSettings as EventListener
    );

    return () => {
      window.removeEventListener(
        OPEN_COOKIE_SETTINGS_EVENT,
        handleOpenCookieSettings as EventListener
      );
    };
  }, [currentPath, shouldHide]);

  const handleAcceptAll = () => {
    acceptAll();
    handleClose();
  };

  const handleRejectAll = () => {
    rejectAll();
    handleClose();
  };

  const handleSavePreferences = () => {
    saveCurrent();
    handleClose();
  };



  const themeClasses = getConsentThemeClasses(themeReducer);

  // Both panels render the same header control with the same props.
  const localeControls = {
    language: languageReducer,
    theme: themeReducer,
    themePreference: themeModePreference,
    onLanguageChange: changeLanguage,
    onThemeChange: handleThemeChange,
    labels,
    themeDisabled: isThemeChanging,
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && actuallyVisible) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [actuallyVisible]);

  return (
    <>
      {isThemeChanging && (
        <ThemeSwitchOverlay theme={themeReducer} language={languageReducer} />
      )}

      {showCompactBanner && (
        <CompactConsentBar
          language={languageReducer}
          themeClasses={themeClasses}
          isClosing={isClosing}
          privacyPath={privacyPath}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onClose={handleClose}
          onCustomize={() => setShowCustomize(true)}
        />
      )}

      {actuallyVisible && !showCompactBanner && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          style={{ zIndex: 999999 }}
        >
          <div onClick={handleClose} className={`absolute inset-0 backdrop-blur-sm ${themeReducer === "light" ? "bg-black/20" : "bg-black/40"
            }`} />

          {/* Outer scroll container handles viewport overflow on very small screens */}
          <div className="h-full overflow-y-auto flex items-start justify-center p-2 py-4">
            <div
              className={`relative ${themeClasses.modal} rounded-3xl shadow-2xl ${themeClasses.border} border w-full max-w-2xl my-auto transform transition-all duration-300 ${isClosing ? 'translate-y-full scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'
                }`}
            >
              {!showCustomize ? (
                <ConsentSummaryPanel
                  language={languageReducer}
                  theme={themeReducer}
                  themeClasses={themeClasses}
                  localeControls={localeControls}
                  privacyPath={privacyPath}
                  inRouter={inRouter}
                  onAcceptAll={handleAcceptAll}
                  onRejectAll={handleRejectAll}
                  onClose={handleClose}
                  onCustomize={() => setShowCustomize(true)}
                />
              ) : (
                <ConsentPreferencesPanel
                  language={languageReducer}
                  theme={themeReducer}
                  themeClasses={themeClasses}
                  localeControls={localeControls}
                  consent={consent}
                  onSave={handleSavePreferences}
                  onClose={handleClose}
                  onBack={() => setShowCustomize(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {(showSettingsButton || shouldHide) && (
        <div className="fixed bottom-4 right-4 z-40" style={{ zIndex: 999998 }}>
          <button
            onClick={reopenSettings}
            className={`${themeClasses.bgSecondary} border ${themeClasses.borderSecondary} shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-110`}
            title={t.text("cookies.ariaManageCookies")}
            aria-label={t.text("cookies.ariaManageCookies")}
          >
            <Cookie className={`w-5 h-5 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      )}
    </>
  );
};

export default ModernCookieBanner;
