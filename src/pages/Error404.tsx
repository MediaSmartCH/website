import React, { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail } from "lucide-react";
import BookingButton from "components/booking/BookingButton";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const Error404Page: React.FC = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || 'fr';

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

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
    <div className={`${themeReducer === "light" ? "hero-bg" : "hero-bg-dark"} relative overflow-hidden min-h-[80vh]`}>
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">

          <div className="mb-8 mt-[120px]">
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] mx-auto mb-8">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="it.services.security"
                  style={{ width: "100%", height: "100%" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
          </div>

          <div className="mb-12">
            <h1 className={`font-redDisplay font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl ${themeReducer === "light"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              : "text-white"
              } mb-6 leading-none`}>
              404
            </h1>
          </div>

          <div className="mb-12">
            <h2 className={`font-redDisplay font-bold text-3xl sm:text-4xl md:text-5xl ${themeReducer === "light" ? "text-gray-800" : "text-white"
              } mb-6`}>
              {t.text("error404.title")}
            </h2>
            <p className={`font-poppins text-lg sm:text-xl ${themeReducer === "light" ? "text-gray-600" : "text-gray-300"
              } max-w-2xl mx-auto leading-relaxed`}>
              {t.text("error404.description")}
            </p>
          </div>

          <div className="mb-12">
            <h3 className={`font-redDisplay font-bold text-2xl ${themeReducer === "light" ? "text-gray-800" : "text-white"
              } mb-8`}>
              {t.text("error404.servicesTitle")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">

              <button
                onClick={handleITServices}
                className={`${themeReducer === "light"
                  ? "bg-white/90 border-gray-100"
                  : "bg-gray-800/90 border-gray-700"
                  } backdrop-blur-sm p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6">
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
                <h4 className={`font-redDisplay font-bold text-xl ${themeReducer === "light" ? "text-gray-800" : "text-white"
                  } mb-3`}>
                  {t.text("error404.itServicesTitle")}
                </h4>
                <p className={`font-poppins text-base ${themeReducer === "light" ? "text-gray-600" : "text-gray-300"
                  }`}>
                  {t.text("error404.itServicesDescription")}
                </p>
              </button>

              <button
                onClick={handleVideoServices}
                className={`${themeReducer === "light"
                  ? "bg-white/90 border-gray-100"
                  : "bg-gray-800/90 border-gray-700"
                  } backdrop-blur-sm p-8 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6">
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
                <h4 className={`font-redDisplay font-bold text-xl ${themeReducer === "light" ? "text-gray-800" : "text-white"
                  } mb-3`}>
                  {t.text("error404.videoServicesTitle")}
                </h4>
                <p className={`font-poppins text-base ${themeReducer === "light" ? "text-gray-600" : "text-gray-300"
                  }`}>
                  {t.text("error404.videoServicesDescription")}
                </p>
              </button>
            </div>
          </div>

          <div className={`${themeReducer === "light"
            ? "bg-white/80 border-gray-100"
            : "bg-gray-800/80 border-gray-700"
            } backdrop-blur-sm rounded-2xl p-8 shadow-xl border max-w-2xl mx-auto`}>
            <h3 className={`font-redDisplay font-bold text-2xl ${themeReducer === "light" ? "text-gray-800" : "text-white"
              } mb-6`}>
              {t.text("error404.contactTitle")}
            </h3>
            <p className={`font-poppins ${themeReducer === "light" ? "text-gray-600" : "text-gray-300"
              } mb-8`}>
              {t.text("error404.contactDescription")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <BookingButton
                className="custom-btn rounded-[80px] text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                text={t.text("error404.bookingButton")}
              />

              <button
                onClick={handleContact}
                className={`border-2 ${themeReducer === "light"
                  ? "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                  } px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2`}
              >
                <Mail className="w-5 h-5" />
                {t.text("error404.emailButton")}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <blockquote className={`font-poppins text-lg ${themeReducer === "light" ? "text-gray-600" : "text-gray-300"
              } italic mb-4 max-w-2xl mx-auto`}>
              "{t.text("error404.quote")}"
            </blockquote>
            <p className={`${themeReducer === "light" ? "text-purple-600" : "text-purple-400"
              } font-semibold`}>
              {t.text("error404.quoteAuthor")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
