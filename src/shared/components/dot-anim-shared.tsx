import React from "react";

import { LottieKey, PosterSource } from "@shared/config/lotties";

type Base = {
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
  protect?: boolean;
  crisp?: boolean;
};

// Two usage modes:
// - ByKeyProps: pass a named key from LOTTIE_LOADERS and let DotAnim resolve
//   the correct src + dimensions automatically (preferred for site animations).
// - BySrcProps: pass raw file URLs directly. SECURITY: only pass URLs that
//   come from bundled assets (import statements). Never pass user-controlled
//   strings here — the DotLottie player executes the file content as code.
type ByKeyProps = Base & { anim: LottieKey; light?: never; dark?: never };
type BySrcProps = Base & { light: string; dark?: string; anim?: never };
export type DotAnimProps = ByKeyProps | BySrcProps;

// Type guard to distinguish between the two usage modes at runtime.
function hasAnim(p: DotAnimProps): p is ByKeyProps {
  return (p as ByKeyProps).anim !== undefined;
}

function selectSrc(theme: string, pair: { light: string; dark?: string }) {
  return theme === "dark" && pair.dark ? pair.dark : pair.light;
}

type PosterProps = {
  poster: PosterSource;
  /** Same scale the player applies, so the still frame lands on the same pixels. */
  scale?: number;
  /** Off-screen slots defer their poster; an imminent one loads right away. */
  eager?: boolean;
};

/**
 * The animation's first frame, filling its box.
 *
 * Decorative, so it stays out of the accessibility tree: the animations carry
 * no information the surrounding copy does not already give.
 */
function LottiePoster({ poster, scale = 1, eager = false }: PosterProps) {
  const image = (
    <img
      src={poster.src}
      srcSet={poster.srcSet || undefined}
      sizes={poster.sizes || undefined}
      alt=""
      aria-hidden={true}
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        objectFit: "contain",
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: "center center",
      }}
    />
  );

  if (!poster.sources) return image;

  // <picture> is display:inline and establishes no containing block, so the
  // absolutely-positioned img still resolves against the slot as before.
  return (
    <picture>
      {poster.sources.map((source) => (
        <source key={source.media} media={source.media} srcSet={source.url} />
      ))}
      {image}
    </picture>
  );
}
export { LottiePoster, hasAnim, selectSrc };
export type { PosterProps };
