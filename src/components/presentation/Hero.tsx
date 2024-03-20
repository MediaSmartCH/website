import React from "react";
import Lottie from "react-lottie";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

import headerLight from "../../assets/images/lotties/headerLight.json";
import headerDark from "../../assets/images/lotties/headerDark.json";

// import hero from "../../assets/images/hero.png";
// import heroDark from "../../assets/images/hero-dark.png";

const Hero = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const header = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? headerLight : headerDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  return (
    <div className="hero-bg mt-[73px] md:mt-[130px] lg:mt-[100px]" id="home">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto pt-[50px] lg:pt-[75px] xl:pt-[75px] pb-[43px] relative">
        <div
          className="w-full mx-auto text-center relative"
          style={{ zIndex: 100 }}
        >
          <p
            className={`${
              themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
            } w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
          >
            <span className="mr-3 gradient-text">
              {dictionary["hero"][languageReducer]["title1"]}
            </span>
            {dictionary["hero"][languageReducer]["title2"]}
          </p>
          <p
            className={`${
              themeReducer === "light" ? "text-[#5E5E5E]" : "text-[#E5E5E5]"
            } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-regular text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
          >
            {dictionary["hero"][languageReducer]["description"]}
          </p>
          <div className="px-[20px]">
            <a href="#contact">
              <button className="hero-btn custom-btn w-full md:w-[150px] h-[38px] lg:w-[200px] lg:h-[45px] xl:w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                <span className="custom-btn-inner">
                  {dictionary["hero"][languageReducer]["contactButton"]}
                </span>
              </button>
            </a>
          </div>
        </div>
        <div
          className="w-[95%] md:w-[70%] lg:w-[50%] xl:w-[50%] h-full mx-auto mt-[23px] lg:-mt-[55px]"
          // className=""
          style={{ zIndex: 50 }}
          data-aos="zoom-in"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1000"
        >
          <Lottie
            options={header}
            // height={400}
            // width={400}
            // width="60%"
            // className="w-[95%] md:w-[70%] lg:w-[50%] xl:w-[50%] h-full mx-auto mt-[23px] lg:-mt-[55px]"
          />
          {/* <img
            src={themeReducer === "light" ? hero : heroDark}
            alt="hero"
            className="w-[95%] md:w-[70%] lg:w-[50%] xl:w-[50%] h-full mx-auto mt-[23px] lg:-mt-[55px]"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
