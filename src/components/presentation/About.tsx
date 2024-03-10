import React from "react";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";
import about from "../../assets/images/About.png";
import aboutDark from "../../assets/images/About-dark.png";

const About = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div
      id="about"
      className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] pt-[30px] md:pt-[40px] lg:pt-[60px] xl:pt-[80px] 2xl:pt-[90px] mx-auto"
    >
      <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px]">
        <div className="w-full lg:w-[80%]">
          <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
            <p
              className={`${
                themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold leading-[72px] text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px]`}
              data-aos="fade-down"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1000"
            >
              {dictionary["about"][languageReducer]["title"]}
            </p>
            <p
              className={`${
                themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
              data-aos="fade-up"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1300"
            >
              {dictionary["about"][languageReducer]["description"]}
            </p>
          </div>
        </div>
        <div
          className="w-full lg:w-[50%] flex justify-center items-center"
          data-aos="fade-left"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1300"
        >
          <img
            src={themeReducer === "light" ? about : aboutDark}
            alt="about"
            className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
