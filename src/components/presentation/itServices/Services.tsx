import React, { useState } from "react";
// import Lottie from 'react-lottie';
import DotAnim from "components/common/DotAnim";

// Hooks
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";

// Importation of lottie files
// import services1 from 'assets/images/lotties/itWebsiteLight.json';
// import services1d from 'assets/images/lotties/itWebsiteDark.json';
// import services2 from 'assets/images/lotties/itMaintenanceLight.json';
// import services2d from 'assets/images/lotties/itMaintenanceDark.json';
// import services3 from 'assets/images/lotties/itOptimizationLight.json';
// import services3d from 'assets/images/lotties/itOptimizationDark.json';
// import services4 from 'assets/images/lotties/itSecurityLight.json';
// import services4d from 'assets/images/lotties/itSecurityDark.json';
// import services5 from 'assets/images/lotties/itBackupLight.json';
// import services5d from 'assets/images/lotties/itBackupDark.json';
// import services6 from 'assets/images/lotties/itSupportLight.json';
// import services6d from 'assets/images/lotties/itSupportDark.json';

import portfolio1 from "assets/images/it-services-portfolio1.png";
import portfolio2 from "assets/images/it-services-portfolio2.png";
import portfolio3 from "assets/images/it-services-portfolio3.png";
import portfolio4 from "assets/images/it-services-portfolio4.png";

