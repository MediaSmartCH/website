import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/locales";
import ITOverviewCard from "./ITOverviewCard";
import { LottieKey } from "config/lotties";

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

const OVERVIEW_ANIMS: LottieKey[] = [
  "it.services.website",
  "it.services.maintenance",
  "it.services.optimization",
  "it.services.security",
  "it.services.backup",
  "it.services.support",
];

export default function ITOverview() {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

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

  const preloadITServices = () => {
    import("../../../../pages/ITServices");
  };

  // Define Lottie options for each card
  // const getLottieOptionsForCard = (index: number) => {
  //   const lottieOptions = [
  //     services1Lottie,
  //     services2Lottie,
  //     services3Lottie,
  //     services4Lottie,
  //     services5Lottie,
  //     services6Lottie
  //   ];

  //   return lottieOptions[index];
  // };

  return (
    <div id="services" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[50px] lg:pt-[50px] xl:pt-[50px] pb-[40px] relative">
      <p
        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
          } w-full text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
      >
        {dictionary["home"][languageReducer]["ITOverviewTitle"]}
      </p>
      <p
        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
      >
        {dictionary["home"][languageReducer]["ITOverviewDescription"]}
      </p>
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[20px] xl:gap-[30px] 2xl:gap-[40px] my-[40px] md:my-[50px]">
        {dictionary["home"][languageReducer]["ITOverviewCards"].map((card: any, index: number) => (
          <ITOverviewCard
            key={index}
            themeReducer={themeReducer}
            // lottieOptions={getLottieOptionsForCard(index)}
            anim={OVERVIEW_ANIMS[index]}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
      <div className="flex justify-center w-full">
        <Link to="it-services" onMouseEnter={preloadITServices}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">
              {dictionary["home"][languageReducer]["ITOverviewExploreBtn"]}
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}