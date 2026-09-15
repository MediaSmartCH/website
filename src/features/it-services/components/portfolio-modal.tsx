/**
 * The full portfolio, rendered through a portal so it escapes any
 * overflow:hidden ancestor. Each entry lists its description, its access note
 * and its screenshots; clicking a screenshot opens the lightbox.
 */

import React from "react";

import {
  formatImageCount,
  formatProjectsCount,
  getInlineGalleryClassName,
  getItemImages,
  getSafeExternalUrl,
  resolveLocalizedField,
  type LightboxImage,
  type PortfolioItem,
} from "@features/it-services/lib/portfolio-helpers";
import { SCROLLABLE_GALLERY_THRESHOLD } from "@features/it-services/lib/portfolio-helpers";
import type { PortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";
import LocaleThemeControls from "@shared/components/locale-theme-controls";
import { useTranslations } from "@shared/i18n/translator";

export interface PortfolioModalProps {
  items: PortfolioItem[];
  language: string;
  classes: PortfolioThemeClasses;
  /** Id of the heading that labels this dialog, owned by the gallery. */
  dialogTitleId: string;
  /** Header language + theme pills, forwarded straight to LocaleThemeControls. */
  localeControls: Omit<
    React.ComponentProps<typeof LocaleThemeControls>,
    "size" | "className"
  >;
  onClose: () => void;
  onOpenImage: (image: LightboxImage) => void;
}

export default function PortfolioModal({
  items: portfolioItems,
  language: languageReducer,
  classes,
  dialogTitleId,
  localeControls,
  onClose,
  onOpenImage,
}: PortfolioModalProps) {
  const t = useTranslations(languageReducer);
  const {
    isLight: isLightTheme,
    card: cardSurfaceClass,
    panel: panelSurfaceClass,
    mutedText: mutedTextClass,
    strongText: strongTextClass,
    imageShell: imageShellClass,
    backdrop: backdropClass,
  } = classes;

  return (
    <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <button
            type="button"
            aria-label={languageReducer === "fr" ? "Fermer la fenetre" : "Close dialog"}
            className={`absolute inset-0 ${backdropClass} backdrop-blur-xl`}
            onClick={() => onClose()}
          />

          <div
            className={`relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border ${panelSurfaceClass}`}
          >
            <div
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 border-b px-5 py-5 md:px-8 md:py-6 ${isLightTheme ? "border-[#E6E8F7]" : "border-white/10"}`}
            >
              <h2
                id={dialogTitleId}
                className="min-w-0 font-redDisplay text-[28px] font-bold leading-none md:text-[40px] xl:text-[48px]"
              >
                {t.text("it.portfolioModalHeading")}
              </h2>

              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
                <LocaleThemeControls
                  {...localeControls}
                  size="xs"
                  className="order-2 sm:order-1"
                />
                <button
                  type="button"
                  onClick={() => onClose()}
                  className={`order-1 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border transition duration-200 sm:order-2 sm:h-11 sm:w-11 ${isLightTheme ? "border-[#D9DCF2] text-[#14172D] hover:bg-[#F4F4FF]" : "border-white/10 text-[#F6F6F6] hover:bg-white/10"}`}
                  aria-label={languageReducer === "fr" ? "Fermer" : "Close"}
                >
                  <svg
                    className="h-3.5 w-3.5 sm:h-5 sm:w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p
                className={`${mutedTextClass} col-span-2 max-w-3xl text-[13px] font-helvetica font-light leading-6 md:text-[15px]`}
              >
                {t.text("it.portfolioModalDescription")}
              </p>
            </div>

            <div className="portfolio-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-5 md:px-8 md:pb-8 md:pt-6">
              <div
                className="grid justify-center gap-5"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 280px), 360px))",
                }}
              >
                {portfolioItems.map((item) => {
                  const title = resolveLocalizedField(item.title, languageReducer);
                  const description = resolveLocalizedField(
                    item.description,
                    languageReducer
                  );
                  const images = getItemImages(item);
                  const safeItemUrl = getSafeExternalUrl(item.url);
                  const accessNote = item.accessNote
                    ? resolveLocalizedField(item.accessNote, languageReducer)
                    : null;
                  // Switch to a horizontally scrollable row when the image count exceeds the threshold
                  const shouldScrollGallery =
                    images.length > SCROLLABLE_GALLERY_THRESHOLD;

                  return (
                    <div
                      key={item.id}
                      className={`flex h-full w-full flex-col rounded-[24px] border p-5 ${cardSurfaceClass}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3
                            className={`${strongTextClass} font-redDisplay text-[22px] font-bold leading-7`}
                          >
                            {title}
                          </h3>
                          {images.length > 0 && (
                            <p
                              className={`${mutedTextClass} mt-1 text-[12px] font-helvetica font-light uppercase tracking-[0.18em]`}
                            >
                              {formatImageCount(images.length, languageReducer)}
                            </p>
                          )}
                        </div>

                        {safeItemUrl && (
                          <a
                            href={safeItemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`shrink-0 rounded-full border px-3 py-2 text-[12px] font-medium transition duration-200 ${isLightTheme ? "border-[#D9DCF2] text-[#2C3A87] hover:bg-[#EEF0FF]" : "border-white/10 text-[#DAD7FF] hover:bg-white/10"}`}
                          >
                            {t.text("it.portfolioVisitSite")}
                          </a>
                        )}
                      </div>

                      {/* Access-note badge lives below the title row so a long
                          label (e.g. "Solution sur mesure – démo bientôt en
                          ligne") can wrap naturally without overlapping the
                          project title above it. */}
                      {accessNote && (
                        <div className="mt-3">
                          <span
                            className={`inline-block max-w-full rounded-full border px-3 py-1 text-[11px] font-medium leading-tight ${isLightTheme ? "border-[#D9DCF2]/70 bg-[#EEF0FF]/40 text-[#2C3A87]/80" : "border-white/10 bg-white/5 text-[#DAD7FF]/85"}`}
                          >
                            {accessNote}
                          </span>
                        </div>
                      )}

                      <p
                        className={`${mutedTextClass} mt-4 text-[14px] font-helvetica font-light leading-6`}
                      >
                        {description}
                      </p>

                      {/* Image gallery: hidden for items with no screenshots
                          (e.g. private bespoke solutions) so the card doesn't
                          leave a confusing empty area at the bottom.
                          Clicking any image opens the lightbox at full size —
                          this works uniformly for public and private projects
                          (the "Visiter le site" button at the top stays the
                          explicit path to open the actual website). */}
                      <div className={`mt-auto ${images.length > 0 ? "pt-5" : ""}`}>
                        {images.length === 0 ? null : shouldScrollGallery ? (
                          <div className="portfolio-scrollbar flex gap-3 overflow-x-auto overscroll-contain pb-2 pr-1 snap-x snap-mandatory">
                            {images.map((image, index) => (
                              <button
                                key={`${item.id}-${index}`}
                                type="button"
                                onClick={() => onOpenImage({ src: image, alt: `${title} ${index + 1}` })}
                                className={`group/img snap-start shrink-0 cursor-zoom-in overflow-hidden rounded-[18px] border ${imageShellClass} w-[250px] sm:w-[270px]`}
                                aria-label={`${t.text("it.portfolioVisitSite")} ${title} ${index + 1}`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover transition duration-300 group-hover/img:scale-105"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className={getInlineGalleryClassName(images.length)}>
                            {images.map((image, index) => (
                              <button
                                key={`${item.id}-${index}`}
                                type="button"
                                onClick={() => onOpenImage({ src: image, alt: `${title} ${index + 1}` })}
                                className={`group/img cursor-zoom-in overflow-hidden rounded-[18px] border ${imageShellClass}`}
                                aria-label={`${title} ${index + 1}`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover transition duration-300 group-hover/img:scale-105"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
  );
}
