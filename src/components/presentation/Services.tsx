import React from "react";
import Lottie from 'react-lottie';

// Importation of lottie files
// import aboutUsLight from '../../assets/images/lotties/aboutUsLight.json';
// import aboutUsDark from '../../assets/images/lotties/aboutUsDark.json';
import liveVideoDirectionLight from '../../assets/images/lotties/liveVideoDirectionLight.json';
import liveVideoDirectionDark from '../../assets/images/lotties/liveVideoDirectionDark.json';
import eventRetransmissionLight from '../../assets/images/lotties/eventRetransmissionLight.json';
import eventRetransmissionDark from '../../assets/images/lotties/eventRetransmissionDark.json';
import videoProductionLight from '../../assets/images/lotties/videoEditingLight.json';
import videoProductionDark from '../../assets/images/lotties/videoEditingDark.json';
import equipmentRentalLight from '../../assets/images/lotties/equipmentRentalLight.json';
import equipmentRentalDark from '../../assets/images/lotties/equipmentRentalDark.json';
import photographyLight from '../../assets/images/lotties/photographyLight.json';
import photographyDark from '../../assets/images/lotties/photographyDark.json';

// Hooks
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

// import services1 from "../../assets/images/services1.png";
// import services2 from "../../assets/images/services2.png";
// import services3 from "../../assets/images/services3.png";
// import services4 from "../../assets/images/services4.png";
// import services5 from "../../assets/images/services5.png";
// import services1d from "../../assets/images/service1d.png";
// import services2d from "../../assets/images/service2d.png";
// import services3d from "../../assets/images/service3d.png";
// import services4d from "../../assets/images/service4d.png";
// import services5d from "../../assets/images/service5d.png";

const Services = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const liveVideoDirection = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? liveVideoDirectionLight : liveVideoDirectionDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  const eventRetransmission = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? eventRetransmissionLight : eventRetransmissionDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  const videoProduction = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? videoProductionLight : videoProductionDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  const equipmentRental = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? equipmentRentalLight : equipmentRentalDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  const photography = {
    loop: true,
    autoplay: true,
    animationData: themeReducer === "light" ? photographyLight : photographyDark,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet"
    }
  };

  return (
    <div id="services" className="mt-[50px] lg:mt-[90px] 2xl:mt-[100px]">
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto">
        <div
          className={`${
            themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
          } rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] pt-[37px] lg:pt-[50px] 2xl:pt-[60px] pb-[37px] lg:pb-[60px] 2xl:pb-[80px] `}
          data-aos="zoom-in"
          data-aos-easing="ease-in-sine"
          data-aos-duration="700"
        >
          <p
            className={`${
              themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
            } w-full mx-auto text-center mb-[10px] lg:mb-[26px] 2xl:mb-[36px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[48px]`}
            data-aos="fade-down"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1000"
          >
            <span className="mr-3 gradient-text">
              {dictionary["services"][languageReducer]["mainTitle1"]}
            </span>
            <span className="Capitalize">
              {dictionary["services"][languageReducer]["mainTitle2"]}
            </span>
          </p>
          <div className="flex flex-col gap-y-[35px] lg:gap-y-[60px] 2xl:gap-y-[80px]">
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] px-[20px] lg:px-0">
              <div
                className="w-full lg:w-[50%] flex justify-center items-center"
                data-aos="fade-right"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1000"
              >
                <Lottie
                  options={liveVideoDirection}
                  // height={400}
                  width="80%"
                  // width={400}
                />
                {/* <img
                  src={themeReducer === "light" ? services1 : services1d}
                  alt="live"
                  className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
                /> */}
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#14172D]"
                        : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                    data-aos="fade-down"
                    data-aos-duration="1000"
                  >
                    {dictionary["services"][languageReducer]["title1"]}
                  </p>
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#413C58]"
                        : "text-[#E5E5E5]"
                    } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    {dictionary["services"][languageReducer]["description1"]}
                  </p>
                  <div
                    className="flex justify-center lg:justify-start"
                    data-aos="zoom-in"
                    data-aos-duration="1000"
                  >
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["services"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] px-[20px] lg:px-0">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                  data-aos="zoom-in"
                  data-aos-duration="1000"
                >
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#14172D]"
                        : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["services"][languageReducer]["title2"]}
                  </p>
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#413C58]"
                        : "text-[#E5E5E5]"
                    } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["services"][languageReducer]["description2"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["services"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="w-full lg:w-[50%] flex justify-center items-center"
                data-aos="zoom-out"
                data-aos-duration="1000"
              >
                <Lottie
                  options={eventRetransmission}
                  // height={400}
                  width="80%"
                  // width={400}
                />
                {/* <img
                  src={themeReducer === "light" ? services2 : services2d}
                  alt="event"
                  className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
                /> */}
              </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] px-[20px] lg:px-0">
              <div
                className="w-full lg:w-[50%] flex justify-center items-center"
                data-aos="fade-down"
                data-aos-duration="1000"
              >
                <Lottie
                  options={videoProduction}
                  // height={400}
                  width="80%"
                  // width={400}
                />
                {/* <img
                  src={themeReducer === "light" ? services3 : services3d}
                  alt="video"
                  className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
                /> */}
              </div>
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#14172D]"
                        : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["services"][languageReducer]["title3"]}
                  </p>
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#413C58]"
                        : "text-[#E5E5E5]"
                    } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["services"][languageReducer]["description3"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["services"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] px-[20px] lg:px-0">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                >
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#14172D]"
                        : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["services"][languageReducer]["title4"]}
                  </p>
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#413C58]"
                        : "text-[#E5E5E5]"
                    } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["services"][languageReducer]["description4"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["services"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="w-full lg:w-[50%] flex justify-center items-center"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <Lottie
                  options={equipmentRental}
                  // height={400}
                  width="80%"
                  // width={400}
                />
                {/* <img
                  src={themeReducer === "light" ? services4 : services4d}
                  alt="Equipment"
                  className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
                /> */}
              </div>
            </div>
            <div
              className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] px-[20px] lg:px-0"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="w-full lg:w-[50%] flex justify-center items-center">
                <Lottie
                  options={photography}
                  // height={400}
                  width="80%"
                  // width={400}
                />
                {/* <img
                  src={themeReducer === "light" ? services5 : services5d}
                  alt="photography"
                  className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]"
                /> */}
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#14172D]"
                        : "text-[#F6F6F6]"
                    } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["services"][languageReducer]["title5"]}
                  </p>
                  <p
                    className={`${
                      themeReducer === "light"
                        ? "text-[#413C58]"
                        : "text-[#E5E5E5]"
                    } w-full text-left lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["services"][languageReducer]["description5"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["services"][languageReducer]["contactBtn"]}
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
