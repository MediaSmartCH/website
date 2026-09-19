/**
 * The pillar page: "création de sites web et d'applications en Suisse romande".
 *
 * It answers the question someone actually types — which supplier can build a
 * website and an application here — rather than describing services in the
 * abstract. Everything on it is checkable somewhere else on the site: the
 * services against /web-development, the method against the process section,
 * the area against the FAQ, the work against /realisations.
 *
 * The contact form closes the page, as it does on the services page, so a
 * visitor who has read this far does not have to navigate to write.
 */

import React from "react";

import Contact from "@features/contact/components/contact-section";

import {
  LandingCards,
  LandingHero,
  LandingLink,
  LandingSection,
  LandingSteps,
  type LandingCard,
} from "@features/agency/components/landing-blocks";
import LandingCta from "@features/agency/components/landing-cta";
import LandingFaq from "@features/agency/components/landing-faq";
import WorkPreview from "@features/work/components/work-preview";
import { WORK_BASE_PATH } from "@features/work/lib/work-routes";

import type { FaqItem } from "@shared/components/faq-accordion";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";

export default function SuisseRomandePage() {
  useScrollToHash();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  return (
    <>
      <LandingHero
        title={t.text("agency.romandieTitle")}
        lead={t.text("agency.romandieLead")}
        intro={t.text("agency.romandieIntro")}
      />

      <LandingSection id="services" title={t.text("agency.servicesTitle")}>
        <LandingCards cards={t.array<LandingCard>("agency.romandieServices")} />
        <LandingLink to="/web-development">{t.text("agency.servicesCta")}</LandingLink>
      </LandingSection>

      <LandingSection id="why" title={t.text("agency.romandieWhyTitle")}>
        <LandingCards cards={t.array<LandingCard>("agency.romandieWhy")} columns={2} />
      </LandingSection>

      <LandingSection
        id="method"
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
      >
        {/* The same five steps the services page describes, read from the same
            keys so the two cannot tell different stories. */}
        <LandingSteps steps={t.array<LandingCard>("it.processData")} />
      </LandingSection>

      <LandingSection
        id="area"
        title={t.text("agency.areaTitle")}
        description={t.text("agency.romandieAreaDescription")}
      >
        <LandingLink to="/agence-web-valais">{t.text("agency.valaisTitle")}</LandingLink>
      </LandingSection>

      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview />
        <LandingLink to={WORK_BASE_PATH}>{t.text("agency.proofCta")}</LandingLink>
      </LandingSection>

      <LandingFaq
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.romandieFaq")}
        idPrefix="romandie"
      />

      <LandingCta
        title={t.text("agency.ctaTitle")}
        description={t.text("agency.ctaDescription")}
        bookingLabel={t.text("agency.ctaButton")}
        secondaryLabel={t.text("agency.ctaSecondary")}
        secondaryTo="#contact"
      />

      <Contact />
    </>
  );
}
