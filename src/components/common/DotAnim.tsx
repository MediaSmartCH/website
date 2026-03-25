import React, { memo, useEffect, useMemo, useState } from "react";
import { type DotLottie, DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import dotLottieWasmUrl from "virtual:dotlottie-wasm-url";
import { useAppSelector } from "services/hooks/hooks";
import {
  getLottieAspectRatio,
  getLottiePresentation,
  LottieKey,
  preloadLottieSrc,
  readLottieSrc,
} from "config/lotties";

// Use the locally-bundled WASM so DotLottie never fetches from CDN,
// which our production Content-Security-Policy blocks.
setWasmUrl(dotLottieWasmUrl);

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

function hasAnim(p: DotAnimProps): p is ByKeyProps {
  return (p as ByKeyProps).anim !== undefined;
}

function selectSrc(theme: string, pair: { light: string; dark?: string }) {
  return theme === "dark" && pair.dark ? pair.dark : pair.light;
}

function DotAnim(props: DotAnimProps) {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const animationsEnabled = useAppSelector((state) => state.animations.enabled);
  const animKey = hasAnim(props) ? props.anim : undefined;
  const staticPair = hasAnim(props)
    ? undefined
    : { light: props.light, dark: props.dark };
  const intrinsicAspectRatio = animKey ? getLottieAspectRatio(animKey) : undefined;
  const presentation = animKey ? getLottiePresentation(animKey) : undefined;

  // stableTheme only advances once the next animation source is ready, so the
  // player keeps rendering the current file instead of flashing a fallback.
  const [stableTheme, setStableTheme] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dotLottieInstance, setDotLottieInstance] = useState<DotLottie | null>(null);

  const {
    className,
    style,
    autoplay: autoplayProp = true,
    loop = true,
    protect = false,
    // The SVG renderer is now the only code path we ship. Keep the prop so
    // existing call sites do not need to change.
    crisp: _crisp = true,
  } = props;

  const autoplay = autoplayProp && animationsEnabled;

  const renderConfig = useMemo(() => {
    if (typeof window === "undefined") {
      return { autoResize: true, devicePixelRatio: 1 };
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    return {
      autoResize: true,
      devicePixelRatio: isMobileViewport
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.5),
    };
  }, []);

  useEffect(() => {
    if (theme === stableTheme) {
      return;
    }

    let cancelled = false;
    const startTime = Date.now();

    const syncTheme = async () => {
      setIsTransitioning(true);

      try {
        if (animKey) {
          await preloadLottieSrc(animKey, theme);
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 220 - elapsed);

        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        if (!cancelled) {
          setStableTheme(theme);
        }
      } finally {
        if (!cancelled) {
          setIsTransitioning(false);
        }
      }
    };

    syncTheme();

    return () => {
      cancelled = true;
    };
  }, [animKey, stableTheme, theme]);

  // Imperatively pause/play when the global animations toggle changes so the
  // change takes effect immediately without remounting the player.
  useEffect(() => {
    if (!dotLottieInstance) return;
    if (animationsEnabled && autoplayProp) {
      dotLottieInstance.play();
    } else {
      dotLottieInstance.pause();
    }
  }, [animationsEnabled, autoplayProp, dotLottieInstance]);

  const src = animKey
    ? readLottieSrc(animKey, stableTheme)
    : selectSrc(stableTheme, staticPair!);

  const wrapperStyle = useMemo<React.CSSProperties>(() => {
    const nextStyle: React.CSSProperties = {
      display: "block",
      ...style,
    };

    if (intrinsicAspectRatio && nextStyle.aspectRatio === undefined) {
      nextStyle.aspectRatio = `${intrinsicAspectRatio}`;
    }

    return nextStyle;
  }, [intrinsicAspectRatio, style]);

  const playerStyle = useMemo<React.CSSProperties>(() => {
    const scale = presentation?.scale ?? 1;

    return {
      width: "100%",
      height: "100%",
      display: "block",
      transform: scale === 1 ? undefined : `scale(${scale})`,
      transformOrigin: "center center",
    };
  }, [presentation?.scale]);

  const prevent = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={`relative ${className || ""}`}
      style={{
        ...wrapperStyle,
        userSelect: protect ? "none" : undefined,
        WebkitUserSelect: protect ? "none" : undefined,
        WebkitTouchCallout: protect ? "none" : undefined,
        transition: "opacity 0.3s ease",
        opacity: isTransitioning ? 0.7 : 1,
      }}
      onContextMenu={protect ? prevent : undefined}
      onDragStart={protect ? prevent : undefined}
      draggable={protect ? false : undefined}
    >
      {/* dotLottie-react is the maintained React integration from LottieFiles.
          We keep interpolation disabled and cap DPR a bit on mobile to reduce
          raster cost without noticeably degrading the animation. */}
      <DotLottieReact
        key={`${src}-${stableTheme}`}
        src={src}
        autoplay={autoplay}
        loop={loop}
        useFrameInterpolation={false}
        renderConfig={renderConfig}
        layout={{
          fit: presentation?.fit ?? "contain",
          align: presentation?.align ?? [0.5, 0.5],
        }}
        style={playerStyle}
        dotLottieRefCallback={setDotLottieInstance}
      />

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
