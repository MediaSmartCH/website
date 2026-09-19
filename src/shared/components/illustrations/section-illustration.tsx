/**
 * Four small inline illustrations, for service rows the Lottie catalogue has
 * nothing suitable for.
 *
 * ## Why these are SVG and not new animations
 *
 * The regional pages have more service rows than there are relevant animations
 * in `LOTTIE_LOADERS`, and the first draft filled the gap by using the same
 * one twice in a row. Repeating an illustration reads as a mistake, and
 * commissioning a new Lottie for a row of body copy is not worth 300KB of
 * player time.
 *
 * So these are drawn here: no file to fetch, no runtime, nothing added to the
 * bundle but their own markup. Where a real animation would genuinely be
 * better, the page keeps the Lottie — these only cover what it cannot.
 *
 * ## How they stay on-brand
 *
 * One vocabulary across all four: 20px-radius panels, a 2px stroke, and the
 * site's own `#b514fd -> #5f75f5` gradient for the single accent in each.
 * Everything else is `currentColor` at low opacity, so they take the theme
 * from the text around them rather than carrying two hard-coded palettes.
 *
 * Decorative: `aria-hidden`, and never carrying information the copy beside
 * them does not already give.
 */

import React, { useId } from "react";

export type IllustrationName = "app" | "seo" | "hosting" | "business";

const VIEWBOX = "0 0 320 240";

export default function SectionIllustration({
  name,
  className = "",
}: {
  name: IllustrationName;
  className?: string;
}) {
  // useId yields ":r0:", and a colon is not valid in an SVG id.
  const gradientId = `illus-${useId().replace(/:/g, "")}`;
  const accent = `url(#${gradientId})`;

  return (
    <svg
      viewBox={VIEWBOX}
      className={`w-full h-auto ${className}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b514fd" />
          <stop offset="100%" stopColor="#5f75f5" />
        </linearGradient>
      </defs>

      {/* The panel every variant is drawn on. */}
      <rect
        x="26"
        y="30"
        width="268"
        height="180"
        rx="20"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="2"
      />

      {name === "app" && <AppShapes accent={accent} />}
      {name === "seo" && <SeoShapes accent={accent} />}
      {name === "hosting" && <HostingShapes accent={accent} />}
      {name === "business" && <BusinessShapes accent={accent} />}
    </svg>
  );
}

/** A window with a sidebar and a record being edited: a business tool. */
function AppShapes({ accent }: { accent: string }) {
  return (
    <>
      <path d="M26 62h268" stroke="currentColor" strokeOpacity="0.14" strokeWidth="2" />
      <circle cx="46" cy="46" r="4" fill={accent} />
      <circle cx="60" cy="46" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="74" cy="46" r="4" fill="currentColor" fillOpacity="0.2" />

      <rect x="42" y="78" width="62" height="118" rx="10" fill="currentColor" fillOpacity="0.07" />
      {[0, 1, 2, 3].map((row) => (
        <rect
          key={row}
          x="54"
          y={94 + row * 24}
          width="38"
          height="6"
          rx="3"
          fill={row === 0 ? accent : "currentColor"}
          fillOpacity={row === 0 ? 1 : 0.2}
        />
      ))}

      <rect x="120" y="78" width="154" height="40" rx="10" fill="currentColor" fillOpacity="0.07" />
      <rect x="134" y="94" width="76" height="8" rx="4" fill={accent} />
      {[0, 1].map((row) => (
        <React.Fragment key={row}>
          <rect
            x="120"
            y={130 + row * 34}
            width="154"
            height="26"
            rx="8"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <rect
            x="134"
            y={139 + row * 34}
            width={row === 0 ? 96 : 68}
            height="6"
            rx="3"
            fill="currentColor"
            fillOpacity="0.22"
          />
        </React.Fragment>
      ))}
    </>
  );
}

/** A results list with a rising trend: what technical SEO is measured by. */
function SeoShapes({ accent }: { accent: string }) {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <React.Fragment key={row}>
          <rect
            x="48"
            y={62 + row * 34}
            width="124"
            height="22"
            rx="8"
            fill="currentColor"
            fillOpacity={row === 0 ? 0.1 : 0.05}
          />
          <rect
            x="60"
            y={70 + row * 34}
            width={row === 0 ? 74 : 52}
            height="6"
            rx="3"
            fill={row === 0 ? accent : "currentColor"}
            fillOpacity={row === 0 ? 1 : 0.22}
          />
        </React.Fragment>
      ))}

      {/* The climb, and the bars under it. */}
      {[0, 1, 2, 3].map((bar) => (
        <rect
          key={bar}
          x={198 + bar * 24}
          y={178 - bar * 22}
          width="14"
          height={14 + bar * 22}
          rx="6"
          fill="currentColor"
          fillOpacity={0.12 + bar * 0.04}
        />
      ))}
      <path
        d="M198 152l24-20 24-16 24-24"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="270" cy="92" r="5" fill={accent} />
    </>
  );
}

/** Stacked nodes with a link out: an application we run and keep running. */
function HostingShapes({ accent }: { accent: string }) {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <React.Fragment key={row}>
          <rect
            x="72"
            y={64 + row * 46}
            width="176"
            height="34"
            rx="10"
            fill="currentColor"
            fillOpacity="0.06"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="2"
          />
          <circle cx="94" cy={81 + row * 46} r="5" fill={row === 0 ? accent : "currentColor"} fillOpacity={row === 0 ? 1 : 0.25} />
          <rect
            x="112"
            y={77 + row * 46}
            width={row === 1 ? 82 : 62}
            height="6"
            rx="3"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </React.Fragment>
      ))}

      <path
        d="M160 98v12M160 144v12"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
    </>
  );
}

/** A storefront card beside an article list: a site that does more than tell. */
function BusinessShapes({ accent }: { accent: string }) {
  return (
    <>
      <rect x="48" y="64" width="110" height="132" rx="12" fill="currentColor" fillOpacity="0.07" />
      <rect x="48" y="64" width="110" height="56" rx="12" fill={accent} fillOpacity="0.16" />
      <circle cx="78" cy="92" r="11" fill={accent} />
      <rect x="62" y="136" width="70" height="7" rx="3.5" fill="currentColor" fillOpacity="0.24" />
      <rect x="62" y="154" width="46" height="7" rx="3.5" fill="currentColor" fillOpacity="0.16" />
      <rect x="62" y="172" width="58" height="14" rx="7" fill={accent} />

      {[0, 1, 2].map((row) => (
        <React.Fragment key={row}>
          <rect
            x="176"
            y={64 + row * 46}
            width="96"
            height="34"
            rx="10"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <rect
            x="190"
            y={77 + row * 46}
            width={row === 1 ? 46 : 64}
            height="6"
            rx="3"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </React.Fragment>
      ))}
      <rect x="176" y="202" width="96" height="8" rx="4" fill="currentColor" fillOpacity="0.1" />
    </>
  );
}
