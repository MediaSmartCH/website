/**
 * /projects — the work, at a URL.
 *
 * Four things a visitor should be able to tell apart at a glance, in the order
 * they are worth showing: work delivered for clients, work under way, the
 * applications MediaSmart builds and runs itself, and the tools it gives away.
 *
 * The last two are rendered by `SaasProducts` — the same component the
 * homepage uses, not a second version of it. It was two grids of cards here
 * and a richer presentation there, close enough to look like a mistake.
 */

import React from "react";

import {
  getItemCategory,
  type PortfolioData,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";
import portfolioData from "@features/it-services/data/it-portfolio.json";
import SaasProducts from "@features/it-services/components/saas-products";
import WorkCard from "@features/work/components/work-card";

import {
  LandingHero,
  LandingSection,
  LandingWave,
} from "@features/agency/components/landing-blocks";
import Booking from "@features/booking/components/booking-cta";
import Contact from "@features/contact/components/contact-section";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";

const items = (portfolioData as PortfolioData).items;

const byCategory = (category: string): PortfolioItem[] =>
  items.filter((item) => getItemCategory(item) === category);

export default function WorkIndexPage() {
  useScrollToHash();

  const language = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(language);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  const delivered = byCategory("client");
  const inProgress = byCategory("in-progress");

  // Counted from what is actually on the page, and counted separately: a
  // single total mixing delivered work, work under way, our own products and
  // free tools is a number that answers no question anyone has.
  const deliveredCount = `${delivered.length} ${t.text(
    delivered.length > 1 ? "work.countProjects" : "work.countProject"
  )}`;
  const inProgressCount = `${inProgress.length} ${t.text(
    inProgress.length > 1 ? "work.countInProgress" : "work.countInProgressOne"
  )}`;

  return (
    <>
      <LandingHero title={t.text("work.pageTitle")} lead={t.text("work.pageLead")} intro="" />

      {delivered.length > 0 && (
        <LandingSection
          id="client"
          title={t.text("work.indexClientTitle")}
          description={`${t.text("work.indexClientDescription")} — ${deliveredCount}.`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] lg:gap-[24px]">
            {delivered.map((item, index) => (
              <WorkCard key={item.id} item={item} linkToDetail index={index} />
            ))}
          </div>
        </LandingSection>
      )}

      {inProgress.length > 0 && (
        <LandingSection
          id="in-progress"
          title={t.text("work.indexProgressTitle")}
          description={`${t.text("work.indexProgressDescription")} — ${inProgressCount}.`}
          tinted
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] lg:gap-[24px]">
            {inProgress.map((item, index) => (
              <WorkCard
                key={item.id}
                item={item}
                // No page of their own: there is nothing to put on one yet.
                linkToDetail={false}
                index={index}
                status={t.text("work.statusInProgress")}
              />
            ))}
          </div>
        </LandingSection>
      )}

      {/* Our own products and the free tools, exactly as the homepage shows
          them. */}
      <SaasProducts />

      <LandingWave>
        <Booking
          title={t.text("work.ctaTitle")}
          description={t.text("work.ctaDescription")}
          buttonLabel={t.text("work.ctaButton")}
        />
      </LandingWave>

      <Contact />
    </>
  );
}
