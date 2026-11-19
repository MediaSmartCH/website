import React from "react";

import About from "@features/home/components/about";
import Hero from "@features/home/components/hero";
import RegionalLinks from "@features/agency/components/regional-links";

/* ============================================================================
 * FUSION DE /web-development DANS L'ACCUEIL
 * La page services faisait doublon avec l'accueil : les deux présentaient les
 * mêmes prestations, l'une en six cartes courtes, l'autre en trois blocs
 * détaillés. Elle a été supprimée et l'accueil reprend ses sections, qui sont
 * la version la plus riche du même propos.
 *
 * Retirés de l'accueil pour la même raison :
 *   - ITOverview  : six cartes qui redisaient, en plus court, ce que la
 *                   section Services développe (vitrine, business, app sur
 *                   mesure, refonte, SEO, maintenance).
 *   - SaasOverview: un teaser des deux applications métier qui renvoyait à
 *                   /web-development#saas ; SaasProducts les présente en
 *                   entier, ici même.
 * Leurs composants et leurs clés i18n restent en place, comme pour la vidéo,
 * pour qu'un retour arrière soit une ligne à écrire.
 * ========================================================================== */
/* La section prestations est celle d'origine : six cartes portées chacune par
 * une animation du catalogue. C'est elle qui dit ce que nous faisons, et les
 * animations sont ce qui donne au site sa personnalité — aucune raison de les
 * remplacer par des dessins.
 *
 * Le composant Services (les trois blocs détaillés de l'ancienne page
 * /web-development) reste hors de l'accueil : il embarquait la galerie
 * portfolio, qui doublonne désormais /projects. Ses textes restent en place. */
import ITOverview from "@features/home/components/it-overview";
import SaasProducts from "@features/it-services/components/saas-products";
import Process from "@features/it-services/components/process";
import FaqIT from "@features/it-services/components/faq";
import Booking from "@features/booking/components/booking-cta";
import Contact from "@features/contact/components/deferred-contact";
import WaveBackdrop from "@shared/components/wave-backdrop";
/* ============================================================================
 * VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER
 * La section "Aperçu vidéo" de l'accueil est mise en pause : le site ne
 * communique plus que sur l'informatique. L'import et le rendu restent en
 * commentaire pour pouvoir réactiver l'offre vidéo en une ligne.
 * ============================================================================ */
// import VideoOverview from "@features/home/components/video-overview";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";

const Homepage = () => {
  useScrollToHash();

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    refreshAosAnimations();
    setHasAnimated(true);
  }, []);

  React.useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      refreshAosAnimations();

      if (!window.location.hash) return;

      const sectionId = window.location.hash.replace("#", "");
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(rafId);
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
      {/* Les réalisations clients vivent sur /projects, pas ici. */}
      <ITOverview />
      <SaasProducts />
      <Process />
      <RegionalLinks />
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
      {/* VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER : section vidéo de l'accueil en pause. */}
      {/* <VideoOverview /> */}
      <Contact />
    </>
  );
};

export default Homepage;
