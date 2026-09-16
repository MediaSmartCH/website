import React from "react";

/**
 * The language + theme pills shown in the consent banner's header.
 *
 * Both the summary and the detailed panel render the same control with the same
 * props, so the prop list lives here rather than being spelled out twice.
 */

import LocaleThemeControls from "@shared/components/locale-theme-controls";
import type { AppLanguage } from "@shared/config/languages";
import type { ResolvedTheme, ThemePreference } from "@store/slices/common/themeUtils";

export interface ConsentLocaleControlsProps {
  language: AppLanguage;
  theme: ResolvedTheme;
  themePreference: ThemePreference;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeChange: (theme: ThemePreference) => void;
  labels: React.ComponentProps<typeof LocaleThemeControls>["labels"];
  /** True while a theme swap is in flight, so the control cannot be re-triggered. */
  themeDisabled: boolean;
}

export default function ConsentLocaleControls({
  language,
  theme,
  themePreference,
  onLanguageChange,
  onThemeChange,
  labels,
  themeDisabled,
}: ConsentLocaleControlsProps) {
  return (
    <LocaleThemeControls
      currentLanguage={language}
      currentTheme={theme}
      themePreference={themePreference}
      onLanguageChange={onLanguageChange}
      onThemeChange={onThemeChange}
      size="xs"
      labels={labels}
      themeDisabled={themeDisabled}
      className="max-w-full flex-wrap justify-end sm:flex-nowrap"
    />
  );
}
