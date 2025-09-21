import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/locales";
import VideoOverviewCard from "./VideoOverviewCard";
import { LottieKey } from "config/lotties";

// Importation of lottie files
// import overview1 from 'assets/images/lotties/liveVideoDirectionLight.json';
// import overview1d from 'assets/images/lotties/liveVideoDirectionDark.json';
// import overview2 from 'assets/images/lotties/eventRetransmissionLight.json';
// import overview2d from 'assets/images/lotties/eventRetransmissionDark.json';
// import overview3 from 'assets/images/lotties/videoEditingLight.json';
// import overview3d from 'assets/images/lotties/videoEditingDark.json';
// import overview4 from 'assets/images/lotties/equipmentRentalLight.json';
// import overview4d from 'assets/images/lotties/equipmentRentalDark.json';
// import overview5 from 'assets/images/lotties/photographyLight.json';
// import overview5d from 'assets/images/lotties/photographyDark.json';

const OVERVIEW_ANIMS: LottieKey[] = [
  "video.live",
  "video.retransmission",
  "video.editing",
  "video.rental",
  "video.photography",
];

export default function VideoOverview() {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const preloadVideoServices = () => {
    import("../../../../pages/VideoServices");
  };

  // const overview1Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? overview1 : overview1d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const overview2Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? overview2 : overview2d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const overview3Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? overview3 : overview3d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const overview4Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? overview4 : overview4d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // const overview5Lottie = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: themeReducer === "light" ? overview5 : overview5d,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid meet"
  //   }
  // };

  // Define Lottie options for each card
  // const getLottieOptionsForCard = (index: number) => {
  //   const lottieOptions = [
  //     overview1Lottie,
  //     overview2Lottie,
  //     overview3Lottie,
  //     overview4Lottie,
  //     overview5Lottie
  //   ];

    // return lottieOptions[index];
  // };

  return (
    <div id="services" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto py-[40px] relative">
      <p
        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
          } w-full text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
      >
        {dictionary["home"][languageReducer]["VideoOverviewTitle"]}
      </p>
      <p
        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
      >
        {dictionary["home"][languageReducer]["VideoOverviewDescription"]}
      </p>
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-[30px] lg:gap-[20px] xl:gap-[30px] 2xl:gap-[40px] my-[40px] md:my-[50px]">
        {dictionary["home"][languageReducer]["VideoOverviewCards"].map((card: any, index: number) => (
          <VideoOverviewCard
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
        <Link to="video-services" onMouseEnter={preloadVideoServices}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">
              {dictionary["home"][languageReducer]["VideoOverviewExploreBtn"]}
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}