import React from "react";
import { useAppSelector } from "services/hooks/hooks";

const TestimonialCard = ({ id, src, rating, name, company, message }: any) => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div
      className={`${id === 1 ? "testimonial1-bg" : "testimonial2-bg"} ${
        themeReducer === "light" ? "bg-[#fff]" : "bg-[#2B284C]"
      } w-full mx-auto px-[15px] py-[15px] xl:px-[30px] lg:py-[30px] rounded-[10px] testimonail-card-vh`}
    >
      <div className="flex justify-between items-start gap-x-[10px]">
        <div
          className="flex items-center gap-x-[8px] lg:gap-x-[14px]"
          data-aos="fade-right"
          data-aos-duration="2000"
        >
          <img
            src={src}
            alt="logo"
            className="w-[45px] h-[47px] xl:w-[54px] xl:h-[56px]"
          />
          <div>
            <p
              className={`${
                themeReducer === "light" ? "text-[#000]" : "text-[#fff]"
              } font-mulish font-semibold text-[14px] lg:text-[15px] 2xl:text-[16px] mb-[4px] lg:mb-[6px] `}
            >
              {name}
            </p>
            <p
              className={`${
                themeReducer === "light" ? "text-[#9D9296]" : "text-[#9D9296]"
              } font-mulish font-medium text-[14px] lg:text-[14px] 2xl:text-[14px] `}
            >
              {company}
            </p>
          </div>
        </div>
        <div data-aos="fade-left" data-aos-duration="2000">
          <img
            src={rating}
            alt="rating"
            className="h-[13px] lg:h-[17px] w-auto"
          />
        </div>
      </div>
      <p
        className={`${
          themeReducer === "light" ? "text-[#1E1E1E]" : "text-[#E5E5E5]"
        } mt-[12px] lg:mt-[30px] font-mulish font-light  text-[14px] lg:text-[15px] 2xl:text-[16px] leading-[22px] `}
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        {message}
      </p>
    </div>
  );
};

export default TestimonialCard;
