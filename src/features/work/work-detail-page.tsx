/**
 * /projects/<projet> — one project.
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
import {
  adjacentCaseStudies,
  caseStudyPath,
  findCaseStudy,
  WORK_BASE_PATH,
} from "@features/work/lib/work-routes";

import Booking from "@features/booking/components/booking-cta";
import {
  LandingSection,
  LandingWave,
} from "@features/agency/components/landing-blocks";
import Contact from "@features/contact/components/contact-section";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";
import { refreshAosAnimations } from "@shared/lib/scroll-animations";
import ArrowIcon from "@shared/components/arrow-icon";
import ImageLightbox from "@shared/components/image-lightbox";
import Error404Page from "@features/error/error-404-page";

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug?: string }>();
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);
  const { L } = useLangLink();

  const item = findCaseStudy(slug);
  const { previous, next } = adjacentCaseStudies(slug);

  // null when the viewer is closed; otherwise the index being shown.
  const [openImage, setOpenImage] = React.useState<number | null>(null);

  React.useEffect(() => {
    refreshAosAnimations();
    setOpenImage(null);
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

  const [firstPreview, ...otherPreviews] = previews;

  const lightboxImages = previews.map((src, index) => ({
    src,
    alt: `${title} — ${t.text("work.previewAlt")} ${index + 1}`,
  }));

  return (
    <>
      {/* Two columns rather than a centred block of text: the project's own
          screenshot is the illustration this page has, and it belongs beside
          the description rather than in a gallery further down. The copy comes
          first in the DOM, so the pre-rendered HTML still opens with the h1. */}
      <div className="pt-[73px] md:pt-[130px] lg:pt-[100px]">
        <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[24px] lg:pt-[36px] pb-[20px]">
          <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-y-[34px] lg:gap-x-[50px]">
            <div
              className="w-full lg:w-[46%]"
              data-aos="fade-right"
              data-aos-duration="1100"
              data-aos-easing="ease-in-sine"
            >
              <h1 className="text-heading w-full text-center lg:text-left font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[34px] xl:text-[40px] 2xl:text-[44px] mb-[16px] leading-[36px] lg:leading-[44px] xl:leading-[54px]">
                {title}
              </h1>

              <p className="text-body w-full text-center lg:text-left font-helvetica font-light leading-7 text-[13px] xl:text-[15px] 2xl:text-[16px]">
                {description}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-[14px] mt-[24px]">
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
              </div>
            </div>

            {firstPreview && (
              // Capped: a 1440-wide screenshot in a half-width column ran
              // taller than the copy beside it and took over the page.
              <div
                className="w-full lg:w-[50%] max-w-[620px]"
                data-aos="fade-left"
                data-aos-duration="1200"
                data-aos-easing="ease-in-sine"
              >
                <button
                  type="button"
                  onClick={() => setOpenImage(0)}
                  aria-label={`${title} — ${t.text("work.previewAlt")} 1`}
                  className="group block w-full overflow-hidden rounded-[14px] xl:rounded-[18px] shadow-[0_18px_48px_rgba(20,23,45,0.16)]"
                >
                  <img
                    src={firstPreview}
                    alt={`${title} — ${t.text("work.previewAlt")}`}
                    width="1440"
                    height="900"
                    // The one image above the fold on this page, so it loads
                    // eagerly and at high priority; the rest stay lazy.
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className={`w-full transition duration-500 group-hover:scale-[1.02] ${getPreviewDimClass(item, isLight)}`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {otherPreviews.length > 0 && (
        <LandingSection id="previews" title={t.text("work.previewsTitle")} tinted>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] lg:gap-[24px]">
            {otherPreviews.map((preview, index) => (
              <button
                key={preview}
                type="button"
                // +1 because the hero holds the first preview.
                onClick={() => setOpenImage(index + 1)}
                aria-label={`${title} — ${t.text("work.previewAlt")} ${index + 2}`}
                className="group block w-full overflow-hidden rounded-[14px] border border-current/10"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay={(index % 2) * 90}
                data-aos-easing="ease-in-sine"
              >
                <img
                  src={preview}
                  alt={`${title} — ${t.text("work.previewAlt")} ${index + 2}`}
                  width="1440"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className={`w-full transition duration-500 group-hover:scale-[1.02] ${getPreviewDimClass(item, isLight)}`}
                />
              </button>
            ))}
          </div>
        </LandingSection>
      )}

      {/*
        This was a section whose only content was a link to /web-development,
        under a heading announcing it. The link is worth keeping — that page is
        a real destination, and it is where this project's work is described —
        but it did not need a section of its own, and "Voir le détail de cette
        prestation" named the click rather than the destination.

        It now sits in a row with the way back to the rest of the work, which
        is what a reader at the bottom of one project actually wants.
      */}
      <LandingSection id="more" title={t.text("work.moreTitle")}>
        {/*
          One line, one axis. The two actions sit in the middle and the two
          neighbours at the edges, all vertically centred — before this the
          previous/next pair hung below the buttons and read as a second,
          unrelated block. They stay quiet text links on purpose: four buttons
          of equal weight would make none of them the obvious next step.

          On a phone it becomes two rows rather than six lines: the pair of
          actions across the top, then the previous and next projects side by
          side underneath. `order-*` already places them, because grid
          auto-placement follows order-modified document order, so no element
          moves in the DOM and nothing is duplicated for a second layout.
        */}
        <div className="flex flex-col gap-[22px] lg:flex-row lg:items-center lg:justify-between lg:gap-[24px] max-md:grid max-md:grid-cols-2 max-md:gap-x-[12px] max-md:gap-y-[18px]">
          {previous ? (
            <Link
              to={L(caseStudyPath(previous.id))}
              // The visible title is clipped on a phone, so the accessible
              // name carries it in full. Crawlers still read the untruncated
              // text: `truncate` hides it, it does not remove it.
              aria-label={`${t.text("work.previousProject")} : ${resolveLocalizedField(previous.title, language)}`}
              className="order-2 lg:order-1 lg:w-[24%] text-body font-poppins text-[13px] xl:text-[14px] transition-colors hover:text-heading-strong max-md:flex max-md:min-h-[44px] max-md:min-w-0 max-md:flex-wrap max-md:content-center max-md:items-baseline max-md:gap-x-[6px]"
            >
              <span className="block text-[12px] opacity-70 max-md:order-2">
                {t.text("work.previousProject")}
              </span>
              {/* Below md the arrow joins the label on the first line and the
                  project name drops underneath, clipped rather than wrapped to
                  three lines. Above md these are the same inline nodes as
                  before: "← Title" on the second line. */}
              <span className="max-md:order-1">←</span>{" "}
              <span className="max-md:order-3 max-md:w-full max-md:truncate">
                {resolveLocalizedField(previous.title, language)}
              </span>
            </Link>
          ) : (
            <span className="hidden lg:block lg:w-[24%]" />
          )}

          <div className="order-1 lg:order-2 flex flex-col items-stretch gap-[14px] mx-auto w-full max-w-[320px] sm:mx-0 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center max-md:col-span-2">
            <Link
              to={L(WORK_BASE_PATH)}
              className="custom-btn middle-out flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-[18px] font-poppins text-[14px] font-medium text-white"
            >
              {t.text("work.otherProjects")}
              <ArrowIcon />
            </Link>
            <Link
              to={L("#services")}
              className="custom-btn-outline flex min-h-[44px] items-center justify-center gap-2 px-[18px] font-poppins text-[14px] font-medium"
            >
              {t.text("work.servicesCta")}
              <ArrowIcon />
            </Link>
          </div>

          {next ? (
            <Link
              to={L(caseStudyPath(next.id))}
              aria-label={`${t.text("work.nextProject")} : ${resolveLocalizedField(next.title, language)}`}
              className="order-3 lg:w-[24%] text-body font-poppins text-[13px] xl:text-[14px] transition-colors hover:text-heading-strong lg:text-right max-md:flex max-md:min-h-[44px] max-md:min-w-0 max-md:flex-wrap max-md:content-center max-md:items-baseline max-md:justify-end max-md:gap-x-[6px] max-md:text-right"
            >
              <span className="block text-[12px] opacity-70 max-md:order-1">
                {t.text("work.nextProject")}
              </span>
              <span className="max-md:order-3 max-md:w-full max-md:truncate">
                {resolveLocalizedField(next.title, language)}
              </span>{" "}
              <span className="max-md:order-2">→</span>
            </Link>
          ) : (
            <span className="hidden lg:block lg:w-[24%]" />
          )}
        </div>
      </LandingSection>

      <LandingWave>
        <Booking
          title={t.text("work.ctaTitle")}
          description={t.text("work.ctaDescription")}
          buttonLabel={t.text("work.ctaButton")}
        />
      </LandingWave>

      <Contact />

      {openImage !== null && (
        <ImageLightbox
          images={lightboxImages}
          index={openImage}
          onIndexChange={setOpenImage}
          onClose={() => setOpenImage(null)}
          closeLabel={t.text("it.portfolioCloseImage")}
          previousLabel={t.text("work.previousImage")}
          nextLabel={t.text("work.nextImage")}
        />
      )}
    </>
  );
}
