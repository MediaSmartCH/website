import React from "react";

import * as manifestModule from "@shared/config/image-variants.json";

type Variant = { width: number; url: string };
type Entry = { width: number; height: number; variants: Variant[] };

/**
 * Read through the namespace rather than as a default import.
 *
 * A JSON module reaches this file as a namespace object under the bundler and
 * as `{ default: … }` under the prerenderer's own build, and a default import
 * resolves to the wrong one of those in one of the two — which is silent: the
 * lookup simply misses and every image falls back to its original.
 */
const MANIFEST = ((manifestModule as { default?: unknown }).default ??
  manifestModule) as Record<string, Entry | undefined>;

export interface ResponsiveImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "srcSet"> {
  /** Public path of the original, e.g. "/screenshots/cc-wk-0.jpg". */
  src: string;
  alt: string;
  /** How wide the image renders, in the form the browser needs. Required:
   *  without it a srcset is guesswork and the browser assumes 100vw. */
  sizes: string;
}

/**
 * A project screenshot, at a width suited to the space it is given.
 *
 * The originals are captured at 1440px and shown in cards 420–460px across, so
 * a phone was downloading five times the pixels it could draw. The build
 * renders narrow WebP copies (scripts/generate-image-variants.mjs) and this
 * offers them through a srcset.
 *
 * The original stays the `src`, so an image the generator has not seen — a new
 * screenshot, say — still renders exactly as before rather than breaking. The
 * widest variant matches the source's own dimensions, so a 3x display gets the
 * same pixels it always did, only in WebP.
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes,
  width,
  height,
  ...rest
}: ResponsiveImageProps) {
  const entry = MANIFEST[src];

  return (
    <img
      src={src}
      srcSet={entry?.variants.map((v) => `${v.url} ${v.width}w`).join(", ")}
      sizes={entry ? sizes : undefined}
      alt={alt}
      width={width ?? entry?.width}
      height={height ?? entry?.height}
      {...rest}
    />
  );
}
