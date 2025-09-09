import React from "react";
// import Lottie from 'react-lottie';
import DotAnim from "components/common/DotAnim";

// Hooks
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

// Importation of lottie files
// import liveVideoDirectionLight from 'assets/images/lotties/liveVideoDirectionLight.json';
// import liveVideoDirectionDark from 'assets/images/lotties/liveVideoDirectionDark.json';
// import eventRetransmissionLight from 'assets/images/lotties/eventRetransmissionLight.json';
// import eventRetransmissionDark from 'assets/images/lotties/eventRetransmissionDark.json';
// import videoProductionLight from 'assets/images/lotties/videoEditingLight.json';
// import videoProductionDark from 'assets/images/lotties/videoEditingDark.json';
// import equipmentRentalLight from 'assets/images/lotties/equipmentRentalLight.json';
// import equipmentRentalDark from 'assets/images/lotties/equipmentRentalDark.json';
// import photographyLight from 'assets/images/lotties/photographyLight.json';
// import photographyDark from 'assets/images/lotties/photographyDark.json';

const Services = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // const liveVideoDirection = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? liveVideoDirectionLight : liveVideoDirectionDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const eventRetransmission = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? eventRetransmissionLight : eventRetransmissionDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const videoProduction = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? videoProductionLight : videoProductionDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const equipmentRental = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? equipmentRentalLight : equipmentRentalDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const photography = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? photographyLight : photographyDark,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  return (
    <div>
      <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto">
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] pt-[37px] lg:pt-[50px] 2xl:pt-[60px] pb-[37px] lg:pb-[60px] 2xl:pb-[80px]`}
        >
          <p
            className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[48px]`}
          >
            <span className="mr-3 gradient-text">
              {dictionary["videoServices"][languageReducer]["mainTitle1"]}
            </span>
            <span className="Capitalize">
              {dictionary["videoServices"][languageReducer]["mainTitle2"]}
            </span>
          </p>
          <div className="mt-[20px] lg:mt-[30px] 2xl:mt-[36px] flex flex-col gap-y-[50px] lg:gap-y-[60px] 2xl:gap-y-[80px] px-[30px] md:px-[50px] xl:px-[100px]">

            {/* services */}
            {/* 1 */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  {/* <Lottie
                    options={liveVideoDirection}
                  /> */}
                  <DotAnim
                    anim="video.live"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["videoServices"][languageReducer]["title1"]}
                  </p>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                  >
                    {dictionary["videoServices"][languageReducer]["description1"]}
                  </p>
                  <div
                    className="flex justify-center lg:justify-start"
                  >
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["videoServices"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* 2 */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto  md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                // data-aos="zoom-in"
                // data-aos-duration="1000"
                >
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["videoServices"][languageReducer]["title2"]}
                  </p>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["videoServices"][languageReducer]["description2"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["videoServices"][languageReducer]["contactBtn"]}
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
                  {/* <Lottie
                    options={eventRetransmission}
                  /> */}
                  <DotAnim
                    anim="video.retransmission"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </div>
              </div>
            </div>
            {/* 3 */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  {/* <Lottie
                    options={videoProduction}
                  /> */}
                  <DotAnim
                    anim="video.production"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                >
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["videoServices"][languageReducer]["title3"]}
                  </p>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["videoServices"][languageReducer]["description3"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["videoServices"][languageReducer]["contactBtn"]}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* 4 */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div className="w-full lg:w-[50%]">
                <div
                  className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]"
                >
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["videoServices"][languageReducer]["title4"]}
                  </p>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["videoServices"][languageReducer]["description4"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["videoServices"][languageReducer]["contactBtn"]}
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
                  {/* <Lottie
                    options={equipmentRental}
                    width="80%"
                  /> */}
                  <DotAnim
                    anim="video.rental"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </div>
              </div>
            </div>
            {/* 5 */}
            <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[30px] lg:gap-y-[50px] gap-x-[50px]">
              <div
                className="w-[100%] md:w-[60%] lg:w-[50%] xl:w-[50%]"
                data-aos="fade-right"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <div className="w-full lg:w-[90%] 2xl:w-[85%] mx-auto">
                  {/* <Lottie
                    options={photography}
                    width="80%"
                  /> */}
                  <DotAnim
                    anim="video.photography"
                    style={{ width: "100%", height: "auto" }}
                    crisp
                    protect
                  />
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <div className="mx-auto md:w-[90%] lg:w-[85%] 2xl:w-[65%]">
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#F6F6F6]"
                      } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[28px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] mb-[0px] lg:mb-[6px] leading-[35px] md:leading-[1.1] lg:leading-[1.2] xl:leading-[1.3]`}
                  >
                    {dictionary["videoServices"][languageReducer]["title5"]}
                  </p>
                  <p
                    className={`${themeReducer === "light"
                      ? "text-[#413C58]"
                      : "text-[#E5E5E5]"
                      } w-full text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto `}
                  >
                    {dictionary["videoServices"][languageReducer]["description5"]}
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <a href="#contact">
                      <button className="custom-btn2 middle-out w-[200px] h-[37px] lg:w-auto mt-[11px] lg:mt-[20px] hero-contact-btn px-[15px] py-[8px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]">
                        {dictionary["videoServices"][languageReducer]["contactBtn"]}
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
