export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export const isThemePreference = (
  value: string | null
): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

// Returns null in SSR environments and in browsers that do not support matchMedia
// (very old or non-standard), so callers must handle the null case.
export const getThemeMediaQuery = (): MediaQueryList | null => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  return window.matchMedia(SYSTEM_THEME_QUERY);
};

export const getSystemTheme = (): ResolvedTheme =>
  getThemeMediaQuery()?.matches ? "dark" : "light";

export const resolveThemePreference = (
  themePreference: ThemePreference
): ResolvedTheme =>
  themePreference === "system" ? getSystemTheme() : themePreference;
