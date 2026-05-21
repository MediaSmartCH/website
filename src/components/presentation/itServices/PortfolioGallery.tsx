import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import portfolioContent from "../../../data/itPortfolio.json";
import { useTranslations } from "services/locales/safe";
import LocaleThemeControls from "components/common/LocaleThemeControls";
import { useInterfaceControls } from "services/hooks/useInterfaceControls";

type SupportedLanguage = "fr" | "en";
type LocalizedField = string | Partial<Record<SupportedLanguage, string>>;

interface PortfolioItem {
  id: string;
  title: LocalizedField;
  description: LocalizedField;
  url?: string;
  images?: string[];
  screenshotUrls?: string[];
  /**
   * Optional short note shown as a non-clickable badge when the project is
   * not freely accessible (private / bespoke / restricted-access). Renders
   * either alongside or instead of the Visit Site button depending on
   * whether a public URL is also provided.
   */
  accessNote?: LocalizedField;
}

interface PortfolioData {
  items: PortfolioItem[];
}

const PREVIEW_LIMIT = 4;
const SCROLLABLE_GALLERY_THRESHOLD = 3;

// Returns the resolved image paths for a portfolio item, preferring generated screenshot paths
function getItemImages(item: PortfolioItem): string[] {
  if (item.screenshotUrls && item.screenshotUrls.length > 0) {
    return item.screenshotUrls.map((_, i) => `/screenshots/${item.id}-${i}.jpg`);
  }

  return item.images ?? [];
}

// Resolves a relative screenshot URL against the item's base URL
function getSafeExternalUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

// Resolves a relative screenshot URL against the item's base URL
function resolveScreenshotUrl(
  screenshotUrl: string,
  baseUrl?: string
): string | null {
  if (screenshotUrl.startsWith("http://") || screenshotUrl.startsWith("https://")) {
    return getSafeExternalUrl(screenshotUrl);
  }

  try {
    const base = new URL(baseUrl ?? "");
    const path = screenshotUrl.startsWith("/") ? screenshotUrl : `/${screenshotUrl}`;
    return getSafeExternalUrl(`${base.origin}${path}`);
  } catch {
    return null;
  }
}

// Returns the string value for the current language, falling back to fr then en
function resolveLocalizedField(
  field: LocalizedField,
  language: string
): string {
  if (typeof field === "string") {
    return field;
  }

  return field[language as SupportedLanguage] ?? field.fr ?? field.en ?? "";
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function formatProjectsCount(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "projets" : "projet"}`;
  }

  return `${count} ${count > 1 ? "projects" : "project"}`;
}

function formatImageCount(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "apercus" : "apercu"}`;
  }

  return `${count} ${count > 1 ? "previews" : "preview"}`;
}

function formatPreviewCount(
  shownCount: number,
  totalCount: number,
  language: string
): string {
  if (language === "fr") {
    return `Apercu de ${shownCount} sur ${totalCount}`;
  }

  return `Showing ${shownCount} of ${totalCount}`;
}

function formatRemainingProjects(count: number, language: string): string {
  if (language === "fr") {
    return `${count} ${count > 1 ? "autres projets" : "autre projet"}`;
  }

  return `${count} ${count > 1 ? "more projects" : "more project"}`;
}

function formatRemainingProjectsCta(count: number, language: string): string {
  if (language === "fr") {
    return `Voir les ${count} autres`;
  }

  return `View ${count} more`;
}

// Returns Tailwind grid class based on how many images a card holds
function getInlineGalleryClassName(imageCount: number): string {
  if (imageCount <= 1) {
    return "grid grid-cols-1 gap-3";
  }

  if (imageCount === 2) {
    return "grid grid-cols-1 gap-3 sm:grid-cols-2";
  }

  return "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";
}

