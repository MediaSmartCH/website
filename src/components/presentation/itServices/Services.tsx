import React, { lazy, Suspense } from "react";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import PortfolioGallery from "./PortfolioGallery";

const Services = () => {
  const DotAnim = lazy(() => import('components/common/DotAnim'));
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div id="services">
      <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto">
        <div>
          <p
            className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
              } w-full it-service-title text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
            dangerouslySetInnerHTML={{
              __html: t.text("it.itServicesTitle"),
            }}
          />
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
          >
            {t.text("it.itServicesDescription")}
          </p>
        </div>

        {/* Service 1 — Website creation, includes the portfolio gallery */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] pt-[30px] px-[20px] md:px-[30px] lg:px-0">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {t.text("it.service1")}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
                dangerouslySetInnerHTML={{
                  __html: t.text("it.description1"),
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                <Suspense
                  fallback={
                    <div className="h-[220px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                    </div>
                  }
                >
                  <DotAnim
                    anim="it.services.website"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <PortfolioGallery />
        </div>

        {/* Service 2 — Maintenance */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="it.services.maintenance"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {t.text("it.service2")}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
              dangerouslySetInnerHTML={{
                __html: t.text("it.description2"),
              }}
            />
          </div>
        </div>

        {/* Service 3 — Optimization */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px] px-[20px] md:px-[30px] lg:px-0">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {t.text("it.service3")}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
                dangerouslySetInnerHTML={{
                  __html: t.text("it.description3"),
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                <Suspense
                  fallback={
                    <div className="h-[220px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                    </div>
                  }
                >
                  <DotAnim
                    anim="it.services.optimization"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Service 4 — Security */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="it.services.security"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {t.text("it.service4")}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
              dangerouslySetInnerHTML={{
                __html: t.text("it.description4"),
              }}
            />
          </div>
        </div>

        {/* Service 5 — Backup */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px] px-[20px] md:px-[30px] lg:px-0">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {t.text("it.service5")}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
                dangerouslySetInnerHTML={{
                  __html: t.text("it.description5"),
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                <Suspense
                  fallback={
                    <div className="h-[220px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                    </div>
                  }
                >
                  <DotAnim
                    anim="it.services.backup"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Service 6 — Support */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              <Suspense
                fallback={
                  <div className="h-[220px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                  </div>
                }
              >
                <DotAnim
                  anim="it.services.support"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </Suspense>
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {t.text("it.service6")}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}
                  it-service-description
                  text-justify lg:text-left
                  font-helvetica font-light leading-8
                  text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]
                  mt-6
                `}
              dangerouslySetInnerHTML={{
                __html: t.text("it.description6"),
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Services;
