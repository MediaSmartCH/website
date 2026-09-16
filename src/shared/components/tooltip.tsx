/**
 * Small themed tooltip used instead of the native `title` attribute.
 *
 * The browser tooltip is an OS widget: it ignores the site palette, shows up
 * after an unpredictable delay, and cannot be styled — which made the controls
 * look off-theme and inconsistent from one surface to the next. This renders
 * the same bubble everywhere, in both themes, on hover and on keyboard focus.
 *
 * Callers keep their own `aria-label` on the interactive child; the bubble is
 * `aria-hidden` so screen readers do not announce the text twice.
 *
 * Keyboard focus is matched with `:focus-visible`, not `:focus`: a mouse click
 * leaves the button focused, and plain `:focus` kept the bubble on screen long
 * after the pointer had moved away — until something else took focus.
 */

import React from "react";

import { useAppSelector } from "@shared/hooks/store-hooks";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Text shown in the bubble. When empty, the child renders untouched. */
  label?: string;
  placement?: TooltipPlacement;
  /** Applied to the wrapper, which is sized to the child. */
  className?: string;
  children: React.ReactNode;
}

const POSITION_CLASSES: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

// The bubble slides in from the side it is anchored to.
const ENTER_CLASSES: Record<TooltipPlacement, string> = {
  top: "translate-y-1 group-hover:translate-y-0 group-has-[:focus-visible]:translate-y-0",
  bottom: "-translate-y-1 group-hover:translate-y-0 group-has-[:focus-visible]:translate-y-0",
  left: "translate-x-1 group-hover:translate-x-0 group-has-[:focus-visible]:translate-x-0",
  right: "-translate-x-1 group-hover:translate-x-0 group-has-[:focus-visible]:translate-x-0",
};

export default function Tooltip({
  label,
  placement = "bottom",
  className,
  children,
}: TooltipProps) {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  if (!label) {
    return <>{children}</>;
  }

  const bubbleClasses =
    currentTheme === "light"
      ? "bg-[#14172D] text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.45)]"
      : "bg-[#F4F4FF] text-[#14172D] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]";

  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="presentation"
        aria-hidden="true"
        className={`pointer-events-none absolute z-[60] whitespace-nowrap rounded-lg px-2.5 py-1.5 font-poppins text-[11px] font-medium leading-none opacity-0 transition-all duration-150 ease-out group-hover:opacity-100 group-has-[:focus-visible]:opacity-100 ${POSITION_CLASSES[placement]} ${ENTER_CLASSES[placement]} ${bubbleClasses}`}
      >
        {label}
      </span>
    </span>
  );
}
