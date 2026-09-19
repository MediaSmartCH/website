import React from "react";

import FaqSection from "@shared/components/faq-section";
import type { FaqItem } from "@shared/components/faq-accordion";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

const KEYS = [
  "itFaq1",
  "itFaq2",
  "itFaq3",
  "itFaq4",
  "itFaq5",
  "itFaq6",
  "itFaq7",
] as const;

const FaqIT: React.FC = () => {
  const languageReducer = useAppSelector((s) => s.language.currentLanguage);
  const t = useTranslations(languageReducer);

  return (
    <FaqSection
      title={t.text("it.itFaqTitle")}
      items={KEYS.map((key) => t.object<FaqItem>(`it.${key}`))}
      idPrefix="it"
    />
  );
};

export default FaqIT;