// Locks body scroll while the modal is open and restores original styles on cleanup
function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    const originalBodyStyles = {
      overscrollBehavior: document.body.style.overscrollBehavior,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      touchAction: document.body.style.touchAction,
    };
    // Add padding to compensate for the scrollbar disappearing and prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overscrollBehavior =
        originalBodyStyles.overscrollBehavior;
      document.body.style.overflow = originalBodyStyles.overflow;
      document.body.style.paddingRight = originalBodyStyles.paddingRight;
      document.body.style.touchAction = originalBodyStyles.touchAction;
    };
  }, [isLocked]);
}

const PortfolioGallery = () => {
  const dialogTitleId = useId();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

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
  const isLightTheme = themeReducer === "light";
  const cardSurfaceClass = isLightTheme
    ? "border-[#D8DBF4] bg-white shadow-[0_18px_50px_rgba(20,23,45,0.08)]"
    : "border-white/10 bg-[#201D39] shadow-[0_18px_50px_rgba(0,0,0,0.28)]";
  const panelSurfaceClass = isLightTheme
    ? "border-white/70 bg-white text-[#14172D]"
    : "border-white/10 bg-[#221F3D] text-[#F6F6F6]";
  const mutedTextClass = isLightTheme ? "text-[#5C5777]" : "text-[#D6D4E4]";
  const strongTextClass = isLightTheme ? "text-[#14172D]" : "text-[#F6F6F6]";
  const imageShellClass = isLightTheme
    ? "border-[#E3E6FA] bg-[#F4F4FF]"
    : "border-white/10 bg-[#2B284C]";
  const backdropClass = isLightTheme
    ? "bg-[rgba(15,23,42,0.18)]"
    : "bg-[rgba(3,7,18,0.34)]";
  const teaserCardClass = isLightTheme
    ? "border-transparent bg-[linear-gradient(135deg,#14172D_0%,#5F75F5_55%,#B514FD_100%)] text-white shadow-[0_20px_60px_rgba(95,117,245,0.28)]"
    : "border-white/10 bg-[linear-gradient(135deg,#221F3D_0%,#34306A_55%,#5F75F5_100%)] text-white shadow-[0_20px_60px_rgba(8,10,20,0.4)]";
  const teaserMutedTextClass = isLightTheme
    ? "text-white/80"
    : "text-[#E6E3FF]";
  const previewButtonText = t.text("it.portfolioBtn");

  // Full modal rendered via portal so it escapes any overflow:hidden ancestors
  const modal = (
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
        onClick={() => setIsModalOpen(false)}
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
              currentLanguage={languageReducer}
              currentTheme={themeReducer}
              themePreference={themePreference}
              onLanguageChange={changeLanguage}
              onThemeChange={changeTheme}
              size="xs"
              labels={labels}
              className="order-2 sm:order-1"
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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

                    {safeItemUrl ? (
                      <a
                        href={safeItemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`shrink-0 rounded-full border px-3 py-2 text-[12px] font-medium transition duration-200 ${isLightTheme ? "border-[#D9DCF2] text-[#2C3A87] hover:bg-[#EEF0FF]" : "border-white/10 text-[#DAD7FF] hover:bg-white/10"}`}
                      >
                        {t.text("it.portfolioVisitSite")}
                      </a>
                    ) : accessNote ? (
                      <span
                        className={`shrink-0 rounded-full border px-3 py-2 text-[12px] font-medium ${isLightTheme ? "border-[#D9DCF2]/70 bg-[#EEF0FF]/40 text-[#2C3A87]/80" : "border-white/10 bg-white/5 text-[#DAD7FF]/85"}`}
                      >
                        {accessNote}
                      </span>
                    ) : null}
                  </div>

                  <p
                    className={`${mutedTextClass} mt-4 text-[14px] font-helvetica font-light leading-6`}
                  >
                    {description}
                  </p>

                  {/* Image gallery: hidden for items with no screenshots
                      (e.g. private bespoke solutions) so the card doesn't
                      leave a confusing empty area at the bottom. */}
                  <div className={`mt-auto ${images.length > 0 ? "pt-5" : ""}`}>
                    {images.length === 0 ? null : shouldScrollGallery ? (
                      <div className="portfolio-scrollbar flex gap-3 overflow-x-auto overscroll-contain pb-2 pr-1 snap-x snap-mandatory">
                        {images.map((image, index) => {
                          const targetUrl = item.screenshotUrls?.[index]
                            ? resolveScreenshotUrl(item.screenshotUrls[index], item.url)
                            : safeItemUrl;
                          return (
                            targetUrl ? (
                              <a
                                key={`${item.id}-${index}`}
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group/img snap-start shrink-0 overflow-hidden rounded-[18px] border ${imageShellClass} w-[250px] sm:w-[270px]`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover transition duration-300 group-hover/img:scale-105"
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <div
                                key={`${item.id}-${index}`}
                                className={`snap-start shrink-0 overflow-hidden rounded-[18px] border ${imageShellClass} w-[250px] sm:w-[270px]`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )
                          );
                        })}
                      </div>
                    ) : (
                      <div className={getInlineGalleryClassName(images.length)}>
                        {images.map((image, index) => {
                          const targetUrl = item.screenshotUrls?.[index]
                            ? resolveScreenshotUrl(item.screenshotUrls[index], item.url)
                            : safeItemUrl;
                          return (
                            targetUrl ? (
                              <a
                                key={`${item.id}-${index}`}
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group/img overflow-hidden rounded-[18px] border ${imageShellClass}`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover transition duration-300 group-hover/img:scale-105"
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <div
                                key={`${item.id}-${index}`}
                                className={`overflow-hidden rounded-[18px] border ${imageShellClass}`}
                              >
                                <img
                                  src={image}
                                  alt={`${title} ${index + 1}`}
                                  className="aspect-[16/11] min-h-[140px] w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )
                          );
                        })}
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

  return (
    <>
      <div className="mt-[10px] px-[20px] lg:px-[50px] 2xl:px-[100px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[780px]">
            <p
              className={`${strongTextClass} w-full font-redDisplay font-bold text-[18px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]`}
            >
              {t.text("it.portfolioTxt")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p
                className={`${mutedTextClass} text-[12px] font-helvetica font-light leading-6 md:text-[13px] xl:text-[14px]`}
              >
                {formatProjectsCount(portfolioItems.length, languageReducer)}
              </p>
              {hasHiddenProjects && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${isLightTheme ? "bg-[#EEF0FF] text-[#4453A6]" : "bg-white/10 text-[#DAD7FF]"}`}
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
                <div className={`aspect-[16/11] w-full overflow-hidden ${imageShellClass}`}>
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
                      className={`${strongTextClass} font-redDisplay text-[18px] font-bold leading-6`}
                    >
                      {title}
                    </h3>
                    {previewImages.length > 1 && (
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${isLightTheme ? "bg-[#EEF0FF] text-[#4453A6]" : "bg-white/10 text-[#DAD7FF]"}`}
                      >
                        {previewImages.length}
                      </span>
                    )}
                  </div>
                  <p
                    className={`${mutedTextClass} text-[13px] font-helvetica font-light leading-6`}
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
                className={`group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-[20px] border text-left transition duration-300 hover:-translate-y-1 ${cardSurfaceClass}`}
                aria-label={`${t.text("it.portfolioVisitSite")} ${title}`}
              >
                {previewCard}
              </a>
            ) : (
              <div
                key={item.id}
                className={`group relative flex w-full max-w-[260px] flex-col overflow-hidden rounded-[20px] border text-left ${cardSurfaceClass}`}
              >
                {previewCard}
              </div>
            );
          })}

          {hasHiddenProjects && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`group relative flex w-full max-w-[260px] flex-col justify-between overflow-hidden rounded-[20px] border p-5 text-left transition duration-300 hover:-translate-y-1 ${teaserCardClass}`}
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
                  className={`mt-3 text-[13px] font-helvetica font-light leading-6 ${teaserMutedTextClass}`}
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

      {isModalOpen && createPortal(modal, document.body)}
    </>
  );
};

export default PortfolioGallery;
