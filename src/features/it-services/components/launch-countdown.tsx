/**
 * "Opens in 3 months" counter for a product that is not public yet.
 *
 * Reads its target from the portfolio data (`launchDate`), ticks once a second
 * and swaps itself for the "available" label as soon as the date is reached, so
 * a launch that happens while nobody redeploys still reads correctly.
 *
 * The tiles carry the site's own signature rather than the neutral boxes they
 * started as: the brand gradient as a hairline border and on the digits, the
 * display face used by every heading, and tabular figures so the row does not
 * twitch on each tick. Styling lives in styles/components/countdown.css —
 * a gradient border needs two stacked backgrounds, which Tailwind classes
 * cannot express.
 *
 * Screen readers get one sentence through `role="timer"` instead of four
 * unlabelled numbers re-announced every second.
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

  if (parts.launched) {
    return (
      <span className="launch-countdown-live mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 font-poppins text-[12px] font-semibold">
        <span aria-hidden="true" className="launch-countdown-live-dot" />
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

  const spokenLabel = `${t.text("it.launchCountdownLabel")}: ${units
    .map(({ value, label }) => `${value} ${label}`)
    .join(", ")}`;

  return (
    <div
      className={`launch-countdown mt-4 ${classes.isLight ? "" : "launch-countdown-dark"}`}
      role="timer"
      aria-label={spokenLabel}
    >
      <span
        className={`${classes.mutedText} flex items-center gap-2 font-poppins text-[10px] font-semibold uppercase tracking-[0.18em]`}
        aria-hidden="true"
      >
        <span className="launch-countdown-rule" />
        {t.text("it.launchCountdownLabel")}
      </span>
      <div className="mt-2 flex flex-wrap gap-2" aria-hidden="true">
        {units.map(({ value, label }) => (
          <span key={label} className="launch-countdown-unit">
            <span className="launch-countdown-value">
              {String(value).padStart(2, "0")}
            </span>
            <span className={`${classes.mutedText} launch-countdown-label`}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
