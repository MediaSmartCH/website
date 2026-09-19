/**
 * Two cards pointing at the regional pages.
 *
 * Rendered on the homepage and on the services page, which are where a visitor
 * arrives and where the pages they lead to are the natural next question.
 *
 * The anchor text names the destination — "Découvrir notre activité en Valais"
 * rather than "En savoir plus". A link is the only description a search engine
 * gets of what sits at the other end, and "en savoir plus" describes nothing.
 */

import React from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";
import { useTranslations } from "@shared/i18n/translator";

type RegionalLink = { title: string; description: string; label: string };

/** Same order as `agency.regionalLinks`. */
const PATHS = ["/agence-web-suisse-romande", "/agence-web-valais"];

export default function RegionalLinks() {
  const language = useAppSelector((state) => state.language.currentLanguage);
  const t = useTranslations(language);
  const { L } = useLangLink();

  const links = t.array<RegionalLink>("agency.regionalLinks");

  return (
    <section className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[20px] pb-[30px] lg:pb-[40px]">
      <h2 className="text-heading w-full text-center font-redDisplay font-bold text-[24px] md:text-[28px] lg:text-[32px] xl:text-[38px] mb-[24px] lg:mb-[32px]">
        {t.text("agency.regionalLinksTitle")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] lg:gap-[24px]">
        {links.map((link, index) => (
          <Link
            key={PATHS[index]}
            to={L(PATHS[index])}
            className="bg-surface rounded-[15px] xl:rounded-[20px] px-5 py-6 md:px-6 md:py-7 block transition hover:-translate-y-[2px]"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            <h3 className="text-heading-strong font-redDisplay font-bold text-[18px] lg:text-[19px] xl:text-[21px] mb-[10px]">
              {link.title}
            </h3>
            <p className="text-body font-poppins font-light text-[13px] md:text-[14px] xl:text-[15px] leading-relaxed mb-[14px]">
              {link.description}
            </p>
            <span className="gradient-text font-poppins font-medium text-[13px] xl:text-[14px] underline underline-offset-4">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
