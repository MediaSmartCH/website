/**
 * "Our products, ready to use" — the three SaaS solutions MediaSmart sells.
 *
 * They used to live only inside the portfolio modal, three clicks away and
 * presented like client references. They are the opposite: repeatable products
 * a visitor can buy. This section gives them their own place on the services
 * page, with the pitch, what the product actually does, and a way in (live demo
 * when there is one, a booked call otherwise).
 *
 * Copy comes from the i18n bundles; the screenshot, the public URL and the
 * access badge are read from the portfolio data so a product is described in
 * one place only.
 */

import React from "react";

import portfolioContent from "@features/it-services/data/it-portfolio.json";
import addonStats from "@features/it-services/data/addon-stats.json";
import BookingButton from "@features/booking/components/booking-button";
import LaunchCountdown from "@features/it-services/components/launch-countdown";
import {
  getItemImages,
  getPreviewDimClass,
  getSafeExternalUrl,
  resolveLocalizedField,
  type PortfolioData,
} from "@features/it-services/lib/portfolio-helpers";
import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import RichText from "@shared/components/rich-text";
import WaveBackdrop from "@shared/components/wave-backdrop";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";
import ArrowIcon from "@shared/components/arrow-icon";

/** Shape of one entry in the `it.saasProducts` translation array. */
type SaasProductCopy = {
  /** Matches an id in it-portfolio.json — that is where the visuals come from. */
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
};

/** Free tools: name and pitch only, no feature list and no sales CTA. */
type SaasFreeToolCopy = Pick<SaasProductCopy, "id" | "name" | "tagline"> & {
  /**
   * What the button says. "Voir sur Firefox Add-ons" names the shop the link
   * opens; "Ouvrir l'outil", three times in a row, named nothing.
   */
  cta?: string;
  /** Keyboard shortcuts, where the tool has any worth leading with. */
  shortcuts?: { platform: string; keys: string }[];
};

/**
 * Figures published by the store, refreshed at build time.
 *
 * `scripts/fetch-addon-stats.mjs` writes this file from the public AMO API
 * before every build, and leaves the previous values in place if Mozilla does
 * not answer. A missing entry, or a null field inside one, means the figure is
 * simply not shown — never that a zero is.
 */
type AddonFigures = {
  rating: number | null;
  ratingCount: number | null;
  users: number | null;
};

const ADDON_FIGURES: Record<string, AddonFigures | undefined> =
  (addonStats as { addons?: Record<string, AddonFigures> }).addons ?? {};

/** A star, for the rating. Decorative: the score is written next to it. */
function StarGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] shrink-0"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5l1.11-6.47-4.7-4.58 6.5-.95L12 2.6z" />
    </svg>
  );
}

/**
 * Trailing arrow on the card CTAs, marking them as a way out of the page.
 * Inline rather than an icon dependency: one glyph, and it has to inherit the
 * button's colour and slide on hover.
 */

