/**
 * Theme-dependent Tailwind classes for the portfolio gallery.
 *
 * Like the consent banner, the gallery has its own surface treatment —
 * gradient teaser cards, image shells, a tinted backdrop — that no other part
 * of the site reuses. Adding global tokens for them would grow the palette for
 * one feature, so the light/dark pairs are collected here instead.
 */

export interface PortfolioThemeClasses {
  isLight: boolean;
  card: string;
  panel: string;
  mutedText: string;
  strongText: string;
  imageShell: string;
  backdrop: string;
  teaserCard: string;
  teaserMutedText: string;
}

export function getPortfolioThemeClasses(theme: string): PortfolioThemeClasses {
  const isLight = theme === "light";

  return {
    isLight,
    card: isLight
      ? "border-[#D8DBF4] bg-white shadow-[0_18px_50px_rgba(20,23,45,0.08)]"
      : "border-white/10 bg-[#201D39] shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
    panel: isLight
      ? "border-white/70 bg-white text-[#14172D]"
      : "border-white/10 bg-[#221F3D] text-[#F6F6F6]",
    mutedText: isLight ? "text-[#5C5777]" : "text-[#D6D4E4]",
    strongText: isLight ? "text-[#14172D]" : "text-[#F6F6F6]",
    imageShell: isLight
      ? "border-[#E3E6FA] bg-[#F4F4FF]"
      : "border-white/10 bg-[#2B284C]",
    backdrop: isLight ? "bg-[rgba(15,23,42,0.18)]" : "bg-[rgba(3,7,18,0.34)]",
    teaserCard: isLight
      ? "border-transparent bg-[linear-gradient(135deg,#14172D_0%,#5F75F5_55%,#B514FD_100%)] text-white shadow-[0_20px_60px_rgba(95,117,245,0.28)]"
      : "border-white/10 bg-[linear-gradient(135deg,#221F3D_0%,#34306A_55%,#5F75F5_100%)] text-white shadow-[0_20px_60px_rgba(8,10,20,0.4)]",
    teaserMutedText: isLight ? "text-white/80" : "text-[#E6E3FF]",
  };
}
