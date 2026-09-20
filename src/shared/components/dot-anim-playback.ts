import type { DotLottie, DotLottieWorker } from "@lottiefiles/dotlottie-react";

/**
 * Either renderer: the worker one where the browser can hand a canvas to a
 * worker, the main-thread one where it cannot. Both answer the same commands,
 * which is all this module needs of them.
 */
export type LottiePlayer = DotLottie | DotLottieWorker;

/**
 * Central playback authority for every DotLottie instance on the page.
 *
 * The player component used to hold its instance in React state and pause it
 * from an effect. That only ever reached the instance React happened to know
 * about, so any other live instance drawing on the same canvas — the library
 * creates a second one under StrictMode's double ref attach — kept running,
 * and the animation the reader was looking at carried on playing until
 * something remounted it.
 *
 * Here the preference is the single source of truth: every instance registers
 * itself the moment it exists, so a flip reaches all of them at once, and an
 * instance created later starts out obeying the flag rather than autoplaying.
 *
 * Three things decide whether an instance runs, and all three have to agree:
 *   - the reader's animation preference (the header toggle),
 *   - the slot's own autoplay intent,
 *   - whether the canvas is on screen and the tab is in the foreground.
 */

type PlayerEntry = {
  /** The slot's own intent; a slot with autoplay={false} stays paused either way. */
  autoplay: boolean;
  /** Whether the canvas is currently within the viewport's play margin. */
  visible: boolean;
  /** Detaches the load listener that re-applies the flag after the file parses. */
  release: () => void;
};

const players = new Map<LottiePlayer, PlayerEntry>();

let playbackEnabled = true;
let pageVisible = true;

/**
 * How far outside the viewport, in pixels, an animation keeps running.
 *
 * Wide enough that a normal scroll never reveals a frozen frame — the player
 * is already running by the time its box appears — and narrow enough that the
 * ones a reader has scrolled well past stop costing anything.
 */
const PLAY_MARGIN_PX = 300;

/**
 * Whether `canvas` sits inside the same band the observer uses.
 *
 * One rect read, at the moment a player is created — which already costs far
 * more than a read — and it saves the frames an off-screen player would
 * otherwise spend running before the observer's first callback arrives.
 */
function isWithinPlayMargin(canvas: HTMLCanvasElement | undefined): boolean {
  if (!canvas || typeof window === "undefined") return true;

  const rect = canvas.getBoundingClientRect();
  return (
    rect.bottom > -PLAY_MARGIN_PX &&
    rect.top < window.innerHeight + PLAY_MARGIN_PX
  );
}

/**
 * The worker player answers every command with a promise. Nothing here waits
 * on one — the calls are idempotent and the next scroll or toggle re-applies
 * the state anyway — but an instance torn down mid-flight would otherwise
 * reject into an unhandled rejection.
 */
function fire(command: Promise<void> | void) {
  if (command && typeof command.catch === "function") command.catch(() => {});
}

function canvasOf(instance: LottiePlayer): HTMLCanvasElement | undefined {
  const canvas = instance.canvas;
  return canvas instanceof HTMLCanvasElement ? canvas : undefined;
}

function isDetached(instance: LottiePlayer): boolean {
  const canvas = canvasOf(instance);
  // Only a real DOM canvas can be detached; the worker/offscreen surfaces this
  // union also covers have no document to leave.
  return !!canvas && !canvas.isConnected;
}

/**
 * Watches every registered canvas and keeps `visible` current.
 *
 * One observer for the whole page rather than one per player: the callback
 * fires once with all the entries that crossed, which is also what keeps a
 * long scroll from turning into a burst of separate callbacks.
 *
 * A single animation is the largest main-thread cost on the site — each frame
 * runs the WASM renderer and repaints a canvas — so leaving the ones the
 * reader has scrolled past running is pure waste: work nobody can see, on
 * exactly the devices least able to afford it.
 */
let visibilityObserver: IntersectionObserver | undefined;

/** Reverse lookup for the observer, whose entries only carry the element. */
const byCanvas = new WeakMap<HTMLCanvasElement, LottiePlayer>();

