import type { DotLottie } from "@lottiefiles/dotlottie-react";

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
 */

type PlayerEntry = {
  /** The slot's own intent; a slot with autoplay={false} stays paused either way. */
  autoplay: boolean;
  /** Detaches the load listener that re-applies the flag after the file parses. */
  release: () => void;
};

const players = new Map<DotLottie, PlayerEntry>();

let playbackEnabled = true;

function isDetached(instance: DotLottie): boolean {
  const canvas = instance.canvas;
  // Only a real DOM canvas can be detached; the worker/offscreen surfaces this
  // union also covers have no document to leave.
  return canvas instanceof HTMLCanvasElement && !canvas.isConnected;
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

function apply(instance: DotLottie, entry: PlayerEntry) {
  if (playbackEnabled && entry.autoplay) {
    instance.play();
  } else {
    instance.pause();
  }
}

/**
 * Starts governing `instance` and puts it in the right state right away.
 *
 * Autoplay lives in the WASM config, so an instance created while animations
 * were still on will start playing once its file finishes parsing, however
 * early we paused it. Re-applying on "load" closes that window.
 */
export function registerPlayer(instance: DotLottie, autoplay: boolean) {
  pruneDetached();
  players.get(instance)?.release();

  const onLoad = () => {
    const entry = players.get(instance);
    if (entry) apply(instance, entry);
  };

  instance.addEventListener("load", onLoad);

  const entry: PlayerEntry = {
    autoplay,
    release: () => instance.removeEventListener("load", onLoad),
  };

  players.set(instance, entry);
  apply(instance, entry);
}

function unregisterPlayer(instance: DotLottie) {
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
