import React from "react";

import {
  resolveThemePreference,
  ThemePreference,
} from "@store/slices/common/themeUtils";

/**
 * Wraps a theme change with the full-screen swap veil.
 *
 * Every surface exposing the theme pill (navbar, consent banner, portfolio and
 * booking modals) needs the same three things: ignore a change that resolves to
 * the theme already showing, raise the veil while the palette and the lottie
 * assets repaint, and lower it again. Keeping that in one hook is what makes
 * the behaviour identical wherever the control is rendered.
 */
export function useThemeSwitch(
  currentTheme: string,
  themePreference: ThemePreference,
  changeTheme: (theme: ThemePreference) => void,
  // Lottie-heavy surfaces need a touch longer before the veil comes down.
  holdMs = 500
) {
  const [isThemeChanging, setIsThemeChanging] = React.useState(false);

  const requestThemeChange = (nextTheme: ThemePreference) => {
    if (isThemeChanging || nextTheme === themePreference) return;

    // Switching between "dark" and "system" at night changes the preference
    // but not a single pixel — no point veiling the page for that.
    const shouldShowVeil = resolveThemePreference(nextTheme) !== currentTheme;

    if (shouldShowVeil) {
      setIsThemeChanging(true);
    }

    changeTheme(nextTheme);

    if (!shouldShowVeil) return;

    setTimeout(() => setIsThemeChanging(false), holdMs);
  };

  return { isThemeChanging, requestThemeChange };
}

export default useThemeSwitch;
