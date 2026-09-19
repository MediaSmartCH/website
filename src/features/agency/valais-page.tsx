/**
 * /agence-web-valais.
 *
 * Not the Suisse romande page with the place name swapped. What is on it is
 * what is only true here: where the office actually is, which clients in the
 * canton are online, and the working calendar — the Valais public holidays the
 * lead times are counted against. The services section is shorter on purpose:
 * the detail lives on /web-development and is linked rather than restated.
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

/** The two clients established in the canton, named on this page for that reason. */
const VALAIS_CLIENT_IDS = ["jocolor", "soclean4u"];

export default function ValaisPage() {
  useScrollToHash();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  return (
    <>
      <LandingHero
        title={t.text("agency.valaisTitle")}
        lead={t.text("agency.valaisLead")}
        intro={t.text("agency.valaisIntro")}
      />

      <LandingSection id="local" title={t.text("agency.valaisLocalTitle")}>
        <LandingCards cards={t.array<LandingCard>("agency.valaisLocal")} columns={2} />
      </LandingSection>

      <LandingSection id="services" title={t.text("agency.valaisServicesTitle")}>
        <LandingCards
          cards={t.array<LandingCard>("agency.valaisServices")}
          columns={2}
        />
        <LandingLink to="/web-development">{t.text("agency.servicesCta")}</LandingLink>
      </LandingSection>

      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview ids={VALAIS_CLIENT_IDS} />
        <LandingLink to={WORK_BASE_PATH}>{t.text("agency.proofCta")}</LandingLink>
      </LandingSection>

      <LandingSection
        id="method"
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
      >
        <LandingSteps steps={t.array<LandingCard>("it.processData")} />
      </LandingSection>

      <LandingFaq
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.valaisFaq")}
        idPrefix="valais"
      />

      <LandingSection id="area" title={t.text("agency.areaTitle")} description="">
        <LandingLink to="/agence-web-suisse-romande">
          {t.text("agency.romandieTitle")}
        </LandingLink>
      </LandingSection>

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
