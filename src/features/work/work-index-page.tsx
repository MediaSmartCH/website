/**
 * /projects — the work, at a URL.
 *
 * The same projects the services page shows in a modal. A modal has no address:
 * it cannot be linked to, indexed, or cited by anything. These are the strongest
 * evidence the site has that MediaSmart does what it says, and until now none of
 * it was reachable from outside.
 */

import React from "react";

import {
  getItemCategory,
  type PortfolioData,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";
import portfolioData from "@features/it-services/data/it-portfolio.json";
import WorkCard from "@features/work/components/work-card";

import {
  LandingHero,
  LandingSection,
  LandingWave,
} from "@features/agency/components/landing-blocks";
import LandingCta from "@features/agency/components/landing-cta";
import Contact from "@features/contact/components/contact-section";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import useScrollToHash from "@shared/hooks/use-scroll-to-hash";

const items = (portfolioData as PortfolioData).items;

/**
 * `tinted` alternates the background band down the page, so three grids of
 * screenshots read as three sections rather than one long scroll.
 */
const SECTIONS = [
  { category: "client", key: "Client", linkToDetail: true, tinted: false },
  { category: "saas", key: "Saas", linkToDetail: false, tinted: true },
  { category: "free", key: "Free", linkToDetail: false, tinted: false },
] as const;

export default function WorkIndexPage() {
  useScrollToHash();

  const language = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(language);

  React.useEffect(() => {
    refreshAosAnimations();
  }, []);

  const byCategory = (category: string): PortfolioItem[] =>
    items.filter((item) => getItemCategory(item) === category);

  return (
    <>
      <LandingHero
        title={t.text("work.pageTitle")}
        lead={t.text("work.pageLead")}
        intro=""
      />

      {SECTIONS.map(({ category, key, linkToDetail, tinted }) => {
        const sectionItems = byCategory(category);
        if (!sectionItems.length) return null;

        return (
          <LandingSection
            key={category}
            id={category}
            title={t.text(`work.index${key}Title`)}
            description={t.text(`work.index${key}Description`)}
            tinted={tinted}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] lg:gap-[24px]">
              {sectionItems.map((item, index) => (
                <WorkCard
                  key={item.id}
                  item={item}
                  linkToDetail={linkToDetail}
                  index={index}
                />
              ))}
            </div>
          </LandingSection>
        );
      })}

      <LandingWave>
        <LandingCta
          title={t.text("work.ctaTitle")}
          description={t.text("work.ctaDescription")}
          bookingLabel={t.text("work.ctaButton")}
          secondaryLabel={t.text("agency.ctaSecondary")}
          secondaryTo="#contact"
        />
      </LandingWave>

      <Contact />
    </>
  );
}
