/**
 * A FAQ section, exactly as the services page renders one.
 *
 * Pulled out of `features/it-services/components/faq.tsx` when the regional
 * pages needed the same thing: same container, same measure, same heading
 * treatment, same accordion. Re-implementing it "almost the same" is how two
 * FAQs on one site end up with different paddings.
 */

import React from "react";

import FaqAccordion, { type FaqItem } from "@shared/components/faq-accordion";

export interface FaqSectionProps {
  title: string;
  items: FaqItem[];
  /** Disambiguates the accordion's gradient id, and names the anchor. */
  idPrefix: string;
}

export default function FaqSection({ title, items, idPrefix }: FaqSectionProps) {
  return (
    <div id={`faq-${idPrefix}`} className="relative overflow-hidden">
      <div className="relative z-10 w-full flex flex-row justify-center homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto">
        <div className="w-full md:w-[90%] lg:w-full lg:px-[40px] xl:px-[50px] 2xl:px-[60px] flex flex-col items-start">
          <h2
            className={`text-heading w-full text-center font-helvetica font-bold text-[28px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mt-[40px] md:mt-[50px] lg:mt-[60px] 2xl:mt-[70px] mb-[100px] md:mb-[50px] lg:mb-[30px] xl:mb-[36px] 2xl:mb-[46px]`}
          >
            {title}
          </h2>

          <div
            className="w-full"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            <FaqAccordion items={items} idPrefix={idPrefix} />
          </div>
        </div>
      </div>
    </div>
  );
}
