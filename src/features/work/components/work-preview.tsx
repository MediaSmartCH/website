/**
 * Three client projects, as evidence inside another page.
 *
 * Three rather than all seven: this is a proof point in the middle of a page,
 * not the gallery, and the link underneath takes a reader who wants the rest
 * to /realisations.
 */

import React from "react";

import { CASE_STUDY_ITEMS } from "@features/work/lib/work-routes";
import WorkCard from "@features/work/components/work-card";

const PREVIEW_COUNT = 3;

export default function WorkPreview({ ids }: { ids?: string[] }) {
  // A caller can name the projects it wants — the Valais page shows the Valais
  // clients — and otherwise the first three of the list are used.
  const items = ids
    ? ids
        .map((id) => CASE_STUDY_ITEMS.find((item) => item.id === id))
        .filter((item): item is NonNullable<typeof item> => !!item)
    : CASE_STUDY_ITEMS.slice(0, PREVIEW_COUNT);

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] lg:gap-[24px]">
      {items.map((item) => (
        <WorkCard key={item.id} item={item} linkToDetail />
      ))}
    </div>
  );
}
