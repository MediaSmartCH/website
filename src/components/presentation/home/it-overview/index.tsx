import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";
import ITOverviewCard from "./ITOverviewCard";
import { LottieKey } from "config/lotties";

// Animation keys are ordered to match the translation array index for each service card
const OVERVIEW_ANIMS: LottieKey[] = [
  "it.services.website",
  "it.services.maintenance",
  "it.services.optimization",
  "it.services.security",
  "it.services.backup",
  "it.services.support",
];
const MAX_OVERVIEW_CARDS = 6;
const OVERVIEW_CARD_WIDTH =
  "w-full md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/3)] 2xl:w-[calc((100%-80px)/3)]";

export default function ITOverview() {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  type OverviewCard = { title: string; description: string };

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const t = useTranslations(languageReducer);
  const cards = t.array<OverviewCard>("home.ITOverviewCards").slice(
    0,
    MAX_OVERVIEW_CARDS
  );

  // Prefetch route chunk on hover to reduce navigation latency
  const preloadITServices = () => {
    import("../../../../pages/ITServices");
  };

  return (
    <div id="services" className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[50px] lg:pt-[50px] xl:pt-[50px] pb-[40px] relative">
      <p
        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
          } w-full text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
      >
        {t.text("home.ITOverviewTitle")}
      </p>
      <p
        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
          } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
      >
        {t.text("home.ITOverviewDescription")}
      </p>
      <div className="flex flex-wrap justify-center gap-[30px] lg:gap-[20px] xl:gap-[30px] 2xl:gap-[40px] my-[40px] md:my-[50px]">
        {cards.map((card, i) => {
          // Clamp the index so extra cards beyond OVERVIEW_ANIMS still get a valid key
          const anim = OVERVIEW_ANIMS[Math.min(i, OVERVIEW_ANIMS.length - 1)];

          return (
            <div key={i} className={OVERVIEW_CARD_WIDTH}>
              <ITOverviewCard
                title={card.title}
                description={card.description}
                themeReducer={themeReducer}
                anim={anim}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center w-full">
        <Link to="it-services" onMouseEnter={preloadITServices}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] flex items-center justify-center rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">
              {t.text("home.ITOverviewExploreBtn")}
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}
