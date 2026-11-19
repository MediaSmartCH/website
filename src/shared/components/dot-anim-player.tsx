import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DotLottieReact,
  DotLottieWorkerReact,
  setWasmUrl,
} from "@lottiefiles/dotlottie-react";
import dotLottieWasmUrl from "virtual:dotlottie-wasm-url";

import { useAppSelector } from "@shared/hooks/store-hooks";
import {
  getLottieAspectRatio,
  getLottiePoster,
  getLottiePresentation,
  preloadLottieSrc,
  readLottieSrc,
} from "@shared/config/lotties";
import {
  type DotAnimProps,
  hasAnim,
  LottiePoster,
  selectSrc,
} from "@shared/components/dot-anim-shared";
import {
  type LottiePlayer,
  pruneDetached,
  registerPlayer,
  setPlaybackEnabled,
} from "@shared/components/dot-anim-playback";

// Point the WASM runtime to the locally-bundled file so DotLottie never
// fetches from an external CDN, which the production CSP would block.
//
// Absolute, not the root-relative path the bundler emits. The renderer runs in
// a worker created from a blob: URL, and a blob has no path for a relative URL
// to resolve against — `fetch("/assets/…")` there throws "Failed to parse URL".
// DotLottie then falls back to unpkg, which the CSP refuses, and every
// animation fails to initialise. Resolving against the document first gives
// the worker a URL it can use.
setWasmUrl(
  typeof document === "undefined"
    ? dotLottieWasmUrl
    : new URL(dotLottieWasmUrl, document.baseURI).href
);

/**
 * One worker for every animation on the page.
 *
 * The renderer used to run on the main thread, and it was by a wide margin the
 * most expensive thing on the site: measured on a throttled mobile CPU, the
 * three animations visible at the top of the homepage cost about 3.1 seconds
 * of scripting for every 10 seconds the page stayed open — a third of the main
 * thread, continuously, for decoration. Nothing else on the page came close,
 * and because the thread never went quiet, Lighthouse's interactive estimate
 * kept sliding out and total blocking time climbed with it.
 *
 * The work itself is not wasted — the animations are part of what the site is
 * — it simply does not belong on the thread that has to answer the reader.
 * DotLottie can drive an OffscreenCanvas from a worker, which renders exactly
 * the same frames somewhere else.
 *
 * A single shared id keeps that to one worker rather than one per animation:
 * three workers competing for the same cores would cost more than they save on
 * the two-core machines this matters on.
 */
const WORKER_ID = "mediasmart-lottie";

/**
 * Whether the canvas can be handed to a worker at all.
 *
 * `transferControlToOffscreen` arrived in Safari 16.4, so a visitor on an
 * older iPhone cannot have the worker renderer. They get the main-thread one,
 * exactly as before — the same animation at the same cost, rather than a still
 * frame and a console error.
 */
const canRenderOffThread =
  typeof HTMLCanvasElement !== "undefined" &&
  typeof HTMLCanvasElement.prototype.transferControlToOffscreen === "function";

/**
 * Absolute form of a bundled asset URL.
 *
 * The worker fetches the animation itself, and it has no document to resolve a
 * root-relative path against — see the note on setWasmUrl above. Everything
 * handed across the worker boundary has to be absolute.
 */
function toAbsoluteUrl(url: string | undefined): string | undefined {
  if (!url || typeof document === "undefined") return url;

  try {
    return new URL(url, document.baseURI).href;
  } catch {
    return url;
  }
}

