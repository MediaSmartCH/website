import React, { lazy, Suspense } from "react";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const About = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div
      id="video-services-about"
      className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] pt-[30px] md:pt-[40px] lg:pt-[60px] xl:pt-[80px] 2xl:pt-[90px] pb-[40px] md:pb-[50px] mx-auto"
    >
      <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px]">
        <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:px-[50px] 2xl:px-[100px]"
          data-aos="fade-right"
          data-aos-duration="1200"
          data-aos-easing="ease-in-sine"
        >
          <h2
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold leading-[72px] text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px]`}
          >
            {t.text("video.videoServicesAbout")}
          </h2>
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
          >
            {t.text("video.videoServicesAboutDescription")}
          </p>
        </div>
        <div
          className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
          data-aos="fade-left"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1300"
        >
          <div className="w-full lg:w-[100%] 2xl:w-[100%] mx-auto">
            {/* DotAnim is lazy-loaded; the spinner shows while the bundle chunk loads */}
            <Suspense
              fallback={
                <div className="h-[220px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                </div>
              }
            >
              <DotAnim
                anim="video.production"
                style={{ width: "100%", height: "auto" }}
                crisp
                protect
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
