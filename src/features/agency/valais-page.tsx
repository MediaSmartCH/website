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
  LandingFeature,
  LandingHero,
  LandingLink,
  LandingSection,
  LandingSteps,
  LandingWave,
  type LandingCard,
} from "@features/agency/components/landing-blocks";
import LandingCta from "@features/agency/components/landing-cta";
import LandingFaq from "@features/agency/components/landing-faq";
import WorkPreview from "@features/work/components/work-preview";
import { WORK_BASE_PATH } from "@features/work/lib/work-routes";

import BookingButton from "@features/booking/components/booking-button";

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
          <BookingButton
            className="hero-btn custom-btn w-[280px] h-[48px] flex items-center justify-center text-center rounded-[5px] text-white font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px]"
            text={t.text("agency.ctaButton")}
          />
        }
      />

      <LandingSection id="local" title={t.text("agency.valaisLocalTitle")} tinted>
        <LandingCards cards={t.array<LandingCard>("agency.valaisLocal")} columns={2} />
      </LandingSection>

      {/* The Valais clients lead here, right after the section that names
          them: the two cards above say JoColor and SoClean4U, and these are
          those two sites. */}
      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview ids={VALAIS_CLIENT_IDS} />
        <LandingLink to={WORK_BASE_PATH}>{t.text("agency.proofCta")}</LandingLink>
      </LandingSection>

      <LandingFeature
        anim="it.services.website"
        title={t.text("agency.valaisServicesTitle")}
        reverse
      >
        <ul className="flex flex-col gap-[18px]">
          {t.array<LandingCard>("agency.valaisServices").map((item, index) => (
            <li
              key={item.title}
              data-aos="fade-up"
              data-aos-duration="1100"
              data-aos-delay={index * 70}
              data-aos-easing="ease-in-sine"
            >
              <h3 className="text-heading-strong font-redDisplay font-bold text-[17px] xl:text-[19px] mb-[4px]">
                {item.title}
              </h3>
              <p className="text-body font-poppins font-light text-[13px] xl:text-[15px] leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
        <div className="w-full flex justify-center lg:justify-start mt-[22px]">
          <LandingLink to="/web-development" inline>
            {t.text("agency.servicesCta")}
          </LandingLink>
        </div>
      </LandingFeature>

      <LandingSection
        id="method"
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
        tinted
      >
        <LandingSteps steps={t.array<LandingCard>("it.processData")} />
      </LandingSection>

      <LandingFaq
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.valaisFaq")}
        idPrefix="valais"
      />

      <LandingSection id="area" title={t.text("agency.areaTitle")}>
        <LandingLink to="/agence-web-suisse-romande">
          {t.text("agency.romandieTitle")}
        </LandingLink>
      </LandingSection>

      <LandingWave>
        <LandingCta
          title={t.text("agency.ctaTitle")}
          description={t.text("agency.ctaDescription")}
          bookingLabel={t.text("agency.ctaButton")}
          secondaryLabel={t.text("agency.ctaSecondary")}
          secondaryTo="#contact"
        />
      </LandingWave>

      <Contact />
    </>
  );
}
