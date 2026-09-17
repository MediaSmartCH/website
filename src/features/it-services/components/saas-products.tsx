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
import BookingButton from "@features/booking/components/booking-button";
import LaunchCountdown from "@features/it-services/components/launch-countdown";
import {
  getItemImages,
  getSafeExternalUrl,
  resolveLocalizedField,
  type PortfolioData,
} from "@features/it-services/lib/portfolio-helpers";
import { getPortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import RichText from "@shared/components/rich-text";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

/** Shape of one entry in the `it.saasProducts` translation array. */
type SaasProductCopy = {
  /** Matches an id in it-portfolio.json — that is where the visuals come from. */
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
};

/** Free tools: name and pitch only, no feature list and no sales CTA. */
type SaasFreeToolCopy = Pick<SaasProductCopy, "id" | "name" | "tagline">;

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

  if (products.length === 0) return null;

  return (
    <div
      id="saas"
      className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto scroll-mt-[120px]"
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
          const image = source ? getItemImages(source)[0] : undefined;
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
                    className="h-full w-full object-cover object-top"
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
                      className="custom-btn middle-out flex min-h-[40px] items-center justify-center rounded-[5px] px-[18px] font-poppins text-[14px] font-light text-white"
                    >
                      {t.text("it.saasDemoCta")}
                    </a>
                  )}
                  <BookingButton
                    className={`flex min-h-[40px] items-center justify-center rounded-[5px] border px-[18px] font-poppins text-[14px] font-light transition duration-200 ${classes.isLight ? "border-[#D9DCF2] text-[#2C3A87] hover:bg-[#EEF0FF]" : "border-white/15 text-[#DAD7FF] hover:bg-white/10"}`}
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
              const toolImage = source ? getItemImages(source)[0] : undefined;
              const toolBadge = source?.accessNote
                ? resolveLocalizedField(source.accessNote, languageReducer)
                : null;

              const inner = (
                <>
                  {toolImage && (
                    <div className={`aspect-[16/10] w-full overflow-hidden border-b ${classes.imageShell}`}>
                      <img
                        src={toolImage}
                        alt={tool.name}
                        // Centre-cropped, like the portfolio tiles: anchoring to
                        // the top of these screenshots frames a sign-in dialog
                        // rather than the tool itself.
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {toolBadge && (
                      <span
                        className={`mb-3 inline-block w-fit rounded-full border px-3 py-1 text-[11px] font-medium leading-tight ${classes.isLight ? "border-[#D9DCF2] bg-[#EEF0FF] text-[#2C3A87]" : "border-white/10 bg-white/5 text-[#DAD7FF]"}`}
                      >
                        {toolBadge}
                      </span>
                    )}

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
                        <span
                          className={`${classes.isLight ? "border-[#D9DCF2] text-[#2C3A87] group-hover:bg-[#EEF0FF]" : "border-white/15 text-[#DAD7FF] group-hover:bg-white/10"} flex min-h-[40px] w-fit items-center justify-center rounded-[5px] border px-[18px] font-poppins text-[14px] font-light transition duration-200`}
                        >
                          {t.text("it.saasFreeCta")}
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
  );
}
