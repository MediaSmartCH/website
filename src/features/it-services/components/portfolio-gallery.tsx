import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import portfolioContent from "@features/it-services/data/it-portfolio.json";
import { useModalScrollLock } from "@features/it-services/hooks/use-modal-scroll-lock";
import PortfolioModal from "@features/it-services/components/portfolio-modal";
import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";
import {
  formatImageCount,
  formatPreviewCount,
  formatProjectsCount,
  formatRemainingProjects,
  formatRemainingProjectsCta,
  getInlineGalleryClassName,
  getItemImages,
  getSafeExternalUrl,
  PREVIEW_LIMIT,
  resolveLocalizedField,
  resolveScreenshotUrl,
  SCROLLABLE_GALLERY_THRESHOLD,
  truncateText,
  type LightboxImage,
  type PortfolioData,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";

import { useTranslations } from "@shared/i18n/translator";
import LocaleThemeControls from "@shared/components/locale-theme-controls";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";

const PortfolioGallery = () => {
  const dialogTitleId = useId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Lightbox is a fullscreen single-image overlay opened by clicking any
  // screenshot. We pass src+alt so we can show the same content the user
  // hovered on, full-size and inspectable.
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  const {
    currentLanguage: languageReducer,
    currentTheme: themeReducer,
    themePreference,
    changeLanguage,
    changeTheme,
    labels,
  } = useInterfaceControls();

  const t = useTranslations(languageReducer);

  // All portfolio items, including those without screenshots (e.g. private
  // bespoke projects shown with title + description + accessNote badge in
  // the modal but not in the homepage preview tiles).
  const portfolioItems = useMemo(() => {
    const data = portfolioContent as PortfolioData;
    return data.items ?? [];
  }, []);

  useModalScrollLock(isModalOpen || lightbox !== null);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Lightbox layers above the portfolio modal; close the topmost
        // surface first instead of dismissing both at once.
        if (lightbox) {
          setLightbox(null);
        } else {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, lightbox]);

  if (!portfolioItems.length) {
    return null;
  }

  // Preview tiles are image-driven, so we hide items that have no screenshot
  // to show. They still appear in the full modal as text-only cards.
  const previewCandidates = portfolioItems.filter(
    (item) => getItemImages(item).length > 0
  );
  const previewItems = previewCandidates.slice(0, PREVIEW_LIMIT);
  const hiddenProjectsCount = Math.max(
    portfolioItems.length - previewItems.length,
    0
  );
  const hasHiddenProjects = hiddenProjectsCount > 0;
  const classes = getPortfolioThemeClasses(themeReducer);
  const previewButtonText = t.text("it.portfolioBtn");

  // Full modal rendered via portal so it escapes any overflow:hidden ancestors

  return (
    <>
      <div className="mt-[10px] px-[20px] lg:px-[50px] 2xl:px-[100px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[780px]">
            <p
              className={`${classes.strongText} w-full font-redDisplay font-bold text-[18px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]`}
            >
              {t.text("it.portfolioTxt")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p
                className={`${classes.mutedText} text-[12px] font-helvetica font-light leading-6 md:text-[13px] xl:text-[14px]`}
              >
                {formatProjectsCount(portfolioItems.length, languageReducer)}
              </p>
              {hasHiddenProjects && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${classes.isLight ? "bg-[#EEF0FF] text-[#4453A6]" : "bg-white/10 text-[#DAD7FF]"}`}
                >
                  {formatPreviewCount(previewItems.length, portfolioItems.length, languageReducer)}
                </span>
              )}
            </div>
          </div>

        </div>

        <div
          className="mt-6 grid justify-center gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 220px), 260px))",
          }}
        >
          {previewItems.map((item) => {
            const title = resolveLocalizedField(item.title, languageReducer);
            const description = resolveLocalizedField(
              item.description,
              languageReducer
            );
            const safeItemUrl = getSafeExternalUrl(item.url);
            const previewImages = getItemImages(item);

            const previewCard = (
              <>
                <div className={`aspect-[16/11] w-full overflow-hidden ${classes.imageShell}`}>
                  <img
                    src={previewImages[0]}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`${classes.strongText} font-redDisplay text-[18px] font-bold leading-6`}
                    >
                      {title}
                    </h3>
                    {previewImages.length > 1 && (
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${classes.isLight ? "bg-[#EEF0FF] text-[#4453A6]" : "bg-white/10 text-[#DAD7FF]"}`}
                      >
                        {previewImages.length}
                      </span>
                    )}
                  </div>
                  <p
                    className={`${classes.mutedText} text-[13px] font-helvetica font-light leading-6`}
                  >
                    {truncateText(description, 120)}
                  </p>
                </div>
              </>
            );

            return safeItemUrl ? (
              <a
                key={item.id}
                href={safeItemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-[20px] border text-left transition duration-300 hover:-translate-y-1 ${classes.card}`}
                aria-label={`${t.text("it.portfolioVisitSite")} ${title}`}
              >
                {previewCard}
              </a>
            ) : (
              <div
                key={item.id}
                className={`group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-[20px] border text-left ${classes.card}`}
              >
                {previewCard}
              </div>
            );
          })}

          {hasHiddenProjects && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`group relative flex w-full max-w-[260px] flex-col justify-between overflow-hidden rounded-[20px] border p-5 text-left transition duration-300 hover:-translate-y-1 ${classes.teaserCard}`}
              aria-label={formatRemainingProjectsCta(hiddenProjectsCount, languageReducer)}
            >
              <div className="pointer-events-none absolute right-[-38px] top-[-38px] h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">
                  {languageReducer === "fr" ? "Galerie complete" : "Full gallery"}
                </p>
                <p className="mt-5 font-redDisplay text-[24px] font-bold leading-7">
                  {formatRemainingProjects(hiddenProjectsCount, languageReducer)}
                </p>
                <p
                  className={`mt-3 text-[13px] font-helvetica font-light leading-6 ${classes.teaserMutedText}`}
                >
                  {formatPreviewCount(previewItems.length, portfolioItems.length, languageReducer)}
                </p>
              </div>

              <span className="relative mt-6 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[12px] font-medium backdrop-blur-sm transition duration-200 group-hover:bg-white/15">
                {previewButtonText}
              </span>
            </button>
          )}
        </div>
      </div>

      {isModalOpen &&
        createPortal(
          <PortfolioModal
            items={portfolioItems}
            language={languageReducer}
            classes={classes}
            dialogTitleId={dialogTitleId}
            localeControls={{
              currentLanguage: languageReducer,
              currentTheme: themeReducer,
              themePreference,
              onLanguageChange: changeLanguage,
              onThemeChange: changeTheme,
              labels,
            }}
            onClose={() => setIsModalOpen(false)}
            onOpenImage={setLightbox}
          />,
          document.body
        )}
      {lightbox &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            onClick={(event) => {
              // Click on backdrop = close. Clicks bubbled from the image
              // itself are ignored thanks to the target===currentTarget check
              // (same pattern as the booking modal).
              if (event.target === event.currentTarget) {
                setLightbox(null);
              }
            }}
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-[100001] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default PortfolioGallery;
