/**
 * /web-agency-valais.
 *
 * Not the Suisse romande page with the place name swapped. What is on it is
 * what is only true here: where the office actually is, which clients in the
 * canton are online, and the working calendar — the Valais public holidays the
 * lead times are counted against.
 *
 * There is no "where we work" section on this page. The hero says Dorénaz, the
 * local section's last item says we also work beyond the canton, and the FAQ
 * answers it in full — a fourth statement of the same fact was a section that
 * existed to hold a link. That link now sits with the local section, where a
 * reader has just been told what the canton means to us.
 */

import React from "react";

import Contact from "@features/contact/components/contact-section";
import Booking from "@features/booking/components/booking-cta";
import Process from "@features/it-services/components/process";

import {
  LandingHero,
  LandingLink,
  LandingLocalFacts,
  LandingSection,
  LandingServiceRows,
  LandingWave,
  type LandingCard,
  type LandingServiceRow,
} from "@features/agency/components/landing-blocks";
import WorkPreview from "@features/work/components/work-preview";
import { WORK_BASE_PATH } from "@features/work/lib/work-routes";

import BookingButton from "@features/booking/components/booking-button";

import FaqSection from "@shared/components/faq-section";
import type { FaqItem } from "@shared/components/faq-accordion";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";

/** The two clients established in the canton, named on this page for that reason. */
const VALAIS_CLIENT_IDS = ["jocolor", "soclean4u"];

/** One visual per service, in the order the dictionary lists them, no repeats. */
const SERVICE_VISUALS: LandingServiceRow["visual"][] = [
  { anim: "it.services.website" },
  { illustration: "business" },
  { illustration: "app" },
  { anim: "it.services.optimization" },
];

export default function ValaisPage() {
  useScrollToHash();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  const serviceRows: LandingServiceRow[] = t
    .array<LandingCard>("agency.valaisServices")
    .map((card, index) => ({ ...card, visual: SERVICE_VISUALS[index] }));

  return (
    <>
      {/* The "Introduction" animation rather than the services hero: the two
          regional pages should not open on the same picture, and nothing here
          tries to illustrate Valais with scenery it has no photograph of. */}
      <LandingHero
        title={t.text("agency.valaisTitle")}
        lead={t.text("agency.valaisLead")}
        intro={t.text("agency.valaisIntro")}
        anim="it.about"
        actions={
          <BookingButton
            className="hero-btn custom-btn w-[280px] h-[48px] flex items-center justify-center text-center rounded-[5px] text-white font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px]"
            text={t.text("agency.ctaButton")}
          />
        }
      />

      <LandingLocalFacts
        id="local"
        title={t.text("agency.valaisLocalTitle")}
        facts={t.array<LandingCard>("agency.valaisLocal")}
        link={
          <LandingLink to="/web-agency-switzerland" inline>
            {t.text("agency.romandieLinkLabel")}
          </LandingLink>
        }
      />

      {/* The Valais clients lead here, right after the section that names
          them: the facts above say JoColor and SoClean4U, and these are those
          two sites. */}
      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview ids={VALAIS_CLIENT_IDS} />
        <LandingLink to={WORK_BASE_PATH}>{t.text("agency.proofCta")}</LandingLink>
      </LandingSection>

      <LandingSection id="services" title={t.text("agency.valaisServicesTitle")}>
        <LandingServiceRows rows={serviceRows} />
        <LandingLink to="/web-development">{t.text("agency.servicesCta")}</LandingLink>
      </LandingSection>

      <Process
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
      />

      <FaqSection
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.valaisFaq")}
        idPrefix="valais"
      />

      <LandingWave>
        <Booking
          title={t.text("agency.ctaTitle")}
          description={t.text("agency.ctaDescription")}
          buttonLabel={t.text("agency.ctaButton")}
        />
      </LandingWave>

      <Contact />
    </>
  );
}
