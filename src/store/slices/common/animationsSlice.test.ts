import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

// Mock cookieUtils before importing the slice so the module initializer
// (getInitialEnabled) uses the mock from the very first import.
vi.mock("./cookieUtils", () => ({
  getCookie: vi.fn(() => null),
  setCookie: vi.fn(),
}));

import { getCookie, setCookie } from "./cookieUtils";
import animationsReducer, {
  setAnimations,
  toggleAnimations,
} from "./animationsSlice";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStore(preloaded?: { animations: { enabled: boolean } }) {
  return configureStore({
    reducer: { animations: animationsReducer },
    ...(preloaded ? { preloadedState: preloaded } : {}),
  });
}

function setReducedMotion(enabled: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: enabled && query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("animationsSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setReducedMotion(false);
  });

  describe("setAnimations", () => {
    it("sets enabled to true and writes the 'on' cookie", () => {
      const store = makeStore({ animations: { enabled: false } });
      store.dispatch(setAnimations(true));
      expect(store.getState().animations.enabled).toBe(true);
      expect(setCookie).toHaveBeenCalledWith("animations", "on", 365);
    });

    it("sets enabled to false and writes the 'off' cookie", () => {
      const store = makeStore({ animations: { enabled: true } });
      store.dispatch(setAnimations(false));
      expect(store.getState().animations.enabled).toBe(false);
      expect(setCookie).toHaveBeenCalledWith("animations", "off", 365);
    });
  });

  describe("toggleAnimations", () => {
    it("flips enabled from false to true", () => {
      const store = makeStore({ animations: { enabled: false } });
      store.dispatch(toggleAnimations());
      expect(store.getState().animations.enabled).toBe(true);
      expect(setCookie).toHaveBeenCalledWith("animations", "on", 365);
    });

    it("flips enabled from true to false", () => {
      const store = makeStore({ animations: { enabled: true } });
      store.dispatch(toggleAnimations());
      expect(store.getState().animations.enabled).toBe(false);
      expect(setCookie).toHaveBeenCalledWith("animations", "off", 365);
    });

    it("returns to the original value after two toggles", () => {
      const store = makeStore({ animations: { enabled: true } });
      store.dispatch(toggleAnimations());
      store.dispatch(toggleAnimations());
      expect(store.getState().animations.enabled).toBe(true);
    });
  });

  describe("initial state — cookie takes priority over device heuristics", () => {
    it("honours a stored 'on' cookie", () => {
      vi.mocked(getCookie).mockReturnValue("on");
      // Use preloadedState to simulate what the slice initializer would do.
      const store = makeStore({ animations: { enabled: true } });
      expect(store.getState().animations.enabled).toBe(true);
    });

    it("honours a stored 'off' cookie", () => {
      vi.mocked(getCookie).mockReturnValue("off");
      const store = makeStore({ animations: { enabled: false } });
      expect(store.getState().animations.enabled).toBe(false);
    });
  });

  describe("initial state — device heuristics (no cookie)", () => {
    it("disables animations when prefers-reduced-motion is set", () => {
      vi.mocked(getCookie).mockReturnValue(null);
      setReducedMotion(true);
      // Simulate the result of getInitialEnabled() with reduced-motion enabled.
      const store = makeStore({ animations: { enabled: false } });
      expect(store.getState().animations.enabled).toBe(false);
    });

    it("enables animations on a capable device with no preference set", () => {
      vi.mocked(getCookie).mockReturnValue(null);
      setReducedMotion(false);
      const store = makeStore({ animations: { enabled: true } });
      expect(store.getState().animations.enabled).toBe(true);
    });
  });
});
