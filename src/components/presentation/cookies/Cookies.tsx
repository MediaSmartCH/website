"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Cookie,
  Shield,
  BarChart3,
  Target,
  Settings,
  Zap,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { setLanguage } from "store/slices/common/languageSlice";
import { setTheme } from "store/slices/common/themeSlice";
import flag1 from "assets/images/flag1.png";
import flag2 from "assets/images/french.png";
import { useTranslations } from "services/locales/safe";
import { Link, useInRouterContext } from "react-router-dom";
import { CONSTRUCTION_CONFIG } from "config/constructionConfig";

const ModernCookieBanner = () => {
  const inRouter = useInRouterContext();

  // chemin courant
  const initialPath =
    typeof window !== "undefined" && window.location
      ? window.location.pathname
      : "";
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" && window.location ? window.location.pathname : ""
  );

  // écoute des changements d'URL
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

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const dispatch = useAppDispatch();

  const isConstruction = !!CONSTRUCTION_CONFIG?.isUnderConstruction;
  const onPrivacy = currentPath.includes("privacy-policy");
  const shouldHide = isConstruction || onPrivacy;
  const privacyPath = `/${languageReducer}/privacy-policy`;

  // états
  const [openedManually, setOpenedManually] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const actuallyVisible = isVisible && (!shouldHide || openedManually);
  const [showCustomize, setShowCustomize] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  // états cookies
  const [googleAnalytics, setGoogleAnalytics] = useState(false);
  const [calendlyFunctionality, setCalendlyFunctionality] = useState(false);
  const [calendlyPerformance, setCalendlyPerformance] = useState(false);
  const [calendlyAdvertising, setCalendlyAdvertising] = useState(false);
  const [themePreference, setThemePreference] = useState(false);
  const [languagePreference, setLanguagePreference] = useState(false);

  const analyticsEnabled = googleAnalytics;
  const advertisingEnabled = calendlyAdvertising;

  // changement de langue
  const handleLanguageChange = (languageCode: string) => {
    dispatch(setLanguage(languageCode));
    try {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;
      const stripped = currentPath.replace(/^\/(fr|en)/, "");
      const newUrl = `/${languageCode}${stripped}${currentSearch}${currentHash}`;
      window.history.replaceState(null, "", newUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (error) {
      console.warn("Erreur lors du changement de langue:", error);
      dispatch(setLanguage(languageCode));
    }
  };

  // thème
  const handleThemeChange = () => {
    if (isThemeChanging) return;
    setIsThemeChanging(true);
    const newTheme = themeReducer === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    setTimeout(() => setIsThemeChanging(false), 300);
  };

  // toggles cat.
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

  // consentement
  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie_consent");
    if (savedConsent) {
      try {
        const consent = JSON.parse(savedConsent);
        setGoogleAnalytics(consent.googleAnalytics || false);
        setCalendlyFunctionality(consent.calendlyFunctionality || false);
        setCalendlyPerformance(consent.calendlyPerformance || false);
        setCalendlyAdvertising(consent.calendlyAdvertising || false);
        setThemePreference(consent.themePreference || false);
        setLanguagePreference(consent.languagePreference || false);
        setIsVisible(false);
        setShowSettingsButton(true);
      } catch (error) {
        console.error("Erreur lors du chargement des préférences cookies:", error);
        if (shouldHide) {
          setIsVisible(false);
          setShowSettingsButton(true);
        } else {
          setIsVisible(true);
        }
      }
    } else {
      if (shouldHide) {
        setIsVisible(false);
        setShowSettingsButton(true);
      } else {
        setIsVisible(true);
      }
    }
  }, [currentPath, shouldHide]);

  // blocage scroll
  useEffect(() => {
    if (actuallyVisible) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [actuallyVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setOpenedManually(false); // reset
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

  const handleAcceptAll = () => {
    setGoogleAnalytics(true);
    setCalendlyFunctionality(true);
    setCalendlyPerformance(true);
    setCalendlyAdvertising(true);
    setThemePreference(true);
    setLanguagePreference(true);
    localStorage.setItem('cookie_consent', JSON.stringify({
      googleAnalytics: true,
      calendlyFunctionality: true,
      calendlyPerformance: true,
      calendlyAdvertising: true,
      themePreference: true,
      languagePreference: true,
      timestamp: new Date().toISOString()
    }));
    handleClose();
  };

  const handleRejectAll = () => {
    setGoogleAnalytics(false);
    setCalendlyFunctionality(false);
    setCalendlyPerformance(false);
    setCalendlyAdvertising(false);
    setThemePreference(false);
    setLanguagePreference(false);

    localStorage.setItem('cookie_consent', JSON.stringify({
      googleAnalytics: false,
      calendlyFunctionality: false,
      calendlyPerformance: false,
      calendlyAdvertising: false,
      themePreference: false,
      languagePreference: false,
      timestamp: new Date().toISOString()
    }));
    handleClose();
  };


  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      googleAnalytics,
      calendlyFunctionality,
      calendlyPerformance,
      calendlyAdvertising,
      themePreference,
      languagePreference,
      timestamp: new Date().toISOString()
    }));
    handleClose();
  };

  // Gestion des clics sur les toggles de catégorie
  // const handleAnalyticsToggle = () => {
  //   const newState = !analyticsEnabled;
  //   setGoogleAnalytics(newState);
  // };

  const handleFunctionalityToggle = () => {
    const currentState = getFunctionalityToggleState();
    // ta fonction perso qui renvoie 'inactive' | 'partial' | 'active' par ex.

    if (currentState === 'inactive' || currentState === 'partial') {
      // Activer
      setCalendlyFunctionality(true);
      setThemePreference(true);
      setLanguagePreference(true);
    } else {
      // Désactiver
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

  // Composant pour les toggles de catégorie avec états intermédiaires
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

  // Classes CSS dynamiques basées sur le thème
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
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [actuallyVisible]);

  return (
    <>
      {/* Overlay de changement de thème */}
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
              {/* {currentLanguage === 'fr' ? 'Changement de thème' : 'Changing theme'} */}
            </h3>
            <p className={`text-sm ${themeReducer === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
              {/* {currentLanguage === 'fr' ? 'Veuillez patienter...' : 'Please wait...'} */}
            </p>
          </div>
        </div>
      )}

      {/* Modale principale */}
      {actuallyVisible && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <div onClick={handleClose} className={`absolute inset-0 backdrop-blur-sm ${themeReducer === "light" ? "bg-black/20" : "bg-black/40"
            }`} />

          {/* Container avec scroll externe pour cas extrêmes */}
          <div className="h-full overflow-y-auto flex items-start justify-center p-2 py-4">
            <div
              className={`relative ${themeClasses.modal} rounded-3xl shadow-2xl ${themeClasses.border} border w-full max-w-2xl my-auto transform transition-all duration-300 ${isClosing ? 'translate-y-full scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'
                }`}
            >
              {!showCustomize ? (
                <div className="p-6 md:p-8">
                  {/* Header avec contrôles intégrés */}

                  {/* Contrôles thème/langue */}
                  {/* Header principal responsive */}
                  <div className="flex flex-col lg:flex-row flex-wrap lg:items-start lg:justify-between gap-1 sm:gap-2 lg:gap-3 mb-4 px-3 lg:px-6">
                    {/* Bloc titre */}
                    <div className="order-2 lg:order-1 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}>
                          {/* {dictionary["cookies"][languageReducer]["title"]} */} {t.text("cookies.title")}
                          {/* {currentTexts.title} */}
                        </h3>
                        <p className={`text-sm sm:text-base ${themeClasses.textMuted}`}>
                          {/* {dictionary["cookies"][languageReducer]["subtitle"]} */} {t.text("cookies.subtitle")}
                        </p>
                      </div>
                    </div>

                    {/* Bloc contrôles */}
                    <div className="order-1 lg:order-2 flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-3 self-end lg:self-auto">
                      {/* Sélecteur de langue */}
                      <div className="flex items-center gap-2">
                        <Globe className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textSecondary}`} />
                        <button
                          onClick={() =>
                            handleLanguageChange(languageReducer === 'fr' ? 'en' : 'fr')
                          }
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${themeClasses.bg} ${themeClasses.hover} transition-colors`}
                          title={t.text("cookies.ariaToggleLanguage")}
                          aria-label={t.text("cookies.ariaToggleLanguage")}
                        >
                          <img
                            src={languageReducer === 'en' ? flag1 : flag2}
                            alt="flag"
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                          />
                          <span className={`text-xs font-medium ${themeClasses.text} uppercase`}>
                            {languageReducer}
                          </span>
                        </button>
                      </div>

                      {/* Bouton changement de thème */}
                      <button
                        onClick={handleThemeChange}
                        disabled={isThemeChanging}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors ${isThemeChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={t.text("cookies.ariaToggleTheme")}
                        aria-label={t.text("cookies.ariaToggleTheme")}
                      >
                        {themeReducer === 'light' ? (
                          <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        ) : (
                          <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        )}
                      </button>

                      {/* Bouton fermeture */}
                      <button
                        onClick={handleClose}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors`}
                        title={t.text("cookies.ariaCloseModal")}
                        aria-label={t.text("cookies.ariaCloseModal")}
                      >
                        <X className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textSecondary}`} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                      {/* {dictionary["cookies"][languageReducer]["description"]} */} {t.text("cookies.description")}
                    </p>
                    {inRouter ? (
                      <Link to={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                        {/* {dictionary["cookies"][languageReducer]["privacyLinkText"]} */} {t.text("cookies.privacyLinkText")}
                      </Link>
                    ) : (
                      <a href={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                        {/* {dictionary["cookies"][languageReducer]["privacyLinkText"]} */} {t.text("cookies.privacyLinkText")}
                      </a>
                    )}
                  </div>

                  {/* Cookie types preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200">
                      <Shield className="w-3 h-3 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 text-xs">{/* {dictionary["cookies"][languageReducer]["necessary"]} */} {t.text("cookies.necessary")}</p>
                        <p className="text-xs text-green-700">{/* {dictionary["cookies"][languageReducer]["alwaysActive"]} */} {t.text("cookies.alwaysActive")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 border border-purple-200">
                      <Zap className="w-3 h-3 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900 text-xs">{/* {dictionary["cookies"][languageReducer]["functionality"]} */} {t.text("cookies.functionality")}</p>
                        <p className="text-xs text-purple-700">{/* {dictionary["cookies"][languageReducer]["yourChoice"]} */} {t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 border border-blue-200">
                      <BarChart3 className="w-3 h-3 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 text-xs">{/* {dictionary["cookies"][languageReducer]["performance"]} */} {t.text("cookies.performance")}</p>
                        <p className="text-xs text-blue-700">{/* {dictionary["cookies"][languageReducer]["yourChoice"]} */} {t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 border border-orange-200">
                      <Target className="w-3 h-3 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900 text-xs">{/* {dictionary["cookies"][languageReducer]["advertising"]} */} {t.text("cookies.advertising")}</p>
                        <p className="text-xs text-orange-700">{/* {dictionary["cookies"][languageReducer]["yourChoice"]} */} {t.text("cookies.yourChoice")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-3 w-full">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 md:px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {/* {dictionary["cookies"][languageReducer]["acceptAll"]} */} {t.text("cookies.acceptAll")}
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className={`flex-1 px-4 md:px-6 py-3 rounded-xl font-medium transition-colors ${themeClasses.buttonSecondary}`}
                    >
                      {/* {dictionary["cookies"][languageReducer]["refuse"]} */} {t.text("cookies.refuse")}
                    </button>
                    <button
                      onClick={() => setShowCustomize(true)}
                      className={`flex-1 flex items-center justify-center gap-2 ${themeClasses.bgSecondary} border-2 ${themeClasses.borderSecondary} ${themeClasses.text} px-4 md:px-6 py-3 rounded-xl font-medium hover:${themeClasses.border} ${themeClasses.hover} transition-colors`}
                    >
                      <Settings className="w-4 h-4" />
                      {/* {dictionary["cookies"][languageReducer]["customize"]} */} {t.text("cookies.customize")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col max-h-[95vh]">
                  {/* Header fixe responsive */}
                  <div className={`flex-shrink-0 border-b ${themeClasses.border}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6 pb-3">
                      {/* Bloc titre */}
                      <h3
                        className={`order-2 sm:order-1 text-lg sm:text-xl font-bold ${themeClasses.text}`}
                      >
                        {/* {dictionary["cookies"][languageReducer]["detailedPrefs"]} */} {t.text("cookies.detailedPrefs")}
                      </h3>

                      {/* Bloc contrôles */}
                      <div className="order-1 sm:order-2 flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                        {/* Bouton langue */}
                        <button
                          onClick={() => handleLanguageChange(languageReducer === 'fr' ? 'en' : 'fr')}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${themeClasses.bg} ${themeClasses.hover} transition-colors`}
                          title={t.text("cookies.ariaToggleLanguage")}
                          aria-label={t.text("cookies.ariaToggleLanguage")}
                        >
                          <img
                            src={languageReducer === 'en' ? flag1 : flag2}
                            alt="flag"
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                          />
                          <span className={`text-xs font-medium ${themeClasses.text} uppercase`}>
                            {languageReducer}
                          </span>
                        </button>

                        {/* Bouton changement de thème */}
                        <button
                          onClick={handleThemeChange}
                          disabled={isThemeChanging}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors ${isThemeChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
                          // title={dictionary["cookies"][languageReducer]["ariaToggleTheme"]}
                          title={t.text("cookies.ariaToggleTheme")}
                          // aria-label={dictionary["cookies"][languageReducer]["ariaToggleTheme"]}
                          aria-label={t.text("cookies.ariaToggleTheme")}
                        >
                          {themeReducer === 'light' ? (
                            <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          ) : (
                            <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                          )}
                        </button>

                        {/* Bouton fermeture */}
                        <button
                          onClick={handleClose}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${themeClasses.bg} ${themeClasses.hover} flex items-center justify-center transition-colors`}
                          // title={dictionary["cookies"][languageReducer]["ariaCloseModal"]}
                          title={t.text("cookies.ariaCloseModal")}
                          // aria-label={dictionary["cookies"][languageReducer]["ariaCloseModal"]}
                          aria-label={t.text("cookies.ariaCloseModal")}
                        >
                          <X className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.textSecondary}`} />
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* Contenu scrollable */}
                  <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                    <div className="space-y-3">
                      {/* Necessary cookies */}
                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{/* {dictionary["cookies"][languageReducer]["cookiesNecessary"]} */} {t.text("cookies.cookiesNecessary")}</h4>
                          </div>
                          <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-1">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {/* {dictionary["cookies"][languageReducer]["necessaryDesc"]} */} {t.text("cookies.necessaryDesc")}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["contactForm"]} */} {t.text("cookies.contactForm")}</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["contactFormDesc"]} */} {t.text("cookies.contactFormDesc")}</p>
                          </div>
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>Google reCAPTCHA</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["antiSpamDesc"]} */} {t.text("cookies.antiSpamDesc")}</p>
                          </div>
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["calendlyBasic"]} */} {t.text("cookies.calendlyBasic")}</p>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["appointmentBooking"]} */} {t.text("cookies.appointmentBooking")}</p>
                          </div>
                        </div>
                      </div>

                      {/* Functionality cookies */}
                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{/* {dictionary["cookies"][languageReducer]["cookiesFunctionality"]} */} {t.text("cookies.cookiesFunctionality")}</h4>
                          </div>
                          <CategoryToggle
                            state={getFunctionalityToggleState()}
                            onClick={handleFunctionalityToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {/* {dictionary["cookies"][languageReducer]["functionalityDesc"]} */} {t.text("cookies.functionalityDesc")}
                        </p>

                        <div className="space-y-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${calendlyFunctionality ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["calendlyFunctionality"]} */} {t.text("cookies.calendlyFunctionality")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["calendlyFunctionalityDesc"]} */} {t.text("cookies.calendlyFunctionalityDesc")}</p>
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
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["themePreference"]} */} {t.text("cookies.themePreference")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["themePreferenceDesc"]} */} {t.text("cookies.themePreferenceDesc")}</p>
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
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["languagePreference"]} */} {t.text("cookies.languagePreference")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["languagePreferenceDesc"]} */} {t.text("cookies.languagePreferenceDesc")}</p>
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

                      {/* Performance cookies */}
                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{/* {dictionary["cookies"][languageReducer]["cookiesPerformance"]} */} {t.text("cookies.cookiesPerformance")}</h4>
                          </div>
                          <CategoryToggle
                            state={getPerformanceToggleState()}
                            onClick={handlePerformanceToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {/* {dictionary["cookies"][languageReducer]["performanceDesc"]} */} {t.text("cookies.performanceDesc")}
                        </p>

                        <div className="space-y-2">
                          <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${googleAnalytics ? 'bg-blue-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>Google Analytics</p>
                                </div>
                                <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["pagesVisited"]} */} {t.text("cookies.pagesVisited")}</p>
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
                                  <p className={`font-medium text-xs ${themeClasses.text}`}>{/* {dictionary["cookies"][languageReducer]["calendlyPerformance"]} */} {t.text("cookies.calendlyPerformance")}</p>
                                </div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["calendlyPerformanceDesc"]} */} {t.text("cookies.calendlyPerformanceDesc")}</p>
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

                      {/* Advertising cookies */}
                      <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{/* {dictionary["cookies"][languageReducer]["cookiesAdvertising"]} */} {t.text("cookies.cookiesAdvertising")}</h4>
                          </div>
                          <CategoryToggle
                            state={getAdvertisingToggleState()}
                            onClick={handleAdvertisingToggle}
                          />
                        </div>
                        <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                          {/* {dictionary["cookies"][languageReducer]["advertisingDesc"]} */} {t.text("cookies.advertisingDesc")}
                        </p>

                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${calendlyAdvertising ? 'bg-orange-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["calendlyTargeted"]} */} {t.text("cookies.calendlyTargeted")}</p>
                              </div>
                              <p className={`text-xs ${themeClasses.textSecondary}`}>{/* {dictionary["cookies"][languageReducer]["calendlyTargetedDesc"]} */} {t.text("cookies.calendlyTargetedDesc")}</p>
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

                  {/* Actions fixes en bas */}
                  <div className={`flex-shrink-0 p-4 md:p-6 pt-3 border-t ${themeClasses.border}`}>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleSavePreferences}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                      >
                        {/* {dictionary["cookies"][languageReducer]["confirmChoices"]} */} {t.text("cookies.confirmChoices")}
                      </button>
                      <button
                        onClick={() => setShowCustomize(false)}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm ${themeClasses.buttonSecondary}`}
                      >
                        {/* {dictionary["cookies"][languageReducer]["back"]} */} {t.text("cookies.back")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bouton de réouverture discret */}
      {(showSettingsButton || shouldHide) && (
        <div className="fixed bottom-4 right-4 z-40" style={{ zIndex: 999998 }}>
          <button
            onClick={reopenSettings}
            className={`${themeClasses.bgSecondary} border ${themeClasses.borderSecondary} shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-110`}
            // title={dictionary["cookies"][languageReducer]["ariaManageCookies"]}
            title={t.text("cookies.ariaManageCookies")}
            // aria-label={dictionary["cookies"][languageReducer]["ariaManageCookies"]}
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