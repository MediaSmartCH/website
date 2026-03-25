import React, { lazy, Suspense } from "react";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const Hero = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div className={`${themeReducer === "light" ? "hero-bg" : "hero-bg-dark"} mt-[73px] md:mt-[130px] lg:mt-[100px]`} id="it-services-home">
      <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[50px] lg:pt-[75px] xl:pt-[75px] pb-[43px] relative">
        <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
          <p
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full lg:w-[70%] 2xl:w-[60%] it-service-hero-gradient mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px] leading-[40px] lg:leading-[50px] xl:leading-[70px]`}
            dangerouslySetInnerHTML={{
              __html: t.text("it.itServicesHeroTitle"),
            }}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          />
          <p
            className={`${themeReducer === "light" ? "text-[#5E5E5E]" : "text-[#E5E5E5]"
              } w-full lg:w-[70%] 2xl:w-[60%] mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px]`}
            data-aos="fade-up"
            data-aos-duration="1100"
            data-aos-easing="ease-in-sine"
          >
            {t.text("it.itServicesHeroDescription")}
          </p>
          <div className="w-full justify-center flex px-[20px]"
            data-aos="fade-up"
            data-aos-duration="1300"
            data-aos-easing="ease-in-sine"
          >
            <a href="#contact">
              <button className="hero-btn custom-btn w-full md:min-w-[150px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2">
                <span className="custom-btn-inner">
                  {t.text("it.itServicesHeroContactBtn")}
                </span>
              </button>
            </a>
          </div>
        </div>
        <div
          className="w-full md:w-[80%] lg:w-[75%] xl:w-[75%] h-full mx-auto mt-[30px] lg:mt-[30px]"
          style={{ zIndex: 50 }}
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-easing="ease-in-sine"
        >
          <Suspense
            fallback={
              <div className="h-[220px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            }
          >
            <DotAnim
              anim="it.hero"
              style={{ width: "100%", height: "auto" }}
              crisp
              protect
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Hero;
