import React from "react";

import FaqSection from "@shared/components/faq-section";
import type { FaqItem } from "@shared/components/faq-accordion";
import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

const TILE_IDS = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6"] as const;

/**
 * The video page's FAQ.
 *
 * Rebuilt on the shared section when the accordion moved off Ant Design's
 * Collapse, which is the same change the services FAQ went through: same
 * container, same measure, same accordion, one implementation.
 */
const Faq: React.FC = () => {
  const languageReducer = useAppSelector((s) => s.language.currentLanguage);
  const t = useTranslations(languageReducer);

  return (
    <FaqSection
      title={t.text("home.faqTitle")}
      items={TILE_IDS.map((tileId) => t.object<FaqItem>(`home.${tileId}`))}
      idPrefix="video"
    />
  );
};

export default Faq;
