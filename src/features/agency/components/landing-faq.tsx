/**
 * The FAQ section of a regional page: a heading and the shared accordion.
 *
 * The questions come from the dictionaries and are also published as FAQPage
 * structured data (see src/shared/seo/route-meta.ts), which reads the same
 * keys — so what an answer engine is told is what the page shows.
 */

import React from "react";

import FaqAccordion, { type FaqItem } from "@shared/components/faq-accordion";

export default function LandingFaq({
  title,
  items,
  idPrefix,
}: {
  title: string;
  items: FaqItem[];
  idPrefix: string;
}) {
  return (
    <section
      id={`${idPrefix}-faq`}
      className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[40px] lg:pt-[60px]"
    >
      <h2 className="text-heading w-full text-center font-redDisplay font-bold text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px] 2xl:text-[46px] mb-[26px] lg:mb-[36px]">
        {title}
      </h2>
      <div data-aos="fade-up" data-aos-duration="1200" data-aos-easing="ease-in-sine">
        <FaqAccordion items={items} idPrefix={idPrefix} />
      </div>
    </section>
  );
}
