import React from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { Home, ArrowLeft, Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { PopupButton } from "react-calendly";
import DotAnim from "components/common/DotAnim";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/locales";

const Error404Page: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || 'fr';
  const rootElement = document.getElementById("root");

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // const handleGoHome = () => {
  //   navigate(`/${currentLang}`);
  // };

  // const handleGoBack = () => {
  //   navigate(-1);
  // };

  const handleContact = () => {
    window.location.href = 'mailto:contact@mediasmart.ch';
  };

  const handleITServices = () => {
    navigate(`/${currentLang}/it-services`);
  };

  const handleVideoServices = () => {
    navigate(`/${currentLang}/video-services`);
  };

  return (
    <div className="hero-bg min-h-[80vh] relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Animation Lottie géante - descendue de 50px */}
          <div className="mb-8 mt-[120px]">
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] mx-auto mb-8">
              <DotAnim
                anim="it.services.security"
                style={{ width: "100%", height: "100%" }}
                crisp
                protect
              />
            </div>
          </div>

          {/* Code d'erreur sous l'animation */}
          <div className="mb-12">
            <h1 className={`font-redDisplay font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl ${
              themeReducer === "light" 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" 
                : "text-white"
            } mb-6 leading-none`}>
              404
            </h1>
          </div>

          {/* Titre et description */}
          <div className="mb-12">
            <h2 className={`font-redDisplay font-bold text-3xl sm:text-4xl md:text-5xl ${
              themeReducer === "light" ? "text-gray-800" : "text-white"
            } mb-6`}>
              {dictionary["error404"][languageReducer]["title"]}
            </h2>
            <p className={`font-poppins text-lg sm:text-xl ${
              themeReducer === "light" ? "text-gray-600" : "text-gray-300"
            } max-w-2xl mx-auto leading-relaxed`}>
              {dictionary["error404"][languageReducer]["description"]}
            </p>
          </div>



          {/* Services suggérés */}
          <div className="mb-12">
            <h3 className={`font-redDisplay font-bold text-2xl ${
              themeReducer === "light" ? "text-gray-800" : "text-white"
            } mb-8`}>
              {dictionary["error404"][languageReducer]["servicesTitle"]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Services informatiques */}
              <button 
                onClick={handleITServices}
                className={`${
                  themeReducer === "light" 
                    ? "bg-white/90 border-gray-100" 
                    : "bg-gray-800/90 border-gray-700"
                } backdrop-blur-sm p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6">
                  <DotAnim
                    anim="it.services.website"
                    style={{ width: "100%", height: "100%" }}
                    crisp
                    protect
                  />
                </div>
                <h4 className={`font-redDisplay font-bold text-xl ${
                  themeReducer === "light" ? "text-gray-800" : "text-white"
                } mb-3`}>
                  {dictionary["error404"][languageReducer]["itServicesTitle"]}
                </h4>
                <p className={`font-poppins text-base ${
                  themeReducer === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  {dictionary["error404"][languageReducer]["itServicesDescription"]}
                </p>
              </button>

              {/* Services vidéo */}
              <button 
                onClick={handleVideoServices}
                className={`${
                  themeReducer === "light" 
                    ? "bg-white/90 border-gray-100" 
                    : "bg-gray-800/90 border-gray-700"
                } backdrop-blur-sm p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6">
                  <DotAnim
                    anim="video.production"
                    style={{ width: "100%", height: "100%" }}
                    crisp
                    protect
                  />
                </div>
                <h4 className={`font-redDisplay font-bold text-xl ${
                  themeReducer === "light" ? "text-gray-800" : "text-white"
                } mb-3`}>
                  {dictionary["error404"][languageReducer]["videoServicesTitle"]}
                </h4>
                <p className={`font-poppins text-base ${
                  themeReducer === "light" ? "text-gray-600" : "text-gray-300"
                }`}>
                  {dictionary["error404"][languageReducer]["videoServicesDescription"]}
                </p>
              </button>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">

            <div 
              onClick={handleGoHome}
              className={`${
                themeReducer === "light" 
                  ? "bg-white/90 border-purple-100" 
                  : "bg-gray-800/90 border-gray-700"
              } backdrop-blur-sm p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-redDisplay font-bold text-xl ${
                themeReducer === "light" ? "text-gray-800" : "text-white"
              } mb-3`}>
                {dictionary["error404"][languageReducer]["homeButton"]}
              </h3>
              <p className={`font-poppins text-sm ${
                themeReducer === "light" ? "text-gray-600" : "text-gray-300"
              }`}>
                {dictionary["error404"][languageReducer]["homeDescription"]}
              </p>
            </div>

            <div 
              onClick={handleGoBack}
              className={`${
                themeReducer === "light" 
                  ? "bg-white/90 border-blue-100" 
                  : "bg-gray-800/90 border-gray-700"
              } backdrop-blur-sm p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-redDisplay font-bold text-xl ${
                themeReducer === "light" ? "text-gray-800" : "text-white"
              } mb-3`}>
                {dictionary["error404"][languageReducer]["backButton"]}
              </h3>
              <p className={`font-poppins text-sm ${
                themeReducer === "light" ? "text-gray-600" : "text-gray-300"
              }`}>
                {dictionary["error404"][languageReducer]["backDescription"]}
              </p>
            </div>
          </div> */}

          <div className={`${
            themeReducer === "light" 
              ? "bg-white/80 border-gray-100" 
              : "bg-gray-800/80 border-gray-700"
          } backdrop-blur-sm rounded-2xl p-8 shadow-xl border max-w-2xl mx-auto`}>
            <h3 className={`font-redDisplay font-bold text-2xl ${
              themeReducer === "light" ? "text-gray-800" : "text-white"
            } mb-6`}>
              {dictionary["error404"][languageReducer]["contactTitle"]}
            </h3>
            <p className={`font-poppins ${
              themeReducer === "light" ? "text-gray-600" : "text-gray-300"
            } mb-8`}>
              {dictionary["error404"][languageReducer]["contactDescription"]}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PopupButton
                className="custom-btn rounded-[80px] text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                url="https://calendly.com/mediasmartch/30min"
                rootElement={rootElement as HTMLElement}
                text={dictionary["error404"][languageReducer]["bookingButton"]}
                pageSettings={{
                  backgroundColor: themeReducer === "light" ? "#ffffff" : "#14172d",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: themeReducer === "light" ? "#7c3aed" : "#F6F6F6",
                  textColor: themeReducer === "light" ? "#1f2937" : "#F6F6F6",
                }}
              />
              
              <button 
                onClick={handleContact}
                className={`border-2 ${
                  themeReducer === "light" 
                    ? "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white" 
                    : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                } px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2`}
              >
                <Mail className="w-5 h-5" />
                {dictionary["error404"][languageReducer]["emailButton"]}
              </button>
            </div>
          </div>

          {/* Citation inspirante */}
          <div className="mt-12 text-center">
            <blockquote className={`font-poppins text-lg ${
              themeReducer === "light" ? "text-gray-600" : "text-gray-300"
            } italic mb-4 max-w-2xl mx-auto`}>
              "{dictionary["error404"][languageReducer]["quote"]}"
            </blockquote>
            <p className={`${
              themeReducer === "light" ? "text-purple-600" : "text-purple-400"
            } font-semibold`}>
              {dictionary["error404"][languageReducer]["quoteAuthor"]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;