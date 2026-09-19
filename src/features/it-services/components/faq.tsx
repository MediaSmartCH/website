import React from "react";

import FaqAccordion, { type FaqItem } from "@shared/components/faq-accordion";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

const FaqIT: React.FC = () => {
  const languageReducer = useAppSelector((s) => s.language.currentLanguage);
  const t = useTranslations(languageReducer);

  const keys = ["itFaq1", "itFaq2", "itFaq3", "itFaq4", "itFaq5", "itFaq6"] as const;
  const items = keys.map((key) => t.object<FaqItem>(`it.${key}`));

  return (
    <div id="faq-it" className="relative overflow-hidden">
      <div className="relative z-10 w-full flex flex-row justify-center homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto">
        <div className="w-full md:w-[90%] lg:w-full lg:px-[40px] xl:px-[50px] 2xl:px-[60px] flex flex-col items-start">
          <h2
            className={`text-heading w-full text-center font-helvetica font-bold text-[28px] md:text-[30px] lg:text-[36px] xl:text-[45px] 2xl:text-[48px] mt-[40px] md:mt-[50px] lg:mt-[60px] 2xl:mt-[70px] mb-[100px] md:mb-[50px] lg:mb-[30px] xl:mb-[36px] 2xl:mb-[46px]`}
          >
            {t.text("it.itFaqTitle")}
          </h2>

          <div
            className="w-full"
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            <FaqAccordion items={items} idPrefix="it" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqIT;
