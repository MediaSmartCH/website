/**
 * The one dialog envelope used by every popup on the site (cookie consent,
 * portfolio, booking).
 *
 * Before this existed each popup had grown its own backdrop, radius, header
 * layout and close button, so opening two of them in a row felt like visiting
 * two different sites. Everything shared now lives here:
 *
 *   - the blurred backdrop, the panel surface, the 28px radius and the
 *     open/close transition;
 *   - a header with the title block on the left and, on the right, the same
 *     language / theme / animation pills plus the same round close button;
 *   - a single scrolling body region, so the header never scrolls away.
 *
 * The theme pill is wired here too: switching the theme from inside a popup
 * raises the same veil as switching it from the navbar.
 */

import React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import LocaleThemeControls from "@shared/components/locale-theme-controls";
import ThemeSwitchOverlay from "@shared/components/theme-switch-overlay";
import Tooltip from "@shared/components/tooltip";
import { useInterfaceControls } from "@shared/hooks/use-interface-controls";
import { useThemeSwitch } from "@shared/hooks/use-theme-switch";

/** Every popup shares one stacking level; the image lightbox sits above it. */
export const MODAL_Z_INDEX = 999999;

export interface ModalShellProps {
  /** Id of the element labelling the dialog, owned by the caller's title. */
  titleId: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Optional gradient badge shown left of the title. */
  icon?: React.ReactNode;
  /** Free-form block under the title row, spanning the full header width. */
  headerFooter?: React.ReactNode;
  /**
   * "default" fits text-first popups; "wide" is for the portfolio grid, which
   * needs the extra columns to stay readable.
   */
  size?: "default" | "wide";
  /** True while the caller plays its own closing transition. */
  isClosing?: boolean;
  closeLabel: string;
  onClose: () => void;
  /** Rendered in the scrolling region. */
  children: React.ReactNode;
  /** Pinned under the body, outside the scroll area. */
  footer?: React.ReactNode;
  /** Hide the locale/theme pills (compact surfaces that show them elsewhere). */
  hideControls?: boolean;
  /** Blocks the close button, e.g. while a form is submitting. */
  closeDisabled?: boolean;
  /** Extra classes on the scrolling region, e.g. a min-height for wizards. */
  bodyClassName?: string;
}

export default function ModalShell({
  titleId,
  title,
  subtitle,
  icon,
  headerFooter,
  size = "default",
  isClosing = false,
  closeLabel,
  onClose,
  children,
  footer,
  hideControls = false,
  closeDisabled = false,
  bodyClassName,
}: ModalShellProps) {
  const {
    currentLanguage,
    currentTheme,
    themePreference,
    animationsEnabled,
    changeLanguage,
    changeTheme,
    flipAnimations,
    labels,
  } = useInterfaceControls();

  const { isThemeChanging, requestThemeChange } = useThemeSwitch(
    currentTheme,
    themePreference,
    changeTheme,
    300
  );

  const isLight = currentTheme === "light";

  const panelClasses = isLight
    ? "bg-white text-[#14172D] border-[#E6E8F7] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)]"
    : "bg-[#1B1936] text-[#F6F6F6] border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.65)]";
  const dividerClass = isLight ? "border-[#E6E8F7]" : "border-white/10";
  const subtitleClass = isLight ? "text-[#6B7280]" : "text-[#CFCDE0]";
  const closeClasses = isLight
    ? "border-[#D9DCF2] text-[#14172D] hover:bg-[#F4F4FF]"
    : "border-white/10 text-[#F6F6F6] hover:bg-white/10";
  const backdropClass = isLight ? "bg-black/30" : "bg-black/60";

  const content = (
    <>
      {isThemeChanging && (
        <ThemeSwitchOverlay theme={currentTheme} language={currentLanguage} />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ zIndex: MODAL_Z_INDEX }}
        className={`fixed inset-0 flex items-center justify-center p-3 sm:p-6 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          type="button"
          aria-label={closeLabel}
          tabIndex={-1}
          onClick={onClose}
          className={`absolute inset-0 backdrop-blur-md ${backdropClass}`}
        />

        <div
          className={`relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-[28px] border transition-all duration-300 ${panelClasses} ${
            size === "wide" ? "max-w-6xl" : "max-w-2xl"
          } ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
        >
          <div
            className={`flex-none border-b px-5 py-5 md:px-8 md:py-6 ${dividerClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {icon}
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="font-redDisplay text-[22px] font-bold leading-tight sm:text-[26px]"
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p
                      className={`mt-0.5 font-poppins text-[13px] sm:text-[14px] ${subtitleClass}`}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {!hideControls && (
                  <LocaleThemeControls
                    currentLanguage={currentLanguage}
                    currentTheme={currentTheme}
                    themePreference={themePreference}
                    onLanguageChange={changeLanguage}
                    onThemeChange={requestThemeChange}
                    animationsEnabled={animationsEnabled}
                    onAnimationsToggle={flipAnimations}
                    labels={labels}
                    size="xs"
                    themeDisabled={isThemeChanging}
                    className="hidden sm:flex"
                  />
                )}

                <Tooltip label={closeLabel} placement="left">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={closeDisabled}
                    aria-label={closeLabel}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition duration-200 disabled:opacity-50 ${closeClasses}`}
                  >
                    <X size={17} strokeWidth={2.2} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Below `sm` the pills move under the title so they never squeeze
                the heading into a two-character column. */}
            {!hideControls && (
              <LocaleThemeControls
                currentLanguage={currentLanguage}
                currentTheme={currentTheme}
                themePreference={themePreference}
                onLanguageChange={changeLanguage}
                onThemeChange={requestThemeChange}
                animationsEnabled={animationsEnabled}
                onAnimationsToggle={flipAnimations}
                labels={labels}
                size="xs"
                themeDisabled={isThemeChanging}
                className="mt-4 flex sm:hidden"
              />
            )}

            {headerFooter}
          </div>

          <div
            className={`portfolio-scrollbar flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 md:px-8 md:py-6 ${bodyClassName ?? ""}`}
          >
            {children}
          </div>

          {footer && (
            <div
              className={`flex-none border-t px-5 py-4 md:px-8 md:py-5 ${dividerClass}`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (typeof document === "undefined") return null;

  return createPortal(content, document.body);
}
