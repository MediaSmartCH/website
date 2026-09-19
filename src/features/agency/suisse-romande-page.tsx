/**
 * /web-agency-switzerland.
 *
 * This page answers one question: does MediaSmart work in Suisse romande, and
 * from where. That is all it is for.
 *
 * It used to answer several others as well — what we build, how we work, how a
 * project runs, what it costs — each of which the homepage now answers once,
 * properly, for every visitor. Repeating them here made a long page whose
 * value was its length rather than its subject, and gave a reader the same
 * text twice depending on which door they came through. Those sections are
 * gone; what is left is the part that is only true of this page, and links to
 * where the rest lives.
 */

import React from "react";

import Contact from "@features/contact/components/contact-section";
import Booking from "@features/booking/components/booking-cta";

import {
  LandingHero,
  LandingLink,
  LandingLocalFacts,
  LandingSection,
  LandingWave,
  type LandingCard,
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

/** Three references, not a second gallery: /projects is the gallery. */
const ROMANDIE_CLIENT_IDS = ["cc-wk", "jocolor", "lechoixdesmots"];

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
        anim="it.hero"
        actions={
          <>
            <BookingButton
              className="hero-btn custom-btn w-full sm:w-[280px] h-[48px] flex items-center justify-center text-center rounded-[5px] text-white font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px]"
              text={t.text("agency.ctaButton")}
            />
            <LandingLink to="#services" inline size="hero">
              {t.text("agency.servicesCta")}
            </LandingLink>
          </>
        }
      />

      <LandingLocalFacts
        id="presence"
        title={t.text("agency.romandiePresenceTitle")}
        facts={t.array<LandingCard>("agency.romandiePresence")}
      />

      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview ids={ROMANDIE_CLIENT_IDS} />
        <div className="w-full flex flex-col items-stretch gap-[14px] mx-auto max-w-[320px] sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center mt-[30px] lg:mt-[40px]">
          <LandingLink to={WORK_BASE_PATH} inline>
            {t.text("agency.proofCta")}
          </LandingLink>
          <LandingLink to="/web-agency-valais" inline>
            {t.text("agency.valaisLinkLabel")}
          </LandingLink>
        </div>
      </LandingSection>

      {/* Two questions, both about the place. Price, lead times and the
          difference between a site and an app are the homepage's to answer. */}
      <FaqSection
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.romandieFaq")}
        idPrefix="romandie"
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
