import React from "react";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";
import TestimonialSlider from "components/common/carousel/TestimonialCarousel";

const Testimonials = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div
      id="testimonials"
      className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto"
    >
      <p
        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
          } w-full text-center mx-auto mb-[10px] lg:mb-[15px] 2xl:mb-[17px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[42px] mt-[70px] lg:mt-[100px] 2xl:mt-[115px]`}
      >
        {dictionary["testimonial"][languageReducer]["title"]}
      </p>
      <p
        className={`${themeReducer === "light" ? "text-[#81879D]" : "text-[#E5E5E5]"
          } w-full mx-auto text-center font-poppins font-light text-[14px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
      >
        {dictionary["testimonial"][languageReducer]["description"]}
      </p>
      <div className="mt-[20px] lg:mt-[40px] 2xl:mt-50px] lg:px-[50px] xl:px-[80px] 2xl:px-[120px]">
        <TestimonialSlider
          dictionary={dictionary}
          languageReducer={languageReducer}
        />
      </div>
      <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
      <div className="px-[20px] mt-[60px] lg:mt-[80px] 2xl:mt-90px] lg:px-[90px] xl:px-[120px] 2xl:px-[160px]">
        <a href="https://g.page/r/CXT73TDGfNv8EB0/review" target="_blank">
          <button className="hero-btn custom-btn w-full md:w-[150px] h-[38px] lg:w-[200px] lg:h-[45px] xl:w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
            <span className="custom-btn-inner">
              {dictionary["testimonial"][languageReducer]["review"]}
            </span>
          </button>
        </a>
      </div></div>
    </div>
  );
};

export default Testimonials;
