/**
 * The mark that opens "Projets en cours": a sweeping bar and one sentence.
 *
 * It is the MediaSmart holding page's own device — the bar that greets anyone
 * landing on a site we are still building — brought over here so a section
 * about unfinished work looks like the page we put in front of unfinished
 * work. The CSS is that project's, re-coloured with the site's gradient; see
 * `styles/components/progress.css`.
 *
 * What it deliberately is not: an indicator. It carries no value, no
 * percentage, no date and no stage, because there is no honest number to put
 * on "two sites are being built". It is hidden from assistive technology and
 * the caption underneath says the whole of what it means.
 */

import React from "react";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useTranslations } from "@shared/i18n/translator";

export default function WorkProgress() {
  const language = useAppSelector((state) => state.language.currentLanguage);
  // The site's own animations switch. `prefers-reduced-motion` is handled a
  // second time in CSS, because it also has to hold before React runs.
  const animationsEnabled = useAppSelector((state) => state.animations.enabled);
  const t = useTranslations(language);

  return (
    <div
      className="mx-auto w-full max-w-[420px] text-center"
      data-aos="fade-up"
      data-aos-duration="900"
      data-aos-easing="ease-in-sine"
    >
      <div className="wip-progress-track" aria-hidden="true">
        <span
          className="wip-progress-bar"
          data-still={animationsEnabled ? undefined : "true"}
        />
      </div>
      <p className="text-body mt-[10px] font-poppins font-light text-[12px] md:text-[13px]">
        {t.text("work.progressCaption")}
      </p>
    </div>
  );
}
