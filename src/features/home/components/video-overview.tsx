/* ============================================================================
 * VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
 * Ce composant n'est plus monté sur l'accueil (voir home-page.tsx) depuis que
 * le site ne communique plus que sur l'informatique. Il est conservé intact
 * pour pouvoir remettre l'offre vidéo en ligne immédiatement.
 * ============================================================================ */
import OverviewSection from "@features/home/components/overview-section";
import { LottieKey } from "@shared/config/lotties";

// Ordered to match the index of each card in the home.VideoOverviewCards array.
const VIDEO_OVERVIEW_ANIMATIONS: LottieKey[] = [
  "video.live",
  "video.retransmission",
  "video.editing",
  "video.rental",
  "video.photography",
];

/** Prefetches the video services route chunk so hovering the button hides the load. */
const preloadVideoServices = () => {
  import("@features/video-services/video-services-page");
};

export default function VideoOverview() {
  return (
    <OverviewSection
      translationPrefix="VideoOverview"
      animations={VIDEO_OVERVIEW_ANIMATIONS}
      exploreHref="video-services"
      preloadRoute={preloadVideoServices}
      textAnimation="zoom-in"
      spacingClassName="py-[40px]"
    />
  );
}
