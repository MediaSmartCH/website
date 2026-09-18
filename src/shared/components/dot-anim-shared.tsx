import React from "react";

import { LottieKey } from "@shared/config/lotties";

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
  src: string;
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
function LottiePoster({ src, scale = 1, eager = false }: PosterProps) {
  return (
    <img
      src={src}
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
}
export { LottiePoster, hasAnim, selectSrc };
export type { PosterProps };
