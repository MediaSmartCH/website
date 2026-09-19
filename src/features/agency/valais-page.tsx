/**
 * /web-agency-valais.
 *
 * Whether MediaSmart is a web agency based in Valais, and what that means in
 * practice. Nothing else: the prestations, the method and the general
 * questions are the homepage's, answered once there.
 *
 * What stays is what is only true here — the office in Dorénaz, the Valais
 * clients who are online, the working calendar counted against the canton's
 * own public holidays — and the links to where the rest lives.
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
      {/* The "Introduction" animation rather than the services hero: the two
          regional pages should not open on the same picture, and nothing here
          tries to illustrate Valais with scenery it has no photograph of. */}
      <LandingHero
        title={t.text("agency.valaisTitle")}
        lead={t.text("agency.valaisLead")}
        intro={t.text("agency.valaisIntro")}
        anim="it.about"
        actions={
          <>
            <BookingButton
              className="hero-btn custom-btn w-[280px] h-[48px] flex items-center justify-center text-center rounded-[5px] text-white font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px]"
              text={t.text("agency.ctaButton")}
            />
            <LandingLink to="#services" inline size="hero">
              {t.text("agency.servicesCta")}
            </LandingLink>
          </>
        }
      />

      <LandingLocalFacts
        id="local"
        title={t.text("agency.valaisLocalTitle")}
        facts={t.array<LandingCard>("agency.valaisLocal")}
      />

      {/* The two clients the section above names by name. */}
      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview ids={VALAIS_CLIENT_IDS} />
        <div className="w-full flex flex-wrap justify-center gap-[14px] mt-[30px] lg:mt-[40px]">
          <LandingLink to={WORK_BASE_PATH} inline>
            {t.text("agency.proofCta")}
          </LandingLink>
          <LandingLink to="/web-agency-switzerland" inline>
            {t.text("agency.romandieLinkLabel")}
          </LandingLink>
        </div>
      </LandingSection>

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
