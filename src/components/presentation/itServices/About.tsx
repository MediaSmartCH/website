import React from "react";
import { lazy, Suspense } from "react";
import RichText from "components/common/RichText";
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
      id="it-services-about"
      className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] pt-[30px] md:pt-[40px] lg:pt-[60px] xl:pt-[80px] 2xl:pt-[90px] pb-[40px] md:pb-[50px] mx-auto"
    >
      {/* Animation is placed first in DOM order (flex-col-reverse flips it visually on mobile) */}
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px]">
        <div className="w-full lg:w-[48%] flex justify-center items-center"
          data-aos="fade-left"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1200">
          <Suspense
            fallback={
              <div className="h-[220px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            }
          >
            <DotAnim
              anim="it.about"
              style={{ width: "100%", height: "auto" }}
              crisp
              protect
            />
          </Suspense>
        </div>
        <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:px-[50px] 2xl:px-[100px]"
          data-aos="fade-left"
          data-aos-duration="1300"
          data-aos-easing="ease-in-sine"
        >
          <RichText
            as="h2"
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full it-service-about-title text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[65px]`}
            html={t.text("it.itServicesAboutTitle")}
          />
          <RichText
            as="div"
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full it-service-about-description text-justify lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
            html={t.text("it.itServicesAboutDescription")}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
