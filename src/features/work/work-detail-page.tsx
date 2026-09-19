/**
 * /realisations/<projet> — one project.
 *
 * What is here is what the project file actually records: the title, the
 * description written when the project shipped, the screenshots captured from
 * the live site, and the link to it. Nothing else — no invented brief, no
 * invented outcome, no figures. A case study that says what the work achieved
 * needs the client's own numbers, and those are not in this repository.
 *
 * That makes these pages shorter than a full case study, and deliberately so:
 * a short page that is true is worth more, to a reader and to a search engine,
 * than a long one that is filled in.
 */

import React from "react";
import { Link, useParams } from "react-router-dom";

import {
  getItemImages,
  getPreviewDimClass,
  getSafeExternalUrl,
  resolveLocalizedField,
} from "@features/it-services/lib/portfolio-helpers";
import { findCaseStudy, WORK_BASE_PATH } from "@features/work/lib/work-routes";

import LandingCta from "@features/agency/components/landing-cta";
import { LandingHero, LandingSection } from "@features/agency/components/landing-blocks";
import Contact from "@features/contact/components/contact-section";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import Error404Page from "@features/error/error-404-page";

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug?: string }>();
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);
  const { L } = useLangLink();

  const item = findCaseStudy(slug);

  React.useEffect(() => {
    refreshAosAnimations();
  }, [slug]);

  // An unknown slug is a page that does not exist, and has to say so with a
  // 404 rather than an empty shell — the exact soft-404 the routing table was
  // cleaned up to avoid.
  if (!item) {
    return <Error404Page />;
  }

  const isLight = theme === "light";
  const title = resolveLocalizedField(item.title, language);
  const description = resolveLocalizedField(item.description, language);
  const accessNote = item.accessNote
    ? resolveLocalizedField(item.accessNote, language)
    : null;
  const liveUrl = getSafeExternalUrl(item.url);
  const previews = getItemImages(item, { dark: !isLight });

  return (
    <>
      <LandingHero title={title} lead={description} intro="" />

      <section className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[10px]">
        <div className="flex flex-wrap items-center justify-center gap-[16px]">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="custom-btn2 middle-out px-[25px] h-[43px] lg:h-[46px] rounded-[5px] text-[#fff] font-poppins font-light text-[14px] xl:text-[15px] flex items-center justify-center"
            >
              {t.text("work.visitSite")}
            </a>
          )}
          {accessNote && (
            <span className="text-body font-poppins font-light text-[13px] xl:text-[14px] rounded-[999px] border border-current/20 px-[14px] py-[8px]">
              {accessNote}
            </span>
          )}
          <Link
            to={L(WORK_BASE_PATH)}
            className="gradient-text font-poppins font-medium text-[14px] xl:text-[15px] underline underline-offset-4 py-[10px]"
          >
            {t.text("work.backToIndex")}
          </Link>
        </div>
      </section>

      {previews.length > 0 && (
        <LandingSection id="previews" title={t.text("work.previewsTitle")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] lg:gap-[24px]">
            {previews.map((preview, index) => (
              <img
                key={preview}
                src={preview}
                alt={`${title} — ${t.text("work.previewAlt")} ${index + 1}`}
                width="1440"
                height="900"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className={`w-full rounded-[14px] border border-current/10 ${getPreviewDimClass(item, isLight)}`}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              />
            ))}
          </div>
        </LandingSection>
      )}

      <LandingSection
        id="service"
        title={t.text("work.detailServicesTitle")}
        description={t.text("work.detailServicesDescription")}
      >
        <div className="w-full flex justify-center">
          <Link
            to={L("/web-development")}
            className="gradient-text font-poppins font-medium text-[14px] xl:text-[15px] underline underline-offset-4 py-[10px]"
          >
            {t.text("work.detailServicesCta")}
          </Link>
        </div>
      </LandingSection>

      <LandingCta
        title={t.text("work.ctaTitle")}
        description={t.text("work.ctaDescription")}
        bookingLabel={t.text("work.ctaButton")}
        secondaryLabel={t.text("agency.ctaSecondary")}
        secondaryTo="#contact"
      />

      <Contact />
    </>
  );
}
