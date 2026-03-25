import React from "react";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

const Testimonials = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);

  return (
    <div
      className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto"
    >
      <p
        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
          } w-full text-center mx-auto mb-[0px] lg:mb-[0px] 2xl:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
      >
        {t.text("home.testimonialTitle")}
      </p>
      <p
        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
      >
        {t.text("home.testimonialTitleDescription")}
      </p>
      <div className="mt-[20px] lg:mt-[40px] 2xl:mt-50px] lg:px-[50px] xl:px-[80px] 2xl:px-[120px]">
        {/* No testimonials yet — displays a prompt encouraging users to leave a review. */}
        <p className="text-center font-redDisplay font-light text-[14px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-[#FF4D00]">
          {t.text("home.noTestimonial")}
        </p>
      </div>
      <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
      <div className="px-[20px] mt-[60px] lg:mt-[80px] 2xl:mt-90px] lg:px-[90px] xl:px-[120px] 2xl:px-[160px]">
        <a
          href="https://g.page/r/CXT73TDGfNv8EB0/review"
          target="_blank"
          rel="noopener noreferrer"
        >
        <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">
              {t.text("home.review")}
            </span>
          </button>
        </a>
      </div></div>
    </div>
  );
};

export default Testimonials;
