import React, { memo, useMemo, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "@dotlottie/player-component";
import { useAppSelector } from "services/hooks/hooks";
import { LOTTIES, LottieKey, LottiePair } from "config/lotties";

type Base = {
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
  protect?: boolean;
  crisp?: boolean;
};

type ByKeyProps = Base & { anim: LottieKey; light?: never; dark?: never };
type BySrcProps = Base & { light: string; dark?: string; anim?: never };
export type DotAnimProps = ByKeyProps | BySrcProps;

// Module-level set shared across all DotAnim instances so each asset URL is
// only prefetch-linked once, even when multiple components share the same animation.
const preloadCache = new Set<string>();

function preloadAsset(src: string) {
  if (preloadCache.has(src)) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = src;
  document.head.appendChild(link);
  preloadCache.add(src);
}

function hasAnim(p: DotAnimProps): p is ByKeyProps {
  return (p as ByKeyProps).anim !== undefined;
}

function selectSrc(theme: string, pair: LottiePair) {
  return theme === "dark" && pair.dark ? pair.dark : pair.light;
}

function DotAnim(props: DotAnimProps) {
  const theme = useAppSelector((s) => s.theme.currentTheme);
  // stableTheme lags behind theme by ~300 ms so the player receives the new src
  // only after the opacity transition has started, preventing a raw asset swap flash.
  const [stableTheme, setStableTheme] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    className,
    style,
    autoplay = true,
    loop = true,
    protect = false,
    crisp = true,
  } = props;

  const pair: LottiePair = useMemo(
    () => (hasAnim(props) ? LOTTIES[props.anim] : { light: props.light, dark: props.dark }),
    [props]
  );

  // Prefetch both light and dark assets on mount so the dark variant is already
  // in the browser cache when the user switches themes, avoiding a visible flicker.
  useEffect(() => {
    preloadAsset(pair.light);
    if (pair.dark) {
      preloadAsset(pair.dark);
    }
  }, [pair]);

  // Delay committing the new theme to stableTheme until the fade-out transition
  // is underway, then fade back in once the new src is active.
  useEffect(() => {
    if (theme !== stableTheme) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setStableTheme(theme);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [theme, stableTheme]);

  const src = selectSrc(stableTheme, pair);

  const prevent = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative ${className || ""}`}
      style={{
        ...style,
        userSelect: protect ? "none" : undefined,
        WebkitUserSelect: protect ? "none" : undefined,
        WebkitTouchCallout: protect ? "none" : undefined,
        transition: 'opacity 0.3s ease',
        opacity: isTransitioning ? 0.7 : 1,
      }}
      onContextMenu={protect ? prevent : undefined}
      onDragStart={protect ? prevent : undefined}
      draggable={protect ? false : undefined}
    >
      {crisp ? (
        // dotlottie-player web component renders via SVG for pixel-perfect crispness.
        <dotlottie-player
          key={`${src}-${stableTheme}`}
          src={src}
          autoplay={autoplay}
          loop={loop}
          renderer="svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ) : (
        <DotLottieReact
          key={`${src}-${stableTheme}`}
          src={src}
          autoplay={autoplay}
          loop={loop}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      )}

      {/* Transparent overlay that intercepts all pointer/touch events to prevent
          right-click saving or dragging the animation when protect is enabled. */}
      {protect && (
        <div
          aria-hidden
          className="absolute inset-0"
          onContextMenu={prevent}
          onDragStart={prevent}
          onMouseDown={prevent}
          onTouchStart={prevent}
          onTouchMove={prevent}
          onTouchEnd={prevent}
          style={{ background: "transparent", pointerEvents: "auto" }}
        />
      )}
    </div>
  );
}

export default memo(DotAnim);
