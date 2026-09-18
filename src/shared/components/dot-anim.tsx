import React, { lazy, memo, Suspense, useEffect, useMemo, useRef, useState } from "react";

import { useAppSelector } from "@shared/hooks/store-hooks";
import {
  getLottieAspectRatio,
  getLottiePoster,
  getLottiePresentation,
} from "@shared/config/lotties";
import {
  type DotAnimProps,
  hasAnim,
  LottiePoster,
} from "@shared/components/dot-anim-shared";

export type { DotAnimProps };


/**
 * The player, and with it the whole DotLottie runtime, in its own chunk.
 *
 * It used to be a static import in this module, which made every slot — even
 * one only showing a poster — pull in ~334KB of player code. On the homepage
 * that put it on the critical path of the first paint, since the hero renders
 * a DotAnim, and Lighthouse attributed 2.9s of script evaluation to it on a
 * throttled mobile CPU.
 *
 * Splitting it means the poster path costs nothing but the poster: the chunk is
 * requested only once a slot has both come into range and been cleared by
 * whenRuntimeIsFree(), and the Suspense boundary below keeps the poster up
 * while it arrives.
 */
const MemoizedPlayer = lazy(() =>
  import("@shared/components/dot-anim-player").catch(() => ({
    // A tab left open across a deployment asks for the previous build's
    // filename and gets a 404. Routes reload to recover (see chunk-recovery),
    // which is the right call for a page the visitor asked for — but this chunk
    // only ever carries decoration, so it degrades to the still frame instead.
    // Without this the rejection would reach the error boundary and take the
    // page down over an animation.
    default: PosterOnlyPlayer,
  }))
);

/** Stands in for the player when its chunk cannot be fetched. */
function PosterOnlyPlayer(props: DotAnimProps) {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const animKey = hasAnim(props) ? props.anim : undefined;

  const posterUrl = animKey ? getLottiePoster(animKey, theme) : undefined;

  if (!animKey || !posterUrl) return null;

  return (
    <LottiePoster
      src={posterUrl}
      scale={getLottiePresentation(animKey)?.scale}
      eager
    />
  );
}

// How early (in px) before entering the viewport an animation starts loading.
const PRELOAD_MARGIN = "400px 0px";

/**
 * The wider margin applied once the page has gone idle.
 *
 * Roughly a screenful and a half of runway below the fold, which covers the
 * distance a flick scroll travels before the player could paint, without
 * mounting animations the reader may never reach.
 */
const IDLE_PRELOAD_MARGIN = "1200px 0px";

/**
 * Ceiling on how long a placeholder may stay empty once the page has painted.
 *
 * The observer alone is not enough: a fast scroll travels further in one frame
 * than the preload margin, and the player still needs to fetch its chunk, the
 * WASM runtime and its .lottie before it paints. Measured on the homepage, a
 * quick scroll left eleven slots blank for several hundred milliseconds.
 */
const IDLE_MOUNT_TIMEOUT_MS = 1500;

/**
 * Runs `callback` when the main thread is next free, or after
 * IDLE_MOUNT_TIMEOUT_MS at the latest. Returns a cancel function.
 *
 * requestIdleCallback is unavailable in Safari before 17, so a plain timer
 * stands in there — the deadline is what matters, not the idle detection.
 */
function scheduleIdleMount(callback: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const handle = requestIdleCallback(callback, {
      timeout: IDLE_MOUNT_TIMEOUT_MS,
    });
    return () => cancelIdleCallback(handle);
  }

  const handle = window.setTimeout(callback, IDLE_MOUNT_TIMEOUT_MS);
  return () => window.clearTimeout(handle);
}

/**
 * How long the player may wait for a quiet main thread before mounting anyway.
 *
 * Longer than IDLE_MOUNT_TIMEOUT_MS on purpose: that one races a scroll, this
 * one races the page load, which is the slower of the two.
 */
const RUNTIME_BUDGET_TIMEOUT_MS = 2500;

/**
 * Resolves once the page has painted and the main thread has had a free slot.
 *
 * Mounting DotLottie costs ~2.8s of script evaluation on a throttled mobile
 * CPU — measured as the single largest main-thread item on the homepage, more
 * than the whole rest of the app combined. The above-the-fold animation used to
 * pay that during the first paint, because its slot intersects the viewport on
 * mount and the viewport gate let it through immediately.
 *
 * Waiting costs nothing visually: every slot already renders the animation's
 * own first frame as a poster, so the box is filled the entire time. All the
 * gate changes is *when* the frames start moving.
 *
 * Shared at module level so a page full of slots waits on one signal rather
 * than scheduling a callback each.
 */
let runtimeBudget: Promise<void> | undefined;

