/**
 * Guards the pairing between animations and their posters.
 *
 * A missing poster is invisible in development — the animation still plays, it
 * just leaves an empty box for a second or two on a slow connection, which is
 * exactly the regression the posters exist to prevent. Failing here instead
 * means `node scripts/generate-lottie-posters.mjs` was not re-run.
 */

import { describe, expect, it } from "vitest";

import {
  getLottieAspectRatio,
  getLottiePoster,
  getLottiePresentation,
  LOTTIE_KEYS,
  type LottieKey,
} from "./lotties";

describe("lottie posters", () => {
  it("exposes at least one key", () => {
    expect(LOTTIE_KEYS.length).toBeGreaterThan(0);
  });

  it.each(LOTTIE_KEYS)("has a light and a dark poster for %s", (key: LottieKey) => {
    expect(getLottiePoster(key, "light")).toBeTruthy();
    expect(getLottiePoster(key, "dark")).toBeTruthy();
  });

  it.each(LOTTIE_KEYS)("gives %s a usable aspect ratio", (key: LottieKey) => {
    const ratio = getLottieAspectRatio(key);
    expect(Number.isFinite(ratio)).toBe(true);
    expect(ratio).toBeGreaterThan(0);
  });

  it("serves a distinct file per theme where both exist", () => {
    for (const key of LOTTIE_KEYS) {
      expect(getLottiePoster(key, "dark")).not.toBe(getLottiePoster(key, "light"));
    }
  });

  it("keeps every presentation box positive", () => {
    for (const key of LOTTIE_KEYS) {
      const { width, height } = getLottiePresentation(key);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    }
  });
});
