import React from "react";
// import Lottie from 'react-lottie';
import DotAnim from "components/common/DotAnim";

// Hooks
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

// Importation of lottie files
// import aboutLight from 'assets/images/lotties/aboutLight.json';
// import aboutDark from 'assets/images/lotties/aboutDark.json';

const About = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // const aboutLottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? aboutLight : aboutDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  return (
    <div id="about" className="scroll-mt-[120px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] py-[40px] mx-auto">
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] pt-[35px] lg:pt-[50px] 2xl:pt-[50px] pb-[35px] lg:pb-[50px] 2xl:pb-[50px]`}
        >
          <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-[30px] lg:gap-[50px] pl-[30px] 2xl:pl-[80px] pr-[30px] 2xl:pr-[50px]">
            <div className="w-full lg:w-[50%]">
              <div
                className="w-full md:w-[90%] mx-auto lg:mx-0 lg:w-[85%] 2xl:w-[70%]"
                data-aos="fade-right"
                data-aos-duration="1200"
              >
                <p
                  className={`${themeReducer === "light"
                    ? "text-[#14172D]"
                    : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                >
                  {dictionary["about"][languageReducer]["mainTitle1"]}
                  <span className="gradient-text">
                    {dictionary["about"][languageReducer]["mainTitle2"]}
                  </span>

                </p>
                <div
                  className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"} about-description w-full text-center lg:text-left font-poppins font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                  dangerouslySetInnerHTML={{
                    __html: dictionary["about"][languageReducer]["description"],
                  }}
                />
              </div>
            </div>
            <div
              className="w-full md:w-[60%] lg:w-[50%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-duration="1300"
            >
              <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                {/* <Lottie
                  options={aboutLottie}
                /> */}
                <DotAnim
                  anim="home.about"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
