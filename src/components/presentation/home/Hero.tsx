import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import { useLangLink } from "services/router/langPath";

const DotAnim = lazy(() => import("components/common/DotAnim"));

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

const Hero = () => {
  const { L } = useLangLink();
  const [useLightweightVisual, setUseLightweightVisual] = React.useState(false);

  // Prefetch route chunks on hover to reduce navigation latency
  const preloadITServices = () => {
    import("../../../pages/ITServices");
  };

  const preloadVideoServices = () => {
    import("../../../pages/VideoServices");
  };

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection;

    const updateVisualMode = () => {
      const slowConnection =
        connection?.saveData === true ||
        ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "");

      setUseLightweightVisual(motionQuery.matches || slowConnection);
    };

    updateVisualMode();

    motionQuery.addEventListener("change", updateVisualMode);
    connection?.addEventListener?.("change", updateVisualMode);

    return () => {
      motionQuery.removeEventListener("change", updateVisualMode);
      connection?.removeEventListener?.("change", updateVisualMode);
    };
  }, []);

  return (
    <div
      className="pt-[73px] md:pt-[130px] lg:pt-[100px]"
      id="home"
    >
      <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[24px] lg:pt-[36px] xl:pt-[40px] pb-[50px] relative">
        <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
          <h1
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px] md:w-[75%] lg:w-[80%] 2xl:w-[70%]`}
          >
            <span className="mr-3 gradient-text">
              {t.text("home.heroTitle")}
            </span>
            {t.text("home.heroSubtitle")}
          </h1>
          <p
            className={`${themeReducer === "light" ? "text-[#5E5E5E]" : "text-[#E5E5E5]"
              } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
          >
            {t.text("home.heroDescription")}
          </p>
          <div className="w-full justify-center flex items-center gap-3 md:gap-5 flex-wrap px-[20px]"
          >
            <Link to={L("/it-services")} onMouseEnter={preloadITServices}>
              <button
                className="
                  hero-btn custom-btn
                  w-[280px] h-[48px]
                  flex items-center justify-center text-center
                  rounded-[5px] text-white font-helvetica font-light
                  text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              >
                <span className="custom-btn-inner">
                  {t.text("home.itBtn")}
                </span>
              </button>
            </Link>
            <Link to={L("/video-services")} onMouseEnter={preloadVideoServices}>
              <button
                className="
                  hero-btn custom-btn
                  w-[280px] h-[48px]
                  flex items-center justify-center text-center
                  rounded-[5px] text-white font-helvetica font-light
                  text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
              >
                <span className="custom-btn-inner">
                  {t.text("home.videoBtn")}
                </span>
              </button>
            </Link>
          </div>
        </div>
        <div
          className="w-full md:w-[80%] lg:w-[75%] xl:w-[75%] h-full mx-auto mt-[30px] lg:mt-[30px]"
          style={{ zIndex: 50 }}
        >
          <div className="w-full h-full mx-auto">
            {useLightweightVisual ? (
              <div
                className={`${themeReducer === "light"
                  ? "border-[#D9DDF5] bg-[radial-gradient(circle_at_top_left,#FFFFFF_0%,#EFF3FF_38%,#DCE6FF_100%)]"
                  : "border-white/10 bg-[radial-gradient(circle_at_top_left,#38426F_0%,#23213F_46%,#121525_100%)]"
                  } relative overflow-hidden rounded-[28px] border shadow-[0_40px_120px_-60px_rgba(20,23,45,0.55)]`}
                style={{ aspectRatio: "16 / 10" }}
              >
                <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#59C3FF]/30 blur-3xl" />
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#7A6BFF]/25 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-[#FF6BAA]/15 blur-3xl" />

                <div className="absolute inset-0 p-5 sm:p-7">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`${themeReducer === "light" ? "bg-white/75 text-[#14172D]" : "bg-white/10 text-white"} rounded-full px-3 py-1.5 font-poppins text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm`}>
                        MediaSmart
                      </div>
                      <div className={`${themeReducer === "light" ? "bg-[#14172D]/8" : "bg-white/10"} rounded-full px-3 py-1.5 font-poppins text-[11px] font-medium uppercase tracking-[0.18em] ${themeReducer === "light" ? "text-[#304C89]" : "text-[#B5C7FF]"}`}>
                        Mobile Light
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className={`${themeReducer === "light" ? "border-white/80 bg-white/80" : "border-white/10 bg-white/10"} rounded-[22px] border p-4 backdrop-blur-sm`}>
                        <div className="mb-6 h-2 w-14 rounded-full bg-[#59C3FF]/70" />
                        <div className="h-16 rounded-[18px] bg-[linear-gradient(135deg,#304C89_0%,#59C3FF_100%)]" />
                      </div>
                      <div className={`${themeReducer === "light" ? "border-white/80 bg-white/70" : "border-white/10 bg-white/5"} mt-6 rounded-[22px] border p-4 backdrop-blur-sm`}>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#7A6BFF]" />
                          <div className="h-2 w-16 rounded-full bg-current opacity-20" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 rounded-full bg-current opacity-15" />
                          <div className="h-2 w-[85%] rounded-full bg-current opacity-15" />
                          <div className="h-2 w-[60%] rounded-full bg-current opacity-15" />
                        </div>
                      </div>
                      <div className={`${themeReducer === "light" ? "border-white/80 bg-white/80" : "border-white/10 bg-white/10"} rounded-[22px] border p-4 backdrop-blur-sm`}>
                        <div className="mb-4 h-2 w-12 rounded-full bg-[#FF6BAA]/70" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-12 rounded-2xl bg-[#14172D]/10" />
                          <div className="h-12 rounded-2xl bg-[#59C3FF]/20" />
                          <div className="col-span-2 h-8 rounded-2xl bg-[#7A6BFF]/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="home.hero"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
