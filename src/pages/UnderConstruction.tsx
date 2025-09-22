import React, { useState } from "react";
import { PopupButton } from "react-calendly";
// import { useAppSelector } from "services/hooks/hooks";
import { Calendar } from "lucide-react";
import DotAnim from "components/common/DotAnim";
import emailjs from "@emailjs/browser";

import logo from "assets/images/logo-header.png";
import bookLine from "assets/icons/bookLine.svg";
import contactEmail from "assets/icons/contactEmail.svg";
import arrow from "assets/icons/rightArrow.svg";

import { CONSTRUCTION_CONFIG } from 'config/constructionConfig';

const UnderConstruction: React.FC = () => {
  const rootElement = document.getElementById("root");
  // const themeReducer = "light";

  // États pour la gestion du formulaire
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prévention double soumission

  // Utiliser la valeur de configuration
  const progressPercentage = CONSTRUCTION_CONFIG.progressPercentage;

  // ... reste du code ...

  // Gestion du changement d'email avec validation simple
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  // Gestion de la soumission avec protection contre les doubles envois
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Empêcher les soumissions multiples
    if (isSubmitting || loading) {
      return;
    }

    if (!email.trim()) {
      setError("Veuillez saisir une adresse email");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError("");

    try {
      // Préparer les données pour EmailJS
      const templateParams = {
        name: 'Inscription Newsletter',
        email: email.trim(),
        phone: '',
        message: `Nouvelle inscription newsletter depuis la page en construction.\n\nEmail: ${email.trim()}\nDate: ${new Date().toLocaleString('fr-FR')}\nSource: Page en construction`
      };

      // Utiliser le même template que votre formulaire de contact
      await emailjs.send("REMOVED_EMAILJS_SERVICE_ID", "REMOVED_EMAILJS_TEMPLATE_ID", templateParams, "REMOVED_EMAILJS_PUBLIC_KEY");

      setDone(true);
      setEmail("");

      // Reset après 3 secondes
      setTimeout(() => {
        setDone(false);
      }, 3000);

    } catch (error) {
      console.log("FAILED...", error);
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden flex items-center justify-center px-6 sm:px-8 md:px-4 py-8">
      <div className="hero-bg absolute inset-0 z-0"></div>

      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        {/* Logo avec plus d'espacement */}
        <div className="mb-12 sm:mb-16 flex flex-col items-center">
          <img
            src={logo}
            alt="MediaSmart Logo"
            className="w-[300px] sm:w-[350px] md:w-[400px] xl:w-[420px] 2xl:w-[440px] mx-auto mb-8"
          />
          <img
            src={bookLine}
            alt="decorative line"
            className="w-[200px] sm:w-[250px] md:w-auto max-w-[300px]"
          />
        </div>

        {/* Titre principal */}
        <h2 className="font-redDisplay font-bold text-3xl sm:text-4xl md:text-6xl text-gray-800 mb-6 sm:mb-8 px-2">
          Site en construction
        </h2>

        {/* Sous-titre */}
        <p className="font-poppins font-normal text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
          Nous préparons une expérience exceptionnelle qui révolutionnera la façon dont{" "}
          <span className="font-semibold text-purple-600">
            deux mondes se rencontrent
          </span>{" "}
          : solutions informatiques et production vidéo.
        </p>

        {/* Animation Lottie principale */}
        <div className="relative mb-16 sm:mb-20">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto">
            <DotAnim
              anim="it.services.maintenance"
              style={{ width: "100%", height: "100%" }}
              crisp
              protect
            />
          </div>
        </div>

        {/* Cartes de services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-3xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
              <DotAnim
                anim="it.services.website"
                style={{ width: "100%", height: "100%" }}
                crisp
                protect
              />
            </div>
            <h3 className="font-redDisplay font-bold text-lg sm:text-xl text-gray-800 mb-3">Solutions informatiques</h3>
            <p className="font-poppins font-normal text-sm sm:text-base text-gray-600">Expertise technique et flexibilité pour tous vos projets</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
              <DotAnim
                anim="video.production"
                style={{ width: "100%", height: "100%" }}
                crisp
                protect
              />
            </div>
            <h3 className="font-redDisplay font-bold text-lg sm:text-xl text-gray-800 mb-3">Services vidéo</h3>
            <p className="font-poppins font-normal text-sm sm:text-base text-gray-600">Production vidéo professionnelle de haute qualité</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-10 sm:mb-12 px-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-poppins font-medium text-base sm:text-lg text-gray-700">Progression</span>
            <span className="font-redDisplay font-bold text-base sm:text-lg text-purple-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="h-3 sm:h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-2000 ease-out"
              style={{
                width: `${progressPercentage}%`,
                animation: 'progressBar 3s ease-out'
              }}
            ></div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-10 sm:mb-12 mx-4">
          <h3 className="font-redDisplay font-bold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6 flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Restez informé
          </h3>
          <p className="font-poppins font-normal text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Lancement prévu pour bientôt. Inscrivez-vous pour être notifié !
          </p>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="bg-white relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] flex-1">
                <input
                  placeholder="Votre email"
                  className="custom-contact-input text-[#222222] placeholder:text-[#222222] w-full"
                  type="email"
                  name="email"
                  onChange={handleEmailChange}
                  value={email}
                  disabled={loading || isSubmitting}
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
                    Inscrit !
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                    Notifier
                    <img src={arrow} alt="arrow" className="" />
                  </span>
                )}
              </button>
            </div>

            {/* Message d'erreur */}
            {error && (
              <p className="text-red-500 font-poppins font-light text-sm text-center">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Contact d'urgence */}
        <div className="text-center px-4">
          <p className="font-poppins font-normal text-base sm:text-lg text-gray-600 mb-4">
            Besoin d'aide immédiate ?
          </p>
          <div className="inline-flex items-center gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <PopupButton
              className="font-helvetica font-light text-base sm:text-lg text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 underline decoration-purple-600 hover:decoration-purple-700"
              url="https://calendly.com/mediasmartch/30min"
              rootElement={rootElement as HTMLElement}
              text="Prendre rendez-vous"
              pageSettings={{
                backgroundColor: "#ffffff",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: "#7c3aed",
                textColor: "#1f2937",
              }}
            />
          </div>
        </div>
      </div>

      {/* Styles CSS */}
      <style dangerouslySetInnerHTML={{
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
        `
      }} />
    </div>
  );
};

export default UnderConstruction;