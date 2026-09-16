/**
 * The full portfolio, rendered through a portal so it escapes any
 * overflow:hidden ancestor. Each entry lists its description, its access note
 * and its screenshots; clicking a screenshot opens the lightbox.
 */

import React from "react";

import { formatImageCount, getInlineGalleryClassName, getItemImages, getSafeExternalUrl, resolveLocalizedField, type LightboxImage, type PortfolioItem } from "@features/it-services/lib/portfolio-helpers";
import { SCROLLABLE_GALLERY_THRESHOLD } from "@features/it-services/lib/portfolio-helpers";
import type { PortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import ModalShell from "@shared/components/modal-shell";
import { useTranslations } from "@shared/i18n/translator";

export interface PortfolioModalProps {
  items: PortfolioItem[];
  language: string;
  classes: PortfolioThemeClasses;
  /** Id of the heading that labels this dialog, owned by the gallery. */
  dialogTitleId: string;
  onClose: () => void;
  onOpenImage: (image: LightboxImage) => void;
}

export default function PortfolioModal({
  items: portfolioItems,
  language: languageReducer,
  classes,
  dialogTitleId,
  onClose,
  onOpenImage,
}: PortfolioModalProps) {
  const t = useTranslations(languageReducer);
  const {
    isLight: isLightTheme,
    card: cardSurfaceClass,
    mutedText: mutedTextClass,
    strongText: strongTextClass,
    imageShell: imageShellClass,
  } = classes;

  return (
    <ModalShell
      titleId={dialogTitleId}
      size="wide"
      title={t.text("it.portfolioModalHeading")}
      headerFooter={
        <p
          className={`${mutedTextClass} mt-3 max-w-3xl text-[13px] font-helvetica font-light leading-6 md:text-[15px]`}
        >
          {t.text("it.portfolioModalDescription")}
        </p>
      }
      closeLabel={languageReducer === "fr" ? "Fermer" : "Close"}
      onClose={onClose}
    >
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
    </ModalShell>
  );
}