function whenRuntimeIsFree(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  runtimeBudget ??= new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timer = window.setTimeout(done, RUNTIME_BUDGET_TIMEOUT_MS);

    // Two frames puts this after the first paint has actually been committed,
    // not merely scheduled; the idle callback then waits for a gap in the work
    // that paint kicked off.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(
            () => {
              window.clearTimeout(timer);
              done();
            },
            { timeout: RUNTIME_BUDGET_TIMEOUT_MS }
          );
          return;
        }

        window.clearTimeout(timer);
        done();
      })
    );
  });

  return runtimeBudget;
}

type PosterBoxProps = {
  className?: string;
  style: React.CSSProperties;
  posterUrl?: string;
  scale?: number;
  eager?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/** The animation's box, showing its still frame and nothing else. */
function PosterBox({ className, style, posterUrl, scale, eager, ref }: PosterBoxProps) {
  return (
    <div ref={ref} aria-hidden={true} className={`relative ${className || ""}`} style={style}>
      {posterUrl && <LottiePoster src={posterUrl} scale={scale} eager={eager} />}
    </div>
  );
}

/**
 * Viewport gate around the player.
 *
 * Mounting DotLottie triggers the ~1.7MB WASM runtime plus the .lottie file for
 * that animation. Pages stack several animations, so mounting them all up front
 * saturates the network during the first paint. This renders a zero-cost
 * placeholder with the exact same box until the animation is close to the
 * viewport, which keeps layout stable and leaves the above-the-fold animation
 * loading immediately (it intersects on mount).
 *
 * The gate exists to keep that payload off the *critical path*, not to keep it
 * off the page: once the first paint is done and the thread goes idle, anything
 * still gated mounts anyway, so scrolling never reveals an empty box.
 */
function DotAnim(props: DotAnimProps) {
  const { className, style } = props;
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const animKey = hasAnim(props) ? props.anim : undefined;
  const intrinsicAspectRatio = animKey ? getLottieAspectRatio(animKey) : undefined;
  const presentation = animKey ? getLottiePresentation(animKey) : undefined;
  const posterUrl = animKey ? getLottiePoster(animKey, theme) : undefined;

  const placeholderRef = useRef<HTMLDivElement | null>(null);
  // Browsers without IntersectionObserver render the player straight away.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  // Whether the main thread has room for the player yet. Separate from inView
  // so the two questions stay independent: "should this slot animate?" and
  // "can the page afford to start it right now?".
  const [runtimeReady, setRuntimeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    whenRuntimeIsFree().then(() => {
      if (!cancelled) setRuntimeReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (inView) return;

    const element = placeholderRef.current;
    if (!element) return;

    // A zero-area target can never report a meaningful intersection, so mount
    // straight away rather than risk an animation that never appears.
    const { width, height } = element.getBoundingClientRect();
    if (width === 0 && height === 0) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    observer.observe(element);

    // Second arm: once the page is idle, widen the margin so the next screenful
    // or two is already warm when a fast scroll outruns PRELOAD_MARGIN.
    //
    // This used to mount every remaining slot unconditionally. On the homepage
    // that meant eight DotLottie players — the hero, the "about" animation and
    // the six service cards — all instantiating within the same idle callback,
    // which Lighthouse attributed 2.9s of script evaluation to on a throttled
    // mobile CPU. Slots further down than IDLE_PRELOAD_MARGIN gain nothing from
    // mounting early: they keep showing their poster, which is the animation's
    // own first frame, until the reader actually approaches them.
    let idleObserver: IntersectionObserver | undefined;

    const cancelIdleMount = scheduleIdleMount(() => {
      idleObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setInView(true);
            idleObserver?.disconnect();
          }
        },
        { rootMargin: IDLE_PRELOAD_MARGIN }
      );

      idleObserver.observe(element);
    });

    return () => {
      observer.disconnect();
      idleObserver?.disconnect();
      cancelIdleMount();
    };
  }, [inView]);

  const placeholderStyle = useMemo<React.CSSProperties>(() => {
    const nextStyle: React.CSSProperties = { display: "block", ...style };

    if (intrinsicAspectRatio && nextStyle.aspectRatio === undefined) {
      nextStyle.aspectRatio = `${intrinsicAspectRatio}`;
    }

    return nextStyle;
  }, [intrinsicAspectRatio, style]);

  if (inView && runtimeReady) {
    // The boundary belongs here rather than at the thirteen call sites: reading
    // the animation URL suspends, and without a nearer boundary each of them
    // fell back to a spinner — the empty-looking box this poster replaces.
    return (
      <Suspense
        fallback={
          <PosterBox
            className={className}
            style={placeholderStyle}
            posterUrl={posterUrl}
            scale={presentation?.scale}
            eager={true}
          />
        }
      >
        <MemoizedPlayer {...props} />
      </Suspense>
    );
  }

  return (
    <PosterBox
      ref={placeholderRef}
      className={className}
      style={placeholderStyle}
      posterUrl={posterUrl}
      scale={presentation?.scale}
    />
  );
}

export default memo(DotAnim);