function DotAnimPlayer(props: DotAnimProps) {
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
  const [dotLottieInstance, setDotLottieInstance] = useState<LottiePlayer | null>(null);
  // The poster stays up until the canvas has actually drawn something. "load"
  // is too early: it only means the file was parsed, and the canvas is still
  // blank at that point.
  const [hasPainted, setHasPainted] = useState(false);

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

  // Cap DPR at 2 to avoid excessive raster cost on high-density displays (e.g. 3x on some Android devices)
  // without any noticeable quality loss. Falls back to 1 in SSR environments where window is undefined.
  const renderConfig = useMemo(() => {
    if (typeof window === "undefined") {
      return { autoResize: true, devicePixelRatio: 1 };
    }

    return {
      autoResize: true,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    };
  }, []);

  // When the global theme changes, preload the new animation variant before
  // switching. This prevents the player from briefly showing a blank frame
  // between the old and new file. A minimum 220ms opacity transition gives the
  // fade-out time to complete even if the fetch resolves instantly.
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

        // Ensure the fade-out has at least 220ms to complete.
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

    // If the component unmounts or theme changes again before the transition
    // completes, cancel the pending state updates to avoid stale setState calls.
    return () => {
      cancelled = true;
    };
  }, [animKey, stableTheme, theme]);

  useEffect(() => {
    if (!dotLottieInstance) return;

    const handleRender = () => setHasPainted(true);
    dotLottieInstance.addEventListener("render", handleRender);

    return () => dotLottieInstance.removeEventListener("render", handleRender);
  }, [dotLottieInstance]);

  // The preference is applied through the shared registry rather than to the
  // instance this component happens to hold, so a flip reaches every live
  // instance at once — including any the component never learned about.
  useEffect(() => {
    setPlaybackEnabled(animationsEnabled);
  }, [animationsEnabled]);

  // Read inside the ref callback, which the library keeps stable for the
  // lifetime of the canvas and therefore cannot see a fresh prop.
  const autoplayPropRef = useRef(autoplayProp);
  autoplayPropRef.current = autoplayProp;

  // Register on creation, release on teardown. The registry puts each instance
  // into the state the preference calls for straight away, so one created
  // while animations are off never gets a chance to autoplay.
  const handleInstance = useCallback((instance: LottiePlayer | null) => {
    // A replaced instance is deliberately left registered. The library hands a
    // second one over without first reporting a teardown for the first — which
    // is what StrictMode's double attach produces — and that first one is
    // still drawing on the same canvas. Dropping it here is precisely how the
    // visible animation used to escape the toggle; the registry keeps it under
    // control instead, and prunes it once its canvas leaves the document.
    if (instance) {
      registerPlayer(instance, autoplayPropRef.current);
    } else {
      // The canvas has gone; drop everything that was drawing on it.
      pruneDetached();
    }
    setDotLottieInstance(instance);
  }, []);

  // Keeps the registry's copy of this slot's autoplay intent true. Nothing is
  // unregistered on cleanup: an instance leaves the registry when its canvas
  // leaves the document, which is the only signal that tells a superseded
  // instance apart from a live one.
  useEffect(() => {
    if (!dotLottieInstance) return;
    registerPlayer(dotLottieInstance, autoplayProp);
  }, [autoplayProp, dotLottieInstance]);

  const src = toAbsoluteUrl(
    animKey
      ? readLottieSrc(animKey, stableTheme)
      : staticPair
        ? selectSrc(stableTheme, staticPair)
        : undefined
  );

  // Only keyed animations have a poster; raw-src callers pass their own markup.
  const poster = animKey ? getLottiePoster(animKey, stableTheme) : undefined;
  // The player below is keyed on the source, so switching theme mounts a fresh
  // canvas that is blank again. Without this the poster would stay hidden over
  // it, which is the gap the poster exists to cover.
  useEffect(() => {
    setHasPainted(false);
  }, [src]);

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

  // Identical either way; only where the frames are drawn differs.
  const playerProps = {
    src,
    autoplay,
    loop,
    useFrameInterpolation: false,
    renderConfig,
    layout: {
      fit: presentation?.fit ?? "contain",
      align: presentation?.align ?? [0.5, 0.5],
    },
    style: playerStyle,
    dotLottieRefCallback: handleInstance,
  } as const;

  return (
    <div
      className={`relative ${className || ""}`}
      style={{
        ...wrapperStyle,
        userSelect: protect ? "none" : undefined,
        WebkitUserSelect: protect ? "none" : undefined,
        WebkitTouchCallout: protect ? "none" : undefined,
        touchAction: protect ? "pan-x pan-y" : undefined,
        transition: "opacity 0.3s ease",
        opacity: isTransitioning ? 0.7 : 1,
      }}
      onContextMenu={protect ? prevent : undefined}
      onDragStart={protect ? prevent : undefined}
      draggable={protect ? false : undefined}
    >
      {/* dotLottie-react is the maintained React integration from LottieFiles.
          We keep interpolation disabled and cap DPR a bit on mobile to reduce
          raster cost without noticeably degrading the animation. The Worker
          variant draws the same frames from a worker thread. */}
      {canRenderOffThread ? (
        <DotLottieWorkerReact
          key={`${src}-${stableTheme}`}
          workerId={WORKER_ID}
          {...playerProps}
        />
      ) : (
        <DotLottieReact key={`${src}-${stableTheme}`} {...playerProps} />
      )}

      {/* Sits above the canvas, not below it: until the first frame is drawn the
          canvas is fully transparent, so anything behind it would show through. */}
      {poster && !hasPainted && (
        <LottiePoster poster={poster} scale={presentation?.scale} eager={true} />
      )}

      {/* Transparent overlay that intercepts all pointer/touch events to prevent
          right-click saving or dragging the animation when protect is enabled. */}
      {protect && (
        <div
          aria-hidden={true}
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

export default DotAnimPlayer;
