import React from "react";

import Hero from "@features/it-services/components/hero";
import About from "@features/it-services/components/about";
import Services from "@features/it-services/components/services";
import SaasProducts from "@features/it-services/components/saas-products";
import Booking from "@features/booking/components/booking-cta";
import Contact from "@features/contact/components/contact-section";
import Process from "@features/it-services/components/process";
import FaqIT from "@features/it-services/components/faq";
/* ============================================================================
 * INFORMATIONS PRATIQUES DÉSACTIVÉES — NE PAS SUPPRIMER
 * La section "Informations pratiques" (tarif horaire, conditions de paiement,
 * garantie corrective, horaires ouvrés, périmètre inclus/exclu) est mise en
 * pause en même temps que le contrat de support, dont elle reprenait les
 * tarifs et vers lequel elle renvoyait. Le composant et ses textes
 * (it.practicalInfo*, it.hourlyRate*, it.payment*, it.warranty*, it.hours*,
 * it.scope*) restent en place.
 * POUR RÉACTIVER : décommenter l'import et le rendu <PracticalInfo /> ci-dessous.
 * ========================================================================= */
// import PracticalInfo from "@features/it-services/components/practical-info";
/* ============================================================================
 * ESTIMATIONS DE COÛT PROJET DÉSACTIVÉES — NE PAS SUPPRIMER
 * La section "Estimations de coût projet" (fourchettes de prix par formule,
 * délais indicatifs, contenu inclus par palier, disclaimer et boutons d'appel
 * à l'action) est mise en pause. Le composant et ses textes (it.estimates*,
 * it.estimate*) restent en place, y compris le bandeau des formules de support
 * déjà commenté à l'intérieur du composant.
 * POUR RÉACTIVER : décommenter l'import et le rendu <ProjectEstimates /> ci-dessous.
 * ========================================================================= */
// import ProjectEstimates from "@features/it-services/components/project-estimates";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";
import WaveBackdrop from "@shared/components/wave-backdrop";

export default function ITServicesPage() {
  // Lets the homepage teaser link straight to the #saas section.
  useScrollToHash();

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    refreshAosAnimations();
    setHasAnimated(true);
  }, []);

  // Freeze AOS animations on theme change to prevent re-triggering entrance effects
  React.useEffect(() => {
    if (hasAnimated) {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(el => {
        el.classList.add('aos-animate');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
    }
  }, [themeReducer, hasAnimated]);
  return (
    <>
      <Hero />
      <About />
      <Services />
      <SaasProducts />
      {/* INFORMATIONS PRATIQUES DÉSACTIVÉES — NE PAS SUPPRIMER (voir la
          bannière en tête de fichier). */}
      {/* <PracticalInfo /> */}
      {/* ESTIMATIONS DE COÛT PROJET DÉSACTIVÉES — NE PAS SUPPRIMER (voir la
          bannière en tête de fichier). */}
      {/* <ProjectEstimates /> */}
      <Process />
      <FaqIT />
      <div className="relative overflow-hidden pt-[40px] md:pt-[50px]">
        <WaveBackdrop
          theme={themeReducer}
          className="top-[52px] h-[460px] md:top-[18px] md:h-[500px] lg:top-[8px] lg:h-[540px] xl:top-[-8px] xl:h-[580px]"
        />
        <div className="relative z-10 w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto">
          <div className="pt-[130px] md:pt-[170px] lg:pt-[220px] xl:pt-[250px] 2xl:pt-[250px] pb-[40px]">
            <Booking />
          </div>
        </div>
      </div>
      <Contact />
    </>
  );
};
