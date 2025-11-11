import React, { lazy, Suspense } from "react";
// import Lottie from "react-lottie";
// import DotAnim from "components/common/DotAnim";

import { useAppSelector } from "services/hooks/hooks";
// import { dictionary } from "services/locales";
import { useTranslations } from "services/locales/safe";

// Importing Lottie Files
// import aboutUsLight from 'assets/images/lotties/aboutUsLight.json';
// import aboutUsDark from 'assets/images/lotties/aboutUsDark.json';

const About = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  // const aboutUs = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? aboutUsLight : aboutUsDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

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
          {/* <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]"> */}
          <p
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold leading-[72px] text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px]`}
          >
            {/* {dictionary["video"][languageReducer]["videoServicesAbout"]} */} {t.text("video.videoServicesAbout")}
          </p>
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
          >
            {/* {dictionary["video"][languageReducer]["videoServicesAboutDescription"]} */} {t.text("video.videoServicesAboutDescription")}
          </p>
        </div>
        {/* </div> */}
        <div
          className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
          data-aos="fade-left"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1300"
        >

          <div className="w-full lg:w-[100%] 2xl:w-[100%] mx-auto">
            {/* <Lottie
              options={aboutUs}
            /> */}
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
