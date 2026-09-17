import { Link } from "react-router-dom";

import OverviewCard from "@features/home/components/overview-card";

import RichText from "@shared/components/rich-text";

import { LottieKey } from "@shared/config/lotties";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

const MAX_OVERVIEW_CARDS = 6;
const OVERVIEW_CARD_WIDTH =
  "w-full md:w-[calc((100%-30px)/2)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/3)] 2xl:w-[calc((100%-80px)/3)]";

type OverviewCardContent = { title: string; description: string };

export interface OverviewSectionProps {
  /** Translation key prefix — "ITOverview" reads home.ITOverviewTitle and friends. */
  translationPrefix: string;
  /** Animation per card, ordered to match the translation array index. */
  animations: LottieKey[];
  /** Route the explore button links to, relative to the current locale. */
  exploreHref: string;
  /** Warms the destination route chunk on hover. */
  preloadRoute: () => void;
  textAnimation: "fade-up" | "zoom-in";
  /** Vertical padding, which differs between the two homepage sections. */
  spacingClassName: string;
}

/**
 * A homepage overview section: heading, intro, a grid of service cards, and a
 * button through to the matching services page.
 *
 * Both the IT and video sections render through this. They differ only in their
 * copy, their animations and their destination, so the two 85-line components
 * this replaces were 80% identical.
 */
export default function OverviewSection({
  translationPrefix,
  animations,
  exploreHref,
  preloadRoute,
  textAnimation,
  spacingClassName,
}: OverviewSectionProps) {
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);

  const cards = t
    .array<OverviewCardContent>(`home.${translationPrefix}Cards`)
    .slice(0, MAX_OVERVIEW_CARDS);

  return (
    <div
      id="services"
      className={`w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto relative ${spacingClassName}`}
    >
      {/* RichText so the title can carry the gradient <span> accent the other
          section headings use. */}
      <RichText
        as="h2"
        className="text-heading-strong it-service-title w-full text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]"
        html={t.text(`home.${translationPrefix}Title`)}
      />
      <p className="text-body w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] ">
        {t.text(`home.${translationPrefix}Description`)}
      </p>

      <div className="flex flex-wrap justify-center gap-[30px] lg:gap-[20px] xl:gap-[30px] 2xl:gap-[40px] my-[40px] md:my-[50px]">
        {cards.map((card, index) => (
          <div key={index} className={OVERVIEW_CARD_WIDTH}>
            <OverviewCard
              title={card.title}
              description={card.description}
              // Clamp so extra cards beyond the animation list still get a valid key.
              anim={animations[Math.min(index, animations.length - 1)]}
              textAnimation={textAnimation}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center w-full">
        <Link to={exploreHref} onMouseEnter={preloadRoute}>
          <button className="hero-btn custom-btn w-full sm:w-auto min-w-[180px] h-[38px] lg:min-w-[200px] lg:h-[45px] xl:min-w-[212px] xl:h-[49px] flex items-center justify-center rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] px-2 md:px-4">
            <span className="custom-btn-inner">
              {t.text(`home.${translationPrefix}ExploreBtn`)}
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
