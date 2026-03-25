import React, { lazy, Suspense } from "react";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const Services = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div>
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto">
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] pt-[37px] lg:pt-[50px] 2xl:pt-[60px] pb-[37px] lg:pb-[60px] 2xl:pb-[80px]`}
        >
          <h2
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[48px]`}
          >
            <span className="mr-3 gradient-text">
              {t.text("video.videoServicesMainTitle1")}
            </span>
            <span className="Capitalize">
              {t.text("video.videoServicesMainTitle2")}
            </span>
          </h2>
          <div className="mt-[20px] lg:mt-[30px] 2xl:mt-[36px] flex flex-col gap-y-[50px] lg:gap-y-[60px] 2xl:gap-y-[80px] px-[30px] md:px-[50px] xl:px-[100px]">

            {/* Service 1: Live video direction — animation on left, text on right */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  <Suspense
                    fallback={
                      <div className="h-[220px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                      </div>
                    }
                  >
                    <DotAnim
                      anim="video.live"
                      style={{ width: "100%", height: "auto" }}
                      crisp
                      protect
                    />
                  </Suspense>
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <h3
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {t.text("video.videoServicesTitle1")}
                  </h3>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                  >
                    {t.text("video.videoServicesDescription1")}
                  </p>
                  <div
                    className="flex justify-center lg:justify-start"
                  >
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        {t.text("video.videoServicesContactBtn")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service 2: Event retransmission — text on left, animation on right */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                >
                  <h3
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {t.text("video.videoServicesTitle2")}
                  </h3>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {t.text("video.videoServicesDescription2")}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        {t.text("video.videoServicesContactBtn")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-left"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  <Suspense
                    fallback={
                      <div className="h-[220px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                      </div>
                    }
                  >
                    <DotAnim
                      anim="video.retransmission"
                      style={{ width: "100%", height: "auto" }}
                      crisp
                      protect
                    />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Service 3: Video production — animation on left, text on right */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
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
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                >
                  <h3
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {t.text("video.videoServicesTitle3")}
                  </h3>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {t.text("video.videoServicesDescription3")}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        {t.text("video.videoServicesContactBtn")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service 4: Equipment rental — text on left, animation on right */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                >
                  <h3
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {t.text("video.videoServicesTitle4")}
                  </h3>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {t.text("video.videoServicesDescription4")}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        {t.text("video.videoServicesContactBtn")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-left"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  <Suspense
                    fallback={
                      <div className="h-[220px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                      </div>
                    }
                  >
                    <DotAnim
                      anim="video.rental"
                      style={{ width: "100%", height: "auto" }}
                      crisp
                      protect
                    />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Service 5: Photography — animation on left, text on right */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  <Suspense
                    fallback={
                      <div className="h-[220px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                      </div>
                    }
                  >
                    <DotAnim
                      anim="video.photography"
                      style={{ width: "100%", height: "auto" }}
                      crisp
                      protect
                    />
                  </Suspense>
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <h3
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {t.text("video.videoServicesTitle5")}
                  </h3>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {t.text("video.videoServicesDescription5")}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] flex items-center justify-center">
                        {t.text("video.videoServicesContactBtn")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