function observer(): IntersectionObserver | undefined {
  if (typeof IntersectionObserver === "undefined") return undefined;

  visibilityObserver ??= new IntersectionObserver(
    (entries) => {
      let changed = false;

      entries.forEach((entry) => {
        const instance = byCanvas.get(entry.target as HTMLCanvasElement);
        if (!instance) return;

        const record = players.get(instance);
        if (!record || record.visible === entry.isIntersecting) return;

        record.visible = entry.isIntersecting;
        changed = true;
      });

      if (changed) {
        players.forEach((entry, instance) => apply(instance, entry));
      }
    },
    { rootMargin: `${PLAY_MARGIN_PX}px 0px` }
  );

  return visibilityObserver;
}

/**
 * Drops instances whose canvas has left the document.
 *
 * Their own component can no longer reach them — the library only reports a
 * teardown for the instance it is currently holding — so this is where they
 * stop being tracked.
 */
export function pruneDetached() {
  players.forEach((_entry, instance) => {
    if (isDetached(instance)) unregisterPlayer(instance);
  });
}

/**
 * Two independent questions, and DotLottie has a verb for each.
 *
 * play/pause answers "does the reader want this playing?" — the header toggle
 * and the slot's own intent. freeze/unfreeze answers "is it worth drawing
 * right now?" — whether the canvas is on screen and the tab in front. Keeping
 * them apart means scrolling past an animation never touches the state the
 * reader chose, and scrolling back finds it exactly as they left it.
 */
function apply(instance: LottiePlayer, entry: PlayerEntry) {
  if (playbackEnabled && entry.autoplay) {
    fire(instance.play());
  } else {
    fire(instance.pause());
  }

  if (pageVisible && entry.visible) {
    fire(instance.unfreeze());
  } else {
    fire(instance.freeze());
  }
}

/**
 * Starts governing `instance` and puts it in the right state right away.
 *
 * Autoplay lives in the WASM config, so an instance created while animations
 * were still on will start playing once its file finishes parsing, however
 * early we paused it. Re-applying on "load" closes that window.
 */
export function registerPlayer(instance: LottiePlayer, autoplay: boolean) {
  pruneDetached();

  const existing = players.get(instance);
  existing?.release();

  const onLoad = () => {
    const entry = players.get(instance);
    if (entry) apply(instance, entry);
  };

  instance.addEventListener("load", onLoad);

  const canvas = canvasOf(instance);

  const entry: PlayerEntry = {
    autoplay,
    // Read the position now rather than waiting for the observer's first
    // callback, which lands a frame later: the idle arm in dot-anim mounts
    // slots up to 1200px below the fold, and those would otherwise get a
    // frame or two of playback before being told to stop.
    visible: existing?.visible ?? isWithinPlayMargin(canvas),
    release: () => {
      instance.removeEventListener("load", onLoad);
      if (canvas) observer()?.unobserve(canvas);
    },
  };

  if (canvas) {
    byCanvas.set(canvas, instance);
    observer()?.observe(canvas);
  }

  players.set(instance, entry);
  apply(instance, entry);
}

function unregisterPlayer(instance: LottiePlayer) {
  players.get(instance)?.release();
  players.delete(instance);
}

/**
 * Applies the global preference to every registered instance.
 *
 * Cheap to call from every mounted player: the flag only ever moves when the
 * reader flips the toggle, and an unchanged value returns immediately.
 */
export function setPlaybackEnabled(enabled: boolean) {
  if (enabled === playbackEnabled) return;
  playbackEnabled = enabled;

  pruneDetached();
  players.forEach((entry, instance) => apply(instance, entry));
}

/**
 * Stops every animation while the tab is in the background.
 *
 * Browsers already throttle timers there, but a canvas driven by
 * requestAnimationFrame keeps being scheduled in some cases, and a paused
 * player costs nothing to resume.
 */
if (typeof document !== "undefined") {
  pageVisible = document.visibilityState !== "hidden";

  document.addEventListener("visibilitychange", () => {
    const next = document.visibilityState !== "hidden";
    if (next === pageVisible) return;

    pageVisible = next;
    pruneDetached();
    players.forEach((entry, instance) => apply(instance, entry));
  });
}
