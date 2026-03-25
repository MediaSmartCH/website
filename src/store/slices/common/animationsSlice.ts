import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";

type NavigatorWithExtras = Navigator & {
  deviceMemory?: number;
};

/**
 * Detect whether the current device is likely too slow for heavy animations.
 * Returns true if animations should be disabled by default.
 */
function detectLowPerformance(): boolean {
  if (typeof window === "undefined") return false;

  // Respect the OS-level "reduce motion" accessibility setting.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  // Very low CPU core count signals an old or budget device.
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 2) return true;

  // Low RAM (< 2 GB) — experimental but widely supported on Android/iOS.
  const memory = (navigator as NavigatorWithExtras).deviceMemory;
  if (typeof memory === "number" && memory < 2) return true;

  return false;
}

const COOKIE_KEY = "animations";

function getInitialEnabled(): boolean {
  const stored = getCookie(COOKIE_KEY);
  if (stored === "on") return true;
  if (stored === "off") return false;
  // No explicit preference → derive from device capability.
  return !detectLowPerformance();
}

type AnimationsState = {
  enabled: boolean;
};

const animationsSlice = createSlice({
  name: "animations",
  initialState: {
    enabled: getInitialEnabled(),
  } as AnimationsState,
  reducers: {
    setAnimations: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
      setCookie(COOKIE_KEY, action.payload ? "on" : "off", 365);
    },
    toggleAnimations: (state) => {
      state.enabled = !state.enabled;
      setCookie(COOKIE_KEY, state.enabled ? "on" : "off", 365);
    },
  },
});

export const { setAnimations, toggleAnimations } = animationsSlice.actions;
export default animationsSlice.reducer;
