/**
 * How wide each poster slot actually renders, in the form the browser needs to
 * pick a width from a srcset.
 *
 * Measured rather than guessed — the hero renders at 88% of the viewport on a
 * phone but only 64% on a desktop, so a single figure would either blur the
 * phone or overfeed the desktop:
 *
 *   phone 360 @3x       310 CSS px ->  930 device px
 *   Lighthouse mobile   362 CSS px ->  950 device px
 *   Lighthouse desktop  863 CSS px ->  863 device px
 *   desktop 1920 @2x   1200 CSS px -> 2400 device px
 *
 * This lives in its own module because the build reads HERO_SIZES too: the
 * hero poster is preloaded, and a preload whose `imagesizes` disagrees with the
 * image's own `sizes` makes the browser pick a different candidate and download
 * the picture twice. One definition, both consumers.
 */
export const HERO_SIZES = "(max-width: 767px) 88vw, (max-width: 1279px) 70vw, 64vw";
export const FEATURE_SIZES = "(max-width: 767px) 70vw, (max-width: 1279px) 55vw, 42vw";
export const CARD_SIZES = "(max-width: 767px) 72vw, (max-width: 1279px) 34vw, 23vw";

/**
 * Width buckets for the hero poster, chosen by media query rather than by
 * srcset.
 *
 * The hero is the only poster that is preloaded, and that makes srcset the
 * wrong tool for it: the preload scanner and the layout engine evaluate
 * `w` descriptors independently, and under Lighthouse's fractional mobile
 * density (2.625) they disagree — the scanner took the 700 and the image took
 * the 1400, so the page downloaded both (57KB where one file is 37KB).
 *
 * Media queries do not have that problem: the same condition evaluates the same
 * way in the scanner and in layout, so exactly one file is ever fetched. The
 * buckets follow the measurements in this file:
 *
 *   phones            need  950–1030 device px -> 1000
 *   wide, 1x          need       863 device px -> 1000
 *   wide, high-density need      2400 device px -> 1400 (the widest rendered)
 *
 * The conditions must stay mutually exclusive, or a preload fires for a file
 * the image will not use. Everything else on the page keeps plain srcset, where
 * having no preload means the browser picks once, on its own, and is right.
 */
export const HERO_POSTER_BUCKETS = [
  { media: "(max-width: 767px)", width: 1000 },
  { media: "(min-width: 768px) and (max-resolution: 1.5dppx)", width: 1000 },
  { media: "(min-width: 768px) and (min-resolution: 1.5001dppx)", width: 1400 },
] as const;

/** The bucket a browser falls back to when it understands none of the above. */
export const HERO_POSTER_FALLBACK_WIDTH = 1400;
