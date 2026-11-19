/**
 * How wide each screenshot slot actually renders, in the form the browser
 * needs to pick a width from a srcset.
 *
 * Measured rather than guessed, at 390 / 768 / 1024 / 1350 / 1920 CSS px:
 * every one of these grows with the viewport up to a point and then stops, so
 * the last clause is a fixed width rather than a vw. Rounded up where they
 * fall between values — an over-estimate costs a few kilobytes, an
 * under-estimate costs sharpness.
 */

/** The large product preview on the homepage. Caps at 458px. */
export const PRODUCT_PREVIEW_SIZES =
  "(max-width: 767px) 88vw, (max-width: 1023px) 60vw, (max-width: 1279px) 46vw, 460px";

/** The smaller free-tool cards beside it. Caps at 418px. */
export const TOOL_CARD_SIZES =
  "(max-width: 767px) 88vw, (max-width: 1023px) 56vw, (max-width: 1279px) 42vw, 420px";

/** A tile in the projects index and the portfolio gallery. Caps at 327px. */
export const WORK_CARD_SIZES =
  "(max-width: 767px) 88vw, (max-width: 1023px) 48vw, 330px";

/** The preview at the top of a project page. Caps at 573px. */
export const WORK_DETAIL_SIZES =
  "(max-width: 767px) 88vw, (max-width: 1279px) 52vw, 580px";

/** The lightbox fills the screen. */
export const LIGHTBOX_SIZES = "100vw";
