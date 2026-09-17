/**
 * "Opens in 3 months" badge for a product that is not public yet.
 *
 * Reads its target from the portfolio data (`launchDate`), ticks once a second
 * and swaps itself for the "available" label as soon as the date is reached, so
 * a launch that happens while nobody redeploys still reads correctly.
 */

import React from "react";

import { getCountdownParts } from "@features/it-services/lib/launch-countdown";
import type { PortfolioThemeClasses } from "@features/it-services/lib/portfolio-theme-classes";

import { useTranslations } from "@shared/i18n/translator";

export interface LaunchCountdownProps {
  /** ISO date the product opens to the public. */
  launchDate: string;
  language: string;
  classes: PortfolioThemeClasses;
}

export default function LaunchCountdown({
  launchDate,
  language,
  classes,
}: LaunchCountdownProps) {
  const t = useTranslations(language);
  const [parts, setParts] = React.useState(() => getCountdownParts(launchDate, new Date()));

  React.useEffect(() => {
    setParts(getCountdownParts(launchDate, new Date()));

    // Stop ticking once the date is reached: nothing left to count down to.
    if (getCountdownParts(launchDate, new Date()).launched) return undefined;

    const interval = window.setInterval(() => {
      const next = getCountdownParts(launchDate, new Date());
      setParts(next);

      if (next.launched) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [launchDate]);

  const unitClass = `${classes.isLight ? "border-[#D9DCF2] bg-[#EEF0FF] text-[#2C3A87]" : "border-white/10 bg-white/5 text-[#DAD7FF]"} flex min-w-[46px] flex-col items-center rounded-[10px] border px-2 py-1.5`;

  if (parts.launched) {
    return (
      <span
        className={`${classes.strongText} mt-3 inline-block font-poppins text-[12px] font-semibold`}
      >
        {t.text("it.launchCountdownLive")}
      </span>
    );
  }

  const units = [
    { value: parts.days, label: t.text("it.launchCountdownDays") },
    { value: parts.hours, label: t.text("it.launchCountdownHours") },
    { value: parts.minutes, label: t.text("it.launchCountdownMinutes") },
    { value: parts.seconds, label: t.text("it.launchCountdownSeconds") },
  ];

  return (
    <div className="mt-3">
      <span
        className={`${classes.mutedText} block font-poppins text-[11px] font-medium uppercase tracking-[0.14em]`}
      >
        {t.text("it.launchCountdownLabel")}
      </span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {units.map(({ value, label }) => (
          <span key={label} className={unitClass}>
            <span className="font-redDisplay text-[16px] font-bold leading-5">
              {String(value).padStart(2, "0")}
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.1em] opacity-75">
              {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
