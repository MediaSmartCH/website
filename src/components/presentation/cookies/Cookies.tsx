"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CookieConsent: React.FC = () => {

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // Check if user already accepted/rejected cookies
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Texts for both languages
  // const texts = {
  //   en: {
  //     bannerText: "🍪 We use necessary cookies for the proper functioning of the site (forms, booking, security). With your consent, we also use Google Analytics to improve our services.",
  //     acceptAll: "Accept all",
  //     rejectAll: "Reject",
  //     customize: "Customize",
  //     custom: "Confirm my choices",
  //     back: "bBck",
  //     contactFormTitle: "Contact form (necessary)",
  //     contactFormDesc: "Allows you to send requests directly via the website. This data is used only to reply to you.",
  //     calendlyTitle: "Calendly (necessary)",
  //     calendlyDesc: "Online scheduling tool. These cookies are essential for booking appointments.",
  //     recaptchaTitle: "Google reCAPTCHA (necessary)",
  //     recaptchaDesc: "Security service used to protect forms from spam and abuse.",
  //     analyticsTitle: "Google Analytics (optional)",
  //     analyticsDesc: "Audience measurement tool that helps us analyze site usage (pages visited, time spent, source of visits). This data is used for statistical purposes only and anonymized. You can choose to accept or refuse these cookies.",
  //   },
  //   fr: {
  //     bannerText: "🍪 Nous utilisons des cookies nécessaires au bon fonctionnement du site (formulaire, prise de rendez-vous, sécurité). Avec votre accord, nous utilisons également Google Analytics pour améliorer nos services.",
  //     acceptAll: "Accepter tout",
  //     rejectAll: "Refuser",
  //     customize: "Personnaliser",
  //     custom: "Confirmer mes choix",
  //     back: "Retour",
  //     contactFormTitle: "Formulaire de contact (nécessaire)",
  //     contactFormDesc: "Permet d’envoyer vos demandes directement via le site. Ces données sont utilisées uniquement pour vous répondre.",
  //     calendlyTitle: "Calendly (nécessaire)",
  //     calendlyDesc: "Outil de prise de rendez-vous en ligne. Ces cookies sont indispensables au fonctionnement de la planification.",
  //     recaptchaTitle: "Google reCAPTCHA (nécessaire)",
  //     recaptchaDesc: "Service de sécurité utilisé pour protéger les formulaires contre le spam et les abus.",
  //     analyticsTitle: "Google Analytics (optionnel)",
  //     analyticsDesc: "Outil de mesure d’audience qui nous aide à analyser l’utilisation du site (pages consultées, temps passé, provenance). Ces données sont utilisées uniquement à des fins statistiques et anonymisées. Vous pouvez choisir d’accepter ou de refuser ces cookies.",
  //   },
  // };

  // const t = languageReducer === "fr" ? texts.fr : texts.en;

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  // Enable Google Analytics when accepted
  const enableAnalytics = () => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args);
      };

      gtag("js", new Date());
      gtag("config", "G-XXXXXXXXXX"); // 🔹 Replace with your GA Tracking ID
    }
  };

  // Accept All
  const handleAcceptAll = () => {
    Cookies.set("cookie_consent", "all", { expires: 365 });
    setAnalyticsEnabled(true);
    enableAnalytics();
    setIsVisible(false);
  };

  // Reject All
  const handleRejectAll = () => {
    Cookies.set("cookie_consent", "necessary", { expires: 365 });
    setAnalyticsEnabled(false);
    setIsVisible(false);
  };

  // Save customized preferences
  const handleSavePreferences = () => {
    if (analyticsEnabled) {
      Cookies.set("cookie_consent", "custom_analytics_enabled", { expires: 365 });
      enableAnalytics();
    } else {
      Cookies.set("cookie_consent", "custom_analytics_disabled", { expires: 365 });
    }
    setIsVisible(false);
    setShowCustomize(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`${themeReducer === "light" ? "bg-[#FFFFFF]" : "bg-[#2B284C]"} fixed bottom-2 right-2 shadow-lg rounded-2xl p-5 2xl:p-6 max-w-xl w-[95%]`} style={{ zIndex: 999999}}>
      {!showCustomize ? (
        <>
          <p className={`text-sm mb-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>{dictionary["cookies"][languageReducer]["bannerText"]}</p>
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleAcceptAll}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {dictionary["cookies"][languageReducer]["acceptAll"]}
            </button>
            <button
              onClick={handleRejectAll}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              {dictionary["cookies"][languageReducer]["rejectAll"]}
            </button>
            <button
              onClick={() => setShowCustomize(true)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              {dictionary["cookies"][languageReducer]["customize"]}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={`text-[18px] md:text-[20px] font-semibold mb-2 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>{dictionary["cookies"][languageReducer]["contactFormTitle"]}</h2>
          <p className={`mb-4 text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>{dictionary["cookies"][languageReducer]["contactFormDesc"]}</p>

          <h2 className={`text-[18px] md:text-[20px] font-semibold mb-2 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>{dictionary["cookies"][languageReducer]["calendlyTitle"]}</h2>
          <p className={`mb-4 text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>{dictionary["cookies"][languageReducer]["calendlyDesc"]}</p>

          <h2 className={`text-[18px] md:text-[20px] font-semibold mb-2 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>{dictionary["cookies"][languageReducer]["recaptchaTitle"]}</h2>
          <p className={`mb-4 text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>{dictionary["cookies"][languageReducer]["recaptchaDesc"]}</p>

          <div className="flex items-center justify-between my-3 gap-4">
            <div>
              <h2 className={`text-[18px] md:text-[20px] font-semibold mb-2 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>{dictionary["cookies"][languageReducer]["analyticsTitle"]}</h2>
              <p className={`text-sm ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>{dictionary["cookies"][languageReducer]["analyticsDesc"]}</p>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={handleSavePreferences}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {dictionary["cookies"][languageReducer]["confirm"]}
            </button>
            <button
              onClick={() => setShowCustomize(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              {dictionary["cookies"][languageReducer]["back"]}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CookieConsent;
