/**
 * The site's "back to where you came from" pill.
 *
 * Taken from the support-contract page, which had grown it inline: a rounded,
 * lightly tinted chip with the arrow nudging left on hover, themed in both
 * palettes. The project pages needed the same affordance, and an underlined
 * gradient link — which is what they had — is a second answer to a question
 * the site had already answered.
 *
 * Placement is the caller's: the support page pins it over the hero, the
 * project pages let it sit in the flow above the title.
 */

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAppSelector } from "@shared/hooks/store-hooks";
import { useLangLink } from "@shared/hooks/use-localized-path";

export default function BackLink({
  to,
  children,
  className = "",
}: {
  /** Path without the language prefix; localised here. */
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  const theme = useAppSelector((state) => state.theme.currentTheme);
  const { L } = useLangLink();
  const isLight = theme === "light";

  return (
    <Link
      to={L(to)}
      className={`pointer-events-auto group inline-flex items-center gap-[6px] font-poppins text-[13px] font-medium px-[14px] py-[7px] rounded-full backdrop-blur-sm transition-all duration-200 ${
        isLight
          ? "bg-[#EEE9FF]/80 text-[#5f75f5] border border-[#c4b8ff]/60 hover:bg-[#E4DCFF]/90"
          : "bg-[#2B284C]/80 text-[#A89FFF] border border-[#6B5FBB]/50 hover:bg-[#332E5C]/90"
      } ${className}`}
    >
      <ArrowLeft
        size={13}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
