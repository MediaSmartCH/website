import React from "react";
import { Link } from "react-router-dom";
// import Lottie from "react-lottie";
import DotAnim from "components/common/DotAnim";
// import { useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "services/hooks/hooks";
// import { dictionary } from "services/locales";
import { useTranslations } from "services/locales/safe";

import { useLangLink } from "services/router/langPath"; 

// import heroLight from "assets/images/lotties/homeHeroLight.json";
// import heroDark from "assets/images/lotties/homeHeroDark.json";


const Hero = () => {
  const { L } = useLangLink();

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

  // const heroLottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? heroLight : heroDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet",
  //   },
  // };

  return (
    <div className="hero-bg mt-[73px] md:mt-[130px] lg:mt-[100px]" id="home">
      <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[50px] lg:pt-[75px] xl:pt-[75px] pb-[50px] relative">
        <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
          <p
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px] md:w-[75%] lg:w-[80%] 2xl:w-[70%]`}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          >
            <span className="mr-3 gradient-text">
              {/* {dictionary["home"][languageReducer]["heroTitle"]} */} {t.text("home.heroTitle")}
            </span>
            {/* {dictionary["home"][languageReducer]["heroSubtitle"]} */} {t.text("home.heroSubtitle")}
          </p>
          <p
            className={`${themeReducer === "light" ? "text-[#5E5E5E]" : "text-[#E5E5E5]"
              } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
            data-aos="fade-up"
            data-aos-duration="1100"
            data-aos-easing="ease-in-sine"
          >
            {/* {dictionary["home"][languageReducer]["heroDescription"]} */} {t.text("home.heroDescription")}
          </p>
          <div className="w-full justify-center flex items-center gap-3 md:gap-5 flex-wrap px-[20px]"
            data-aos="fade-up"
            data-aos-duration="1300"
            data-aos-easing="ease-in-sine"
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
                  {/* {dictionary["home"][languageReducer]["itBtn"]} */} {t.text("home.itBtn")}
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
                  {/* {dictionary["home"][languageReducer]["videoBtn"]} */} {t.text("home.videoBtn")}
                </span>
              </button>
            </Link>
          </div>
        </div>
        <div
          className="w-full md:w-[80%] lg:w-[75%] xl:w-[75%] h-full mx-auto mt-[30px] lg:mt-[30px]"
          style={{ zIndex: 50 }}
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-easing="ease-in-sine"
        >
          <div className="w-full h-full mx-auto">
            {/* <Lottie
              options={heroLottie}
            /> */}
            <DotAnim
              anim="home.hero"
              style={{ width: "100%", height: "auto" }}
              crisp
              protect
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
