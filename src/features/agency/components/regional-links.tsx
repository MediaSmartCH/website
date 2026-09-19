/**
 * Two cards pointing at the regional pages.
 *
 * Rendered on the homepage and on the services page, which are where a visitor
 * arrives and where the pages they lead to are the natural next question. It
 * is the only route from either page to the regional ones, so it earns its
 * place — but it was noticeably smaller than everything around it: a heading
 * two steps down the scale, and cards that read as a footnote between two
 * full-width sections.
 *
 * It now uses the measurements the rest of the site uses: the services page's
 * own h2 scale, the same `homepage-container` padding as the sections above
 * and below it, and the card treatment the SaaS products section uses — a
 * `bg-surface` panel whose hover drives a `custom-btn-in-card` button, because
 * the whole card is the link.
 */

import React from "react";
import { Link } from "react-router-dom";

import ArrowIcon from "@shared/components/arrow-icon";
import WaveBackdrop from "@shared/components/wave-backdrop";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

type RegionalLink = { title: string; description: string; label: string };

/** Same order as `agency.regionalLinks`. */
const PATHS = ["/web-agency-switzerland", "/web-agency-valais"];

export default function RegionalLinks() {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const t = useTranslations(language);
  const { L, Lhash } = useLangLink();

  const links = t.array<RegionalLink>("agency.regionalLinks");

  return (
    <section className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[40px] md:pt-[50px] md:pb-[50px] mx-auto">
      {/* The services page's heading scale, not a smaller one. */}
      <h2 className="text-heading-strong w-full text-center mx-auto font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]">
        {t.text("agency.regionalLinksTitle")}
      </h2>
      <p className="text-body w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px]">
        {t.text("agency.regionalLinksDescription")}
      </p>

      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-[20px] lg:gap-[26px]">
        {links.map((link, index) => (
          <Link
            key={PATHS[index]}
            to={L(PATHS[index])}
            className="group bg-surface rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] px-6 py-7 md:px-8 md:py-9 flex flex-col"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-delay={index * 80}
            data-aos-easing="ease-in-sine"
          >
            <h3 className="text-heading font-redDisplay font-bold text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] mb-[12px]">
              {link.title}
            </h3>
            <p className="text-body font-poppins font-light text-[13px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] leading-relaxed grow">
              {link.description}
            </p>
            {/* A span, not a nested link: the card is the link. Centred in
                its block — the copy stays left-aligned, where it reads best,
                but two buttons on the same line should share an axis. */}
            <span className="custom-btn custom-btn-in-card mt-[22px] mx-auto flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-[5px] px-[18px] font-poppins text-[14px] font-medium text-white">
              {link.label}
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>

      {/* Proximity is what these two cards argue for; this line makes sure it
          does not read as a limit. It stays a line and a button rather than a
          third card headed "International", answering twice as loudly a
          question nobody asked.

          A rounded tinted panel was tried here and made it a card again —
          exactly what it must not be. It now sits on the page itself, over a
          shallow wave, with room around it: the shape the site's own closing
          calls to action have. */}
      <div className="relative mt-[24px] lg:mt-[34px] overflow-hidden py-[40px] lg:py-[54px]">
        <WaveBackdrop
          theme={theme}
          className="top-[-10px] h-[220px] md:h-[250px] lg:h-[280px] opacity-60"
        />
        <div
          className="relative z-10 flex flex-col items-center gap-[18px] text-center"
          data-aos="fade-up"
          data-aos-duration="1100"
          data-aos-easing="ease-in-sine"
        >
          <p className="text-body font-poppins font-light text-[13px] md:text-[14px] xl:text-[15px] w-full lg:w-[66%]">
            {t.text("agency.beyondRegionText")}
          </p>
          <Link
            to={Lhash("#contact")}
            className="custom-btn-outline inline-flex min-h-[44px] items-center justify-center gap-2 px-[18px] font-poppins text-[14px] font-medium"
          >
            {t.text("agency.beyondRegionCta")}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
