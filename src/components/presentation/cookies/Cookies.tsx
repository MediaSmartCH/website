import React, { useState, useEffect } from "react";
import {
  X,
  Cookie,
  Shield,
  BarChart3,
  Target,
  Settings,
  Zap
} from "lucide-react";
import {
  getSafeConsentData,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveConsentData,
} from "store/slices/common/cookieUtils";
import { useTranslations } from "services/locales/safe";
import { Link, useInRouterContext } from "react-router-dom";
import { CONSTRUCTION_CONFIG } from "config/constructionConfig";
import LocaleThemeControls from "components/common/LocaleThemeControls";
import {
  resolveThemePreference,
  ThemePreference,
} from "store/slices/common/themeUtils";
import { useInterfaceControls } from "services/hooks/useInterfaceControls";

const ModernCookieBanner = () => {
  const inRouter = useInRouterContext();

  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" && window.location ? window.location.pathname : ""
  );

  // Patch history methods to detect SPA navigation without a router context
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setCurrentPath(window.location.pathname);
    const origPush = window.history.pushState.bind(window.history);
    const origReplace = window.history.replaceState.bind(window.history);
    window.history.pushState = ((d, u, url) => {
      origPush(d, u, url as any);
      update();
    }) as History["pushState"];
    window.history.replaceState = ((d, u, url) => {
      origReplace(d, u, url as any);
      update();
    }) as History["replaceState"];
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    update();
    return () => {
      window.history.pushState = origPush as History["pushState"];
      window.history.replaceState = origReplace as History["replaceState"];
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

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

  const [googleAnalytics, setGoogleAnalytics] = useState(false);
  const [calendlyFunctionality, setCalendlyFunctionality] = useState(false);
  const [calendlyPerformance, setCalendlyPerformance] = useState(false);
  const [calendlyAdvertising, setCalendlyAdvertising] = useState(false);
  const [themePreference, setThemePreference] = useState(false);
  const [languagePreference, setLanguagePreference] = useState(false);

  const advertisingEnabled = calendlyAdvertising;
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

  // Returns whether all, some, or none of a category's services are enabled
  const getFunctionalityToggleState = () => {
    const services = [calendlyFunctionality, themePreference, languagePreference];
    const activeCount = services.filter(Boolean).length;
    if (activeCount === 0) return "inactive";
    if (activeCount === services.length) return "active";
    return "partial";
  };
  const getPerformanceToggleState = () => {
    const services = [googleAnalytics, calendlyPerformance];
    const activeCount = services.filter(Boolean).length;
    if (activeCount === 0) return "inactive";
    if (activeCount === services.length) return "active";
    return "partial";
  };
  const getAdvertisingToggleState = () => {
    if (calendlyAdvertising) return "active";
    return "inactive";
  };

  useEffect(() => {
    const consent = getSafeConsentData();

    if (consent) {
      // Apply stored consent values safely; Boolean() guards against undefined entries
      setGoogleAnalytics(Boolean(consent.googleAnalytics));
      setCalendlyFunctionality(Boolean(consent.calendlyFunctionality));
      setCalendlyPerformance(Boolean(consent.calendlyPerformance));
      setCalendlyAdvertising(Boolean(consent.calendlyAdvertising));
      setThemePreference(Boolean(consent.themePreference));
      setLanguagePreference(Boolean(consent.languagePreference));
      setIsVisible(false);
      setShowSettingsButton(true);
    } else {
      if (shouldHide) {
        setIsVisible(false);
        setShowSettingsButton(true);
      } else {
        setIsVisible(true);
      }
    }
  }, [currentPath, shouldHide]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (actuallyVisible && !showCompactBanner) {
      // Some browser extensions hide cookie banners by setting display:none or opacity:0.
      // If that is detected, unblock scroll so the page remains usable.
      const checkVisibility = () => {
        const banner = document.querySelector('[style*="z-index: 999999"]') ||
                       document.querySelector('.fixed.inset-0.z-50');

        if (banner) {
          const computedStyle = window.getComputedStyle(banner as Element);
          const isHiddenByExtension =
            computedStyle.display === 'none' ||
            computedStyle.visibility === 'hidden' ||
            computedStyle.opacity === '0';

          if (isHiddenByExtension) {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            return;
          }
        }

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      };

      checkVisibility();

      // Re-check after a short delay in case the extension acts asynchronously
      const timer = setTimeout(checkVisibility, 100);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [actuallyVisible, showCompactBanner]);

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
    setGoogleAnalytics(true);
    setCalendlyFunctionality(true);
    setCalendlyPerformance(true);
    setCalendlyAdvertising(true);
    setThemePreference(true);
    setLanguagePreference(true);

    saveConsentData({
      googleAnalytics: true,
      calendlyFunctionality: true,
      calendlyPerformance: true,
      calendlyAdvertising: true,
      themePreference: true,
      languagePreference: true
    });

    handleClose();
  };

  const handleRejectAll = () => {
    setGoogleAnalytics(false);
    setCalendlyFunctionality(false);
    setCalendlyPerformance(false);
    setCalendlyAdvertising(false);
    setThemePreference(false);
    setLanguagePreference(false);

    saveConsentData({
      googleAnalytics: false,
      calendlyFunctionality: false,
      calendlyPerformance: false,
      calendlyAdvertising: false,
      themePreference: false,
      languagePreference: false
    });

    handleClose();
  };

  const handleSavePreferences = () => {
    saveConsentData({
      googleAnalytics,
      calendlyFunctionality,
      calendlyPerformance,
      calendlyAdvertising,
      themePreference,
      languagePreference
    });

    handleClose();
  };

  const handleFunctionalityToggle = () => {
    const currentState = getFunctionalityToggleState();

    if (currentState === 'inactive' || currentState === 'partial') {
      setCalendlyFunctionality(true);
      setThemePreference(true);
      setLanguagePreference(true);
    } else {
      setCalendlyFunctionality(false);
      setThemePreference(false);
      setLanguagePreference(false);
    }
  };

  const handlePerformanceToggle = () => {
    const currentState = getPerformanceToggleState();
    if (currentState === 'inactive' || currentState === 'partial') {
      setGoogleAnalytics(true);
      setCalendlyPerformance(true);
    } else {
      setGoogleAnalytics(false);
      setCalendlyPerformance(false);
    }
  };

  const handleAdvertisingToggle = () => {
    const newState = !advertisingEnabled;
    setCalendlyAdvertising(newState);
  };

  // Three-state toggle: active (all on), partial (some on), inactive (all off)
  const CategoryToggle = ({ state, onClick }: { state: 'active' | 'inactive' | 'partial', onClick: () => void }) => {
    const getToggleClasses = () => {
      switch (state) {
        case 'active':
          return 'bg-gradient-to-r from-purple-500 to-pink-500 justify-end pr-1';
        case 'partial':
          return 'bg-gradient-to-r from-purple-300 to-pink-300 justify-center';
        case 'inactive':
        default:
          return `${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} justify-start pl-1`;
      }
    };

    return (
      <button
        onClick={onClick}
        className={`w-10 h-5 rounded-full flex items-center transition-all duration-200 ${getToggleClasses()}`}
      >
        <div className="w-3 h-3 bg-white rounded-full transition-all duration-200" />
      </button>
    );
  };

  const getThemeClasses = () => ({
    modal: themeReducer === "light" ? "bg-white" : "bg-[#2B284C]",
    text: themeReducer === "light" ? "text-gray-900" : "text-[#F6F6F6]",
    textSecondary: themeReducer === "light" ? "text-gray-600" : "text-[#E5E5E5]",
    textMuted: themeReducer === "light" ? "text-gray-500" : "text-[#B8B8B8]",
    border: themeReducer === "light" ? "border-gray-100" : "border-gray-600",
    borderSecondary: themeReducer === "light" ? "border-gray-200" : "border-gray-500",
    bg: themeReducer === "light" ? "bg-gray-50" : "bg-[#1a1a2e]",
    bgSecondary: themeReducer === "light" ? "bg-white" : "bg-[#16213e]",
    hover: themeReducer === "light" ? "hover:bg-gray-200" : "hover:bg-gray-600",
    buttonSecondary: themeReducer === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gray-600 text-gray-200 hover:bg-gray-500"
  });

  const themeClasses = getThemeClasses();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && actuallyVisible) {
        handleRejectAll();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [actuallyVisible]);

  return (
    <>
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

      {showCompactBanner && (
        <div
          className={`fixed inset-x-0 bottom-0 z-50 p-3 transition-all duration-300 ${isClosing ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
            }`}
          style={{ zIndex: 999999 }}
        >
          <div
            className={`mx-auto w-full max-w-md rounded-[26px] border p-4 shadow-[0_30px_80px_-40px_rgba(20,23,45,0.55)] ${themeClasses.modal} ${themeClasses.border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Cookie className="h-5 w-5 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className={`text-base font-bold ${themeClasses.text}`}>
                    {t.text("cookies.title")}
                  </h3>
                  <p className={`mt-1 text-sm leading-5 ${themeClasses.textSecondary}`}>
                    {t.text("cookies.subtitle")}
                  </p>
                  {inRouter ? (
                    <Link
                      to={privacyPath}
                      className="mt-2 inline-block text-xs underline text-purple-600 hover:text-purple-800"
                    >
                      {t.text("cookies.privacyLinkText")}
                    </Link>
                  ) : (
                    <a
                      href={privacyPath}
                      className="mt-2 inline-block text-xs underline text-purple-600 hover:text-purple-800"
                    >
                      {t.text("cookies.privacyLinkText")}
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={handleRejectAll}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${themeClasses.bg} ${themeClasses.hover}`}
                title={t.text("cookies.ariaCloseModal")}
                aria-label={t.text("cookies.ariaCloseModal")}
              >
                <X className={`h-4 w-4 ${themeClasses.textSecondary}`} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                onClick={handleAcceptAll}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700"
              >
                {t.text("cookies.acceptAll")}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRejectAll}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${themeClasses.buttonSecondary}`}
                >
                  {t.text("cookies.refuse")}
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${themeClasses.bgSecondary} ${themeClasses.borderSecondary} ${themeClasses.text}`}
                >
                  <Settings className="h-4 w-4" />
                  {t.text("cookies.customize")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {actuallyVisible && !showCompactBanner && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          style={{ zIndex: 999999 }}
        >
          <div onClick={handleRejectAll} className={`absolute inset-0 backdrop-blur-sm ${themeReducer === "light" ? "bg-black/20" : "bg-black/40"
            }`} />

          {/* Outer scroll container handles viewport overflow on very small screens */}
          <div className="h-full overflow-y-auto flex items-start justify-center p-2 py-4">
            <div
              className={`relative ${themeClasses.modal} rounded-3xl shadow-2xl ${themeClasses.border} border w-full max-w-2xl my-auto transform transition-all duration-300 ${isClosing ? 'translate-y-full scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'
                }`}
            >
              {!showCustomize ? (
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3 px-3 lg:px-6">
                    <div className="flex min-w-[180px] flex-1 items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}>
                          {t.text("cookies.title")}
                        </h3>
                        <p className={`text-sm sm:text-base ${themeClasses.textMuted}`}>
                          {t.text("cookies.subtitle")}
                        </p>
                      </div>
                    </div>

                    <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3 shrink-0">
                      <LocaleThemeControls
                        currentLanguage={languageReducer}
                        currentTheme={themeReducer}
                        themePreference={themeModePreference}
                        onLanguageChange={changeLanguage}
                        onThemeChange={handleThemeChange}
                        size="xs"
                        labels={labels}
                        themeDisabled={isThemeChanging}
                        className="max-w-full flex-wrap justify-end sm:flex-nowrap"
                      />

                      <button
                        onClick={handleRejectAll}
                        className={`h-[26px] w-[26px] sm:h-8 sm:w-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors`}
                        title={t.text("cookies.ariaCloseModal")}
                        aria-label={t.text("cookies.ariaCloseModal")}
                      >
                        <X className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textSecondary}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                      {t.text("cookies.description")}
                    </p>
                    {inRouter ? (
                      <Link to={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                        {t.text("cookies.privacyLinkText")}
                      </Link>
                    ) : (
                      <a href={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                        {t.text("cookies.privacyLinkText")}
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200">
                      <Shield className="w-3 h-3 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 text-xs">{t.text("cookies.necessary")}</p>
                        <p className="text-xs text-green-700">{t.text("cookies.alwaysActive")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <Zap className="w-3 h-3 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900 text-xs">{t.text("cookies.functionality")}</p>
                        <p className="text-xs text-purple-700">{t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 border border-blue-200">
                      <BarChart3 className="w-3 h-3 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 text-xs">{t.text("cookies.performance")}</p>
                        <p className="text-xs text-blue-700">{t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 border border-orange-200">
                      <Target className="w-3 h-3 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900 text-xs">{t.text("cookies.advertising")}</p>
                        <p className="text-xs text-orange-700">{t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-3 w-full">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 md:px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {t.text("cookies.acceptAll")}
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className={`flex-1 px-4 md:px-6 py-3 rounded-xl font-medium transition-colors ${themeClasses.buttonSecondary}`}
                    >
                      {t.text("cookies.refuse")}
                    </button>
                    <button
                      onClick={() => setShowCustomize(true)}
                      className={`flex-1 flex items-center justify-center gap-2 ${themeClasses.bgSecondary} border-2 ${themeClasses.borderSecondary} ${themeClasses.text} px-4 md:px-6 py-3 rounded-xl font-medium hover:${themeClasses.border} ${themeClasses.hover} transition-colors`}
                    >
                      <Settings className="w-4 h-4" />
                      {t.text("cookies.customize")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col max-h-[95vh]">
                  <div className={`flex-shrink-0 border-b ${themeClasses.border}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 p-4 md:p-6 pb-3">
                      <h3
                        className={`min-w-[140px] flex-1 text-lg sm:text-xl font-bold ${themeClasses.text}`}
                      >
                        {t.text("cookies.detailedPrefs")}
                      </h3>

                      <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 sm:flex-nowrap sm:gap-3 shrink-0">
                        <LocaleThemeControls
                          currentLanguage={languageReducer}
                          currentTheme={themeReducer}
                          themePreference={themeModePreference}
                          onLanguageChange={changeLanguage}
                          onThemeChange={handleThemeChange}
                          size="xs"
                          labels={labels}
                          themeDisabled={isThemeChanging}
                          className="max-w-full flex-wrap justify-end sm:flex-nowrap"
                        />

                        <button
                          onClick={handleClose}
                          className={`h-[26px] w-[26px] sm:h-8 sm:w-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors`}
                          title={t.text("cookies.ariaCloseModal")}
                          aria-label={t.text("cookies.ariaCloseModal")}
                        >
                          <X className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textSecondary}`} />
                        </button>

                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                    <div className="space-y-3">
                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesNecessary")}</h4>
                          </div>
                          <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-1">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {t.text("cookies.necessaryDesc")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.contactForm")}</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.contactFormDesc")}</p>
                          </div>
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>Google reCAPTCHA</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.antiSpamDesc")}</p>
                          </div>
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.calendlyBasic")}</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.appointmentBooking")}</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesFunctionality")}</h4>
                          </div>
                          <CategoryToggle
                            state={getFunctionalityToggleState()}
                            onClick={handleFunctionalityToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {t.text("cookies.functionalityDesc")}
                        </p>

                        <div className="space-y-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${calendlyFunctionality ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.calendlyFunctionality")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.calendlyFunctionalityDesc")}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={calendlyFunctionality}
                                  onChange={(e) => setCalendlyFunctionality(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                              </label>
                            </div>
                          </div>

                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${themePreference ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.themePreference")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.themePreferenceDesc")}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={themePreference}
                                  onChange={(e) => setThemePreference(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                              </label>
                            </div>
                          </div>

                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${languagePreference ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.languagePreference")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.languagePreferenceDesc")}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={languagePreference}
                                  onChange={(e) => setLanguagePreference(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesPerformance")}</h4>
                          </div>
                          <CategoryToggle
                            state={getPerformanceToggleState()}
                            onClick={handlePerformanceToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {t.text("cookies.performanceDesc")}
                        </p>

                        <div className="space-y-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${googleAnalytics ? 'bg-blue-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>Google Analytics</p>
                                </div>
                                <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.pagesVisited")}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={googleAnalytics}
                                  onChange={(e) => setGoogleAnalytics(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                              </label>
                            </div>
                          </div>

                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${calendlyPerformance ? 'bg-blue-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.calendlyPerformance")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.calendlyPerformanceDesc")}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={calendlyPerformance}
                                  onChange={(e) => setCalendlyPerformance(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesAdvertising")}</h4>
                          </div>
                          <CategoryToggle
                            state={getAdvertisingToggleState()}
                            onClick={handleAdvertisingToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {t.text("cookies.advertisingDesc")}
                        </p>

                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${calendlyAdvertising ? 'bg-orange-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.calendlyTargeted")}</p>
                              </div>
                              <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.calendlyTargetedDesc")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={calendlyAdvertising}
                                onChange={(e) => setCalendlyAdvertising(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`flex-shrink-0 p-4 md:p-6 pt-3 border-t ${themeClasses.border}`}>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleSavePreferences}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                      >
                        {t.text("cookies.confirmChoices")}
                      </button>
                      <button
                        onClick={() => setShowCustomize(false)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm ${themeClasses.buttonSecondary}`}
                      >
                        {t.text("cookies.back")}
                      </button>
                    </div>
                  </div>
                </div>
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