export default function SaasProducts() {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(languageReducer);
  const classes = getPortfolioThemeClasses(themeReducer);

  const portfolioItems = (portfolioContent as PortfolioData).items ?? [];
  const products = t.array<SaasProductCopy>("it.saasProducts");
  const freeTools = t.array<SaasFreeToolCopy>("it.saasFreeTools");

  // Swiss conventions in both languages: "5,0" and "27'000" in French,
  // "5.0" and "27,000" in English.
  const locale = languageReducer === "fr" ? "fr-CH" : "en-GB";
  const counts = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const scores = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [locale]
  );

  if (products.length === 0) return null;

  return (
    <div id="saas" className="relative overflow-hidden scroll-mt-[120px]">
      {/* Wave wash behind the section, as the booking block lower on the page
          does: the products grid otherwise sits on flat white between two
          sections that both have a background of their own. */}
      <WaveBackdrop
        theme={themeReducer}
        className="top-0 h-[520px] md:h-[600px] lg:h-[660px] xl:h-[720px]"
      />

      <div
        className="relative z-10 w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto"
      >
      <RichText
        as="h2"
        className="text-heading-strong it-service-title w-full text-center mx-auto font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]"
        html={t.text("it.saasTitle")}
      />
      <p className="text-body mx-auto mt-2 max-w-[860px] text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px]">
        {t.text("it.saasDescription")}
      </p>

      <div
        className="mt-[40px] grid justify-center gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 460px))",
        }}
      >
        {products.map((product, index) => {
          const source = portfolioItems.find((item) => item.id === product.id);
          const image = source
            ? getItemImages(source, { dark: !classes.isLight })[0]
            : undefined;
          const demoUrl = getSafeExternalUrl(source?.url);
          const badge = source?.accessNote
            ? resolveLocalizedField(source.accessNote, languageReducer)
            : null;

          return (
            <article
              key={product.id}
              className={`flex h-full flex-col overflow-hidden rounded-[24px] border transition duration-300 hover:-translate-y-1 ${classes.card}`}
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              {image && (
                <div className={`aspect-[16/10] w-full overflow-hidden border-b ${classes.imageShell}`}>
                  <img
                    src={image}
                    alt={product.name}
                    width="1440"
                    height="900"
                    className={`h-full w-full object-cover object-top ${getPreviewDimClass(source, classes.isLight)}`}
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                {badge && (
                  <span
                    className={`mb-3 inline-block w-fit rounded-full border px-3 py-1 text-[11px] font-medium leading-tight ${classes.isLight ? "border-[#D9DCF2] bg-[#EEF0FF] text-[#2C3A87]" : "border-white/10 bg-white/5 text-[#DAD7FF]"}`}
                  >
                    {badge}
                  </span>
                )}

                <h3
                  className={`${classes.strongText} font-redDisplay text-[22px] font-bold leading-7`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${classes.mutedText} mt-2 font-helvetica text-[14px] font-light leading-6`}
                >
                  {product.tagline}
                </p>

                <ul className="mt-4 space-y-2">
                  {product.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className={`${classes.mutedText} flex gap-2 font-helvetica text-[13px] font-light leading-6`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[linear-gradient(90deg,#b514fd,#5f75f5)]"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Pinned to the bottom so the buttons line up across cards
                    even when one product has a longer pitch. */}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="custom-btn middle-out flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-[18px] font-poppins text-[14px] font-medium text-white"
                    >
                      {t.text("it.saasDemoCta")}
                      <ArrowIcon />
                    </a>
                  )}
                  <BookingButton
                    className="custom-btn-outline flex min-h-[44px] items-center justify-center px-[18px] font-poppins text-[14px] font-medium"
                    text={t.text("it.saasBookCta")}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {freeTools.length > 0 && (
        <div className="mt-[56px]">
          {/* The free tools used to be plain bordered boxes with a centred
              bold heading, which read as an orphan list dropped between two
              card grids. They now share the section's anatomy: the same rule
              and gradient heading as the rest of the page, and cards built like
              the product cards above — screenshot, badge, pitch, way in. */}
          <div
            className={`${classes.isLight ? "bg-[#E1E0F5]" : "bg-white/12"} mx-auto mb-[34px] h-px w-[120px]`}
            aria-hidden="true"
          />
          <RichText
            as="h3"
            className="text-heading-strong it-service-title w-full text-center mx-auto font-redDisplay font-bold text-[22px] md:text-[26px] 2xl:text-[30px]"
            html={t.text("it.saasFreeTitle")}
          />
          <p className="text-body mx-auto mt-2 max-w-[680px] text-center font-poppins font-light text-[13px] md:text-[14px]">
            {t.text("it.saasFreeDescription")}
          </p>

          <div
            className="mt-[30px] grid justify-center gap-6"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 420px))",
            }}
          >
            {freeTools.map((tool, index) => {
              const source = portfolioItems.find((item) => item.id === tool.id);
              const toolUrl = getSafeExternalUrl(source?.url);
              const toolImage = source
                ? getItemImages(source, { dark: !classes.isLight })[0]
                : undefined;
              const toolBadge = source?.accessNote
                ? resolveLocalizedField(source.accessNote, languageReducer)
                : null;

              // The pill the access note already wore, now also worn by the
              // shortcut keys and the store figures: one small label style on
              // this card, not three.
              const pill = `rounded-full border px-3 py-1 text-[11px] font-medium leading-tight ${
                classes.isLight
                  ? "border-[#D9DCF2] bg-[#EEF0FF] text-[#2C3A87]"
                  : "border-white/10 bg-white/5 text-[#DAD7FF]"
              }`;

              // Each figure stands or falls on its own: a store that publishes
              // a user count but no rating yet gets a line with the user count
              // on it, not a placeholder where the rating would go.
              const figures = ADDON_FIGURES[tool.id];
              const rating =
                figures?.rating != null && figures.ratingCount
                  ? scores.format(figures.rating)
                  : null;
              const reviews = figures?.ratingCount
                ? `${counts.format(figures.ratingCount)} ${t.text(
                    figures.ratingCount > 1 ? "it.saasStatReviews" : "it.saasStatReviewsOne"
                  )}`
                : null;
              const users =
                figures?.users != null
                  ? `${counts.format(figures.users)} ${t.text(
                      figures.users > 1 ? "it.saasStatUsers" : "it.saasStatUsersOne"
                    )}`
                  : null;
              const hasFigures = Boolean(rating || reviews || users);

              const inner = (
                <>
                  {toolImage && (
                    <div className={`aspect-[16/10] w-full overflow-hidden border-b ${classes.imageShell}`}>
                      <img
                        src={toolImage}
                        alt={tool.name}
                        width="1440"
                        height="900"
                        // Centre-cropped, like the portfolio tiles: anchoring to
                        // the top of these screenshots frames a sign-in dialog
                        // rather than the tool itself.
                        className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${getPreviewDimClass(source, classes.isLight)}`}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {/* The row is reserved whether or not this tool carries an
                        access note. At three cards across — 1920 and up — the
                        one without a badge started its title 24px above its
                        neighbours. */}
                    <div className="mb-3 flex min-h-[24px] items-start">
                      {toolBadge && (
                        <span className={`inline-block w-fit ${pill}`}>{toolBadge}</span>
                      )}
                    </div>

                    <h4
                      className={`${classes.strongText} font-redDisplay text-[20px] font-bold leading-6`}
                    >
                      {tool.name}
                    </h4>
                    <p
                      className={`${classes.mutedText} mt-2 font-helvetica text-[14px] font-light leading-6`}
                    >
                      {tool.tagline}
                    </p>

                    {/* The fastest way to use the tool, spelled out. The
                        context menu is in the pitch; the keys are here,
                        because they are what the pitch is about. */}
                    {tool.shortcuts && tool.shortcuts.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {tool.shortcuts.map((shortcut) => (
                          <li
                            key={shortcut.platform}
                            className={`inline-flex items-center gap-[6px] ${pill}`}
                          >
                            <span className="opacity-70">{shortcut.platform}</span>
                            {/* Tailwind's preflight sets kbd in mono; the card
                                is in Poppins, and a keyboard shortcut is not a
                                code sample. */}
                            <kbd className="font-poppins font-semibold not-italic">
                              {shortcut.keys}
                            </kbd>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* What the store says about the tool, in the store's own
                        numbers, refreshed at build time. It sits here rather
                        than beside the access badge because at some card
                        widths the two together wrap to a second line, and the
                        titles of a row stop lining up. Small, and never the
                        subject of the card. */}
                    {hasFigures && (
                      <p
                        className={`${classes.mutedText} mt-3 flex flex-wrap items-center gap-x-[6px] gap-y-1 font-poppins text-[12px] leading-tight`}
                      >
                        {rating && (
                          <span className="inline-flex items-center gap-[4px]">
                            <StarGlyph />
                            {/* The glyph is decoration; "5,0/5" is the score,
                                and a screen reader is told which score it
                                is. */}
                            <span aria-hidden="true">{rating}/5</span>
                            <span className="sr-only">
                              {`${t.text("it.saasStatRatingSr")} ${rating}`}
                            </span>
                          </span>
                        )}
                        {rating && reviews && <span aria-hidden="true">·</span>}
                        {reviews && <span>{reviews}</span>}
                        {(rating || reviews) && users && <span aria-hidden="true">·</span>}
                        {users && <span>{users}</span>}
                      </p>
                    )}

                    {/* Only a tool that is not public yet carries a launchDate. */}
                    {source?.launchDate && (
                      <LaunchCountdown
                        launchDate={source.launchDate}
                        language={languageReducer}
                        classes={classes}
                      />
                    )}

                    {/* Pinned to the bottom so the buttons line up across cards
                        even when one pitch is longer, as in the block above. */}
                    {toolUrl && (
                      <div className="mt-auto pt-6">
                        {/* The only action on this card, so it takes the
                            primary treatment the paid products use. It is a
                            span inside the card link: the lift and the arrow
                            come from the card hover (.custom-btn-in-card). */}
                        <span className="custom-btn custom-btn-in-card flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-[5px] px-[18px] font-poppins text-[14px] font-medium text-white">
                          <span className="custom-btn-inner flex items-center gap-2">
                            {tool.cta || t.text("it.saasFreeCta")}
                            <ArrowIcon />
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </>
              );

              // A tool without a public URL still earns its card — it just is
              // not a link yet.
              return toolUrl ? (
                <a
                  key={tool.id}
                  href={toolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full flex-col overflow-hidden rounded-[24px] border transition duration-300 hover:-translate-y-1 ${classes.card}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 120}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={tool.id}
                  className={`group flex h-full flex-col overflow-hidden rounded-[24px] border ${classes.card}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 120}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
