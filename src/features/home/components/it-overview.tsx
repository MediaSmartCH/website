import OverviewSection from "@features/home/components/overview-section";
import { LottieKey } from "@shared/config/lotties";

// Ordered to match the index of each card in the home.ITOverviewCards array.
const IT_OVERVIEW_ANIMATIONS: LottieKey[] = [
  "it.services.website",
  "it.services.maintenance",
  "it.services.optimization",
  "it.services.security",
  "it.services.backup",
  "it.services.support",
];

/** Prefetches the IT services route chunk so hovering the button hides the load. */
const preloadITServices = () => {
  import("@features/it-services/it-services-page");
};

export default function ITOverview() {
  return (
    <OverviewSection
      translationPrefix="ITOverview"
      animations={IT_OVERVIEW_ANIMATIONS}
      exploreHref="it-services"
      preloadRoute={preloadITServices}
      textAnimation="fade-up"
      spacingClassName="pt-[50px] lg:pt-[50px] xl:pt-[50px] pb-[40px]"
    />
  );
}
