import OverviewSection from "@features/home/components/overview-section";
import { LottieKey } from "@shared/config/lotties";

/* ============================================================================
 * SERVICES IT ANNEXES DÉSACTIVÉS — NE PAS SUPPRIMER
 * L'accueil met désormais en avant la création de sites web et d'applications.
 * La liste IT_OVERVIEW_ANIMATIONS ci-dessous correspond aux six cartes
 * "home.ITOverviewCards" (maintenance, optimisation, cybersécurité, sauvegarde,
 * support), qui ne sont plus affichées mais restent dans les dictionnaires.
 * POUR RÉACTIVER : repasser translationPrefix à "ITOverview" et animations à
 * IT_OVERVIEW_ANIMATIONS ci-dessous.
 * ========================================================================= */
// Ordered to match the index of each card in the home.ITOverviewCards array.
// const IT_OVERVIEW_ANIMATIONS: LottieKey[] = [
//   "it.services.website",
//   "it.services.maintenance",
//   "it.services.optimization",
//   "it.services.security",
//   "it.services.backup",
//   "it.services.support",
// ];

// Ordered to match the index of each card in the home.WebOverviewCards array.
const WEB_OVERVIEW_ANIMATIONS: LottieKey[] = [
  "it.services.website",
  "it.services.security",
  "it.services.backup",
  "it.services.maintenance",
  "it.services.support",
  "it.services.optimization",
];

/** Prefetches the IT services route chunk so hovering the button hides the load. */
const preloadITServices = () => {
  import("@features/it-services/it-services-page");
};

export default function ITOverview() {
  return (
    <OverviewSection
      translationPrefix="WebOverview"
      animations={WEB_OVERVIEW_ANIMATIONS}
      exploreHref="it-services"
      preloadRoute={preloadITServices}
      textAnimation="fade-up"
      spacingClassName="pt-[50px] lg:pt-[50px] xl:pt-[50px] pb-[40px]"
    />
  );
}
