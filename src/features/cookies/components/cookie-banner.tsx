import React, { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { useInRouterContext } from "react-router-dom";

import CompactConsentBar from "@features/cookies/components/compact-consent-bar";
import ConsentPreferencesPanel, {
  ConsentPreferencesActions,
} from "@features/cookies/components/consent-preferences-panel";
import ConsentSummaryPanel, {
  ConsentSummaryActions,
} from "@features/cookies/components/consent-summary-panel";
import { getConsentThemeClasses } from "@features/cookies/lib/consent-theme-classes";
import { useConsentScrollLock } from "@features/cookies/hooks/use-consent-scroll-lock";
import { useConsentPreferences } from "@features/cookies/hooks/use-consent-preferences";

import ModalShell from "@shared/components/modal-shell";
import Tooltip from "@shared/components/tooltip";
import { useLocationPath } from "@shared/hooks/use-location-path";
import { useTranslations } from "@shared/i18n/translator";
import { CONSTRUCTION_CONFIG } from "@shared/config/construction";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";
import { useConsentSuppressed } from "@shared/hooks/use-consent-suppression";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@store/slices/common/cookieUtils";


const ModernCookieBanner = () => {
  const inRouter = useInRouterContext();

  // Rendered above RouterProvider, so the path has to come from the History API.
  const currentPath = useLocationPath("");

  const consent = useConsentPreferences();
  const {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
  } = useInterfaceControls();
  const t = useTranslations(languageReducer);

  const isConstruction = !!CONSTRUCTION_CONFIG?.isUnderConstruction;
  const onPrivacy = currentPath.includes("privacy-policy");
  // The 404 page opts out explicitly: the modal on top of an error page is one
  // dead end stacked on another.
  const onErrorPage = useConsentSuppressed();
  const shouldHide = isConstruction || onPrivacy || onErrorPage;
  const privacyPath = `/${languageReducer}/privacy-policy`;

  const [openedManually, setOpenedManually] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const actuallyVisible = isVisible && (!shouldHide || openedManually);
  const [showCustomize, setShowCustomize] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { hasStoredConsent, acceptAll, rejectAll, saveCurrent } = consent;
  const showCompactBanner = actuallyVisible && isMobile && !showCustomize;

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
        <ModalShell
          titleId="cookie-consent-title"
          title={
            showCustomize
              ? t.text("cookies.detailedPrefs")
              : t.text("cookies.title")
          }
          subtitle={showCustomize ? undefined : t.text("cookies.subtitle")}
          icon={
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-white" />
            </div>
          }
          isClosing={isClosing}
          closeLabel={t.text("cookies.ariaCloseModal")}
          onClose={handleClose}
          footer={
            showCustomize ? (
              <ConsentPreferencesActions
                language={languageReducer}
                themeClasses={themeClasses}
                onSave={handleSavePreferences}
                onBack={() => setShowCustomize(false)}
              />
            ) : (
              <ConsentSummaryActions
                language={languageReducer}
                themeClasses={themeClasses}
                onAcceptAll={handleAcceptAll}
                onRejectAll={handleRejectAll}
                onCustomize={() => setShowCustomize(true)}
              />
            )
          }
        >
          {showCustomize ? (
            <ConsentPreferencesPanel
              language={languageReducer}
              theme={themeReducer}
              themeClasses={themeClasses}
              consent={consent}
            />
          ) : (
            <ConsentSummaryPanel
              language={languageReducer}
              themeClasses={themeClasses}
              privacyPath={privacyPath}
              inRouter={inRouter}
            />
          )}
        </ModalShell>
      )}

      {(showSettingsButton || shouldHide) && (
        <div className="fixed bottom-4 right-4 z-40" style={{ zIndex: 999998 }}>
          <Tooltip label={t.text("cookies.ariaManageCookies")} placement="left">
            <button
              onClick={reopenSettings}
              className={`${themeClasses.bgSecondary} border ${themeClasses.borderSecondary} shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-110`}
              aria-label={t.text("cookies.ariaManageCookies")}
            >
              <Cookie className={`w-5 h-5 ${themeClasses.textSecondary}`} />
            </button>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default ModernCookieBanner;
