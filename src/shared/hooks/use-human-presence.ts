import { useSyncExternalStore } from "react";

/**
 * Whether anything has happened on this page that a person would cause.
 *
 * Used to decide when it is safe to put a contact address into the DOM as
 * plain text. A scraper that renders JavaScript loads the page, reads the DOM
 * and leaves; it does not move a pointer, scroll, or press a key, because none
 * of that is needed to extract text. A person reading the page does at least
 * one of them within a second, without noticing.
 *
 * This is a signal, not a proof: an emulated `mousemove` defeats it. What it
 * removes is the cheap case — dump the DOM of every page, regex the result —
 * which is how automated collection actually works at scale.
 *
 * The listeners are module-level and attached once no matter how many
 * components ask, and every one of them is passive: this must never be a cost
 * on scrolling.
 */

const PRESENCE_EVENTS = [
  "pointermove",
  "pointerdown",
  "touchstart",
  "wheel",
  "scroll",
  // Keyboard and focus matter for more than completeness: they are how someone
  // using a screen reader or navigating by keyboard reaches the address, and
  // they must not be left with the scrambled version.
  "keydown",
  "focusin",
] as const;

let present = false;
const subscribers = new Set<() => void>();

function markPresent() {
  if (present) return;

  present = true;
  for (const notify of subscribers) {
    notify();
  }
}

function subscribe(onChange: () => void): () => void {
  subscribers.add(onChange);

  if (subscribers.size === 1 && !present) {
    for (const event of PRESENCE_EVENTS) {
      window.addEventListener(event, markPresent, { passive: true, once: true });
    }
  }

  return () => {
    subscribers.delete(onChange);
  };
}

export function useHumanPresence(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => present,
    // Nothing has happened before the page exists, so the pre-interaction
    // rendering is also the correct one to produce without a browser.
    () => false,
  );
}
