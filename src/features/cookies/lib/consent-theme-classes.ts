/**
 * Theme-dependent Tailwind classes for the consent banner.
 *
 * The banner is the one surface that cannot use the global colour tokens: it is
 * a self-contained modal with its own greyscale, and several of its values
 * (bg-gray-50 vs #1a1a2e, border-gray-100 vs border-gray-600) have no semantic
 * role anywhere else on the site. Introducing tokens for them would grow the
 * palette for a single component.
 *
 * So the pairs live here, in one place, instead of being spelled out inline at
 * every one of the forty-odd call sites they had.
 */

export type ResolvedTheme = "light" | "dark";

export interface ConsentThemeClasses {
  modal: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSecondary: string;
  bg: string;
  bgSecondary: string;
  hover: string;
  buttonSecondary: string;
}

export function getConsentThemeClasses(theme: string): ConsentThemeClasses {
  const isLight = theme === "light";

  return {
    modal: isLight ? "bg-white" : "bg-[#2B284C]",
    text: isLight ? "text-gray-900" : "text-[#F6F6F6]",
    textSecondary: isLight ? "text-gray-600" : "text-[#E5E5E5]",
    textMuted: isLight ? "text-gray-500" : "text-[#B8B8B8]",
    border: isLight ? "border-gray-100" : "border-gray-600",
    borderSecondary: isLight ? "border-gray-200" : "border-gray-500",
    bg: isLight ? "bg-gray-50" : "bg-[#1a1a2e]",
    bgSecondary: isLight ? "bg-white" : "bg-[#16213e]",
    hover: isLight ? "hover:bg-gray-200" : "hover:bg-gray-600",
    buttonSecondary: isLight
      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
      : "bg-gray-600 text-gray-200 hover:bg-gray-500",
  };
}