const Services = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const services1Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services1 : services1d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const services2Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services2 : services2d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const services3Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services3 : services3d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const services4Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services4 : services4d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const services5Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services5 : services5d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const services6Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? services6 : services6d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div id="services">
      <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto">
        {/* title */}
        <div>
          <p
            className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
              } w-full it-service-title text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
            dangerouslySetInnerHTML={{
              __html: dictionary["itServices"][languageReducer]["title"],
            }}
          />
          <p
            className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
          >
            {dictionary["itServices"][languageReducer]["description"]}
          </p>
        </div>

        {/* services cards */}
        {/* 1 */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] pt-[30px]">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {dictionary["itServices"][languageReducer]["title1"]}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                  } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                dangerouslySetInnerHTML={{
                  __html: dictionary["itServices"][languageReducer]["description1"],
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                {/* <Lottie options={services1Lottie} /> */}
                <DotAnim
                  anim="it.services.website"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </div>
            </div>
          </div>
          {/* check portfolio */}
          <div className="mt-[10px] px-[20px] lg:px-[50px] 2xl:px-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                } w-full font-redDisplay font-bold text-[18px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] `}
            >
              {dictionary["itServices"][languageReducer]["service1PortfolioText"]}
            </p>
            <div className="mt-[12px] grid grid-cols-2 lg:grid-cols-4 gap-3 justify-between">
              <div className="w-full flex justify-center items-center"
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1100"
              >
                <img src={portfolio1} alt="portfolio-1" className="" />
              </div>
              <div className="w-full flex justify-center items-center"
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1200"
              >
                <img src={portfolio2} alt="portfolio-2" className="" />
              </div>
              <div className="w-full flex justify-center items-center"
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1300"
              >
                <img src={portfolio3} alt="portfolio-3" className="" />
              </div>
              <div className="relative w-full flex justify-center items-center"
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1400"
              >
                <div className="center-child">
                  <button
                    onClick={openModal}
                    className="hero-btn custom-btn w-full min-w-[140px] md:min-w-[130px] h-[38px] lg:min-w-[150px] lg:h-[45px] xl:min-w-[170px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2"
                  >
                    <span className="custom-btn-inner">
                      {dictionary["itServices"][languageReducer]["service1PortfolioButton"]}
                    </span>
                  </button>
                </div>
                <img src={portfolio4} alt="portfolio-4" className="" />
              </div>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              {/* <Lottie options={services2Lottie} /> */}
              <DotAnim
                anim="it.services.maintenance"
                style={{ width: "100%", height: "auto" }}
                crisp
                protect
              />
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {dictionary["itServices"][languageReducer]["title2"]}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
              dangerouslySetInnerHTML={{
                __html: dictionary["itServices"][languageReducer]["description2"],
              }}
            />
          </div>
        </div>

        {/* 3 */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {dictionary["itServices"][languageReducer]["title3"]}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                  } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                dangerouslySetInnerHTML={{
                  __html: dictionary["itServices"][languageReducer]["description3"],
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                {/* <Lottie options={services3Lottie} /> */}
                <DotAnim
                  anim="it.services.optimization"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              {/* <Lottie options={services4Lottie} /> */}
              <DotAnim
                anim="it.services.security"
                style={{ width: "100%", height: "auto" }}
                crisp
                protect
              />
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {dictionary["itServices"][languageReducer]["title4"]}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
              dangerouslySetInnerHTML={{
                __html: dictionary["itServices"][languageReducer]["description4"],
              }}
            />
          </div>
        </div>

        {/* 5 */}
        <div
          className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
            } my-[30px] rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px]`}
        >
          <div className="flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
            <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
              <p
                className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                  } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
              >
                {dictionary["itServices"][languageReducer]["title5"]}
              </p>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                  } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
                dangerouslySetInnerHTML={{
                  __html: dictionary["itServices"][languageReducer]["description5"],
                }}
              />
            </div>
            <div className="w-full lg:w-[48%] flex justify-center items-center"
              data-aos="fade-left"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1200">
              <div className="w-full">
                {/* <Lottie options={services5Lottie} /> */}
                <DotAnim
                  anim="it.services.backup"
                  style={{ width: "100%", height: "auto" }}
                  crisp
                  protect
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6 */}
        <div className="xl:px-[30px] 2xl:px-[60px] flex flex-col-reverse lg:flex-row justify-center items-center lg:justify-between lg:items-center gap-y-[50px] py-[30px]">
          <div className="w-full lg:w-[48%] flex justify-center items-center"
            data-aos="fade-left"
            data-aos-easing="ease-in-sine"
            data-aos-duration="1200">
            <div className="w-full">
              {/* <Lottie options={services6Lottie} /> */}
              <DotAnim
                anim="it.services.support"
                style={{ width: "100%", height: "auto" }}
                crisp
                protect
              />
            </div>
          </div>
          <div className="w-full lg:w-[50%] 2xl:w-[50%] lg:pl-[50px] 2xl:pl-[100px]">
            <p
              className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                } w-full text-center lg:text-left 2xl:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mb-[8px] xl:mb-[6px] leading-[40px] lg:leading-[50px] xl:leading-[60px]`}
            >
              {dictionary["itServices"][languageReducer]["title6"]}
            </p>
            <p
              className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                } w-full mt-5 it-service-description text-center lg:text-left font-helvetica font-light leading-7 text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] mx-auto`}
              dangerouslySetInnerHTML={{
                __html: dictionary["itServices"][languageReducer]["description6"],
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999 }}>
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-700 ease-in-out"
            onClick={closeModal}
          />

          {/* Modal content */}
          <div className={`relative w-[75%] h-[75%] ${themeReducer === "light" ? "bg-white" : "bg-[#2B284C]"} rounded-lg shadow-2xl transform transition-all duration-700 ease-in-out animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4`}>
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div className={`p-8 h-full flex flex-col items-center justify-start ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
              }`}>
              <h2 className={`mb-1 font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px]`}>
                {dictionary["itServices"][languageReducer]["portfolioModalHeading"]}
              </h2>
              <p
                className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                  } w-full text-center font-helvetica font-light text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] `}
              >
                {dictionary["itServices"][languageReducer]["portfolioModalDescription"]}
              </p>
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 justify-between">
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio1} alt="portfolio-1" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio2} alt="portfolio-2" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio3} alt="portfolio-3" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio4} alt="portfolio-4" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio1} alt="portfolio-1" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio2} alt="portfolio-2" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio3} alt="portfolio-3" className="" />
                </div>
                <div className="w-full flex justify-center items-center">
                  <img src={portfolio4} alt="portfolio-4" className="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
