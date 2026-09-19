/**
 * The small right arrow that rides inside the site's buttons.
 *
 * Lifted out of the SaaS products section when the regional and project pages
 * needed the same one. The `custom-btn-arrow` class is what
 * `styles/components/buttons.css` hooks its nudge-on-hover onto — including
 * the `prefers-reduced-motion` rule that switches the nudge off — so the
 * animation is the site's, not this component's.
 */

import React from "react";

export default function ArrowIcon() {
  return (
    <svg
      className="custom-btn-arrow"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8h9" />
      <path d="M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}
