/**
 * The pillar page: "création de sites web et d'applications en Suisse romande".
 *
 * It answers the question someone actually types — which supplier can build a
 * website and an application here — rather than describing services in the
 * abstract. Everything on it is checkable somewhere else on the site: the
 * services against the homepage services section, the method against it too,
 * the area against the FAQ, the work against /projects.
 *
 * It is composed out of the site's own sections rather than page-specific
 * ones: the services page's `Process`, its FAQ section, and the homepage's
 * booking block under a wave. The contact form closes the page, as it does on
 * the services page, so a visitor who has read this far need not navigate to
 * write.
 */

import React from "react";

import Contact from "@features/contact/components/contact-section";
import Booking from "@features/booking/components/booking-cta";
import Process from "@features/it-services/components/process";

import {
  LandingFeature,
  LandingHero,
  LandingLink,
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

/**
 * One visual per service, in the order the dictionary lists them, and no two
 * the same.
 *
 * Three rows get an animation that genuinely means what they say. The other
 * three get an inline drawing: the catalogue has nothing for a custom
 * application, for technical SEO or for a hosted business tool, and the first
 * draft papered over that by repeating the nearest animation — so the page
 * showed the same picture twice, two rows apart, three times over.
 */
const SERVICE_VISUALS: LandingServiceRow["visual"][] = [
  { anim: "it.services.website" },
  { illustration: "app" },
  { anim: "it.services.optimization" },
  { illustration: "seo" },
  { illustration: "hosting" },
  { anim: "it.services.support" },
];

export default function SuisseRomandePage() {
  useScrollToHash();

  const languageReducer = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(languageReducer);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  const serviceRows: LandingServiceRow[] = t
    .array<LandingCard>("agency.romandieServices")
    .map((card, index) => ({ ...card, visual: SERVICE_VISUALS[index] }));

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
        <LandingServiceRows rows={serviceRows} />
        <LandingLink to="#services">{t.text("agency.servicesCta")}</LandingLink>
      </LandingSection>

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

      {/* The services page's own process section, reading the same five steps
          from the same keys — one presentation of them on the whole site. */}
      <Process
        title={t.text("agency.methodTitle")}
        description={t.text("agency.methodDescription")}
      />

      {/*
        "Où nous intervenons" used to sit after this, restating the cantons the
        hero and the FAQ both already name and existing mostly to hold the link
        to the Valais page. The section is gone and the link sits here, beside
        the work — where a reader who has just seen the projects is closest to
        wanting the one canton we say most about.
      */}
      <LandingSection id="work" title={t.text("agency.proofTitle")}>
        <WorkPreview />
        <div className="w-full flex flex-wrap justify-center gap-[14px] mt-[30px] lg:mt-[40px]">
          <LandingLink to={WORK_BASE_PATH} inline>
            {t.text("agency.proofCta")}
          </LandingLink>
          <LandingLink to="/web-agency-valais" inline>
            {t.text("agency.valaisLinkLabel")}
          </LandingLink>
        </div>
      </LandingSection>

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
