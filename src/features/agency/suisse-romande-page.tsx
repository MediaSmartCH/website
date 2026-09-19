/**
 * The pillar page: "création de sites web et d'applications en Suisse romande".
 *
 * It answers the question someone actually types — which supplier can build a
 * website and an application here — rather than describing services in the
 * abstract. Everything on it is checkable somewhere else on the site: the
 * services against /web-development, the method against the process section,
 * the area against the FAQ, the work against /projects.
 *
 * The contact form closes the page, as it does on the services page, so a
 * visitor who has read this far does not have to navigate to write.
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
import RichText from "@shared/components/rich-text";
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
      {/* The services-page hero animation: the page is about building sites
          and applications, which is what it depicts. */}
      <LandingHero
        title={t.text("agency.romandieTitle")}
        lead={t.text("agency.romandieLead")}
        intro={t.text("agency.romandieIntro")}
        anim="it.hero"
        actions={
          <BookingButton
            className="hero-btn custom-btn w-[280px] h-[48px] flex items-center justify-center text-center rounded-[5px] text-white font-helvetica font-light text-[14px] xl:text-[15px] 2xl:text-[16px]"
            text={t.text("agency.ctaButton")}
          />
        }
      />

      <LandingSection id="services" title={t.text("agency.servicesTitle")}>
        <LandingCards cards={t.array<LandingCard>("agency.romandieServices")} />
        <LandingLink to="/web-development">{t.text("agency.servicesCta")}</LandingLink>
      </LandingSection>

      {/* Two columns rather than four more cards: six service cards followed by
          four reason cards was the same rectangle eleven times over. */}
      <LandingFeature anim="it.about" title={t.text("agency.romandieWhyTitle")}>
        <ul className="flex flex-col gap-[18px]">
          {t.array<LandingCard>("agency.romandieWhy").map((item, index) => (
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
      </LandingFeature>

      <LandingSection
        id="method"
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
        tinted
      >
        {/* The same five steps the services page describes, read from the same
            keys so the two cannot tell different stories. */}
        <LandingSteps steps={t.array<LandingCard>("it.processData")} />
      </LandingSection>

      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview />
        <LandingLink to={WORK_BASE_PATH}>{t.text("agency.proofCta")}</LandingLink>
      </LandingSection>

      <LandingFeature anim="it.services.website" title={t.text("agency.areaTitle")} reverse>
        <RichText
          as="div"
          className="text-body font-helvetica font-light leading-7 text-[13px] xl:text-[15px] 2xl:text-[16px] text-center lg:text-left"
          html={t.text("agency.romandieAreaDescription")}
        />
        <div className="w-full flex justify-center lg:justify-start mt-[20px]">
          <LandingLink to="/web-agency-valais" inline>
            {t.text("agency.valaisTitle")}
          </LandingLink>
        </div>
      </LandingFeature>

      <LandingFaq
        title={t.text("agency.faqTitle")}
        items={t.array<FaqItem>("agency.romandieFaq")}
        idPrefix="romandie"
        tinted
      />

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
