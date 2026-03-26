import React from "react";

import { AppLanguage } from "config/languages";
import {
  ResolvedTheme,
  ThemePreference,
} from "store/slices/common/themeUtils";

import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";

type LocaleThemeControlsProps = {
  currentLanguage: AppLanguage;
  currentTheme: ResolvedTheme;
  themePreference: ThemePreference;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeChange: (theme: ThemePreference) => void;
  labels: {
    languageSelector: string;
    themeSelector: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    animToggle?: string;
    animOn?: string;
    animOff?: string;
  };
  size?: "xs" | "sm" | "md";
  className?: string;
  menuAlign?: "left" | "right";
  themeDisabled?: boolean;
  // Animation toggle — optional, forwarded into ThemeSelector pill.
  animationsEnabled?: boolean;
  onAnimationsToggle?: () => void;
};

const LocaleThemeControls: React.FC<LocaleThemeControlsProps> = ({
  currentLanguage,
  currentTheme,
  themePreference,
  onLanguageChange,
  onThemeChange,
  labels,
  size = "sm",
  className,
  menuAlign = "right",
  themeDisabled = false,
  animationsEnabled,
  onAnimationsToggle,
}) => (
  <div className={`flex items-center gap-2 ${className ?? ""}`}>
    <LanguageSelector
      currentLanguage={currentLanguage}
      currentTheme={currentTheme}
      onChange={onLanguageChange}
      ariaLabel={labels.languageSelector}
      size={size}
      menuAlign={menuAlign}
    />
    {/* Wrap ThemeSelector in a non-interactive overlay when disabled so the
        visual control remains visible but cannot be interacted with. */}
    <div className={themeDisabled ? "pointer-events-none opacity-50" : ""}>
      <ThemeSelector
        currentTheme={currentTheme}
        themePreference={themePreference}
        onChange={onThemeChange}
        labels={{
          selector: labels.themeSelector,
          light: labels.themeLight,
          dark: labels.themeDark,
          system: labels.themeSystem,
        }}
        size={size}
        animationsEnabled={animationsEnabled}
        onAnimationsToggle={onAnimationsToggle}
        // The label describes the *next* state (what will happen on click),
        // not the current state — consistent with how aria-pressed works for
        // screen readers announcing the action rather than the current value.
        animToggleLabel={
          animationsEnabled ? (labels.animOff ?? labels.animToggle) : (labels.animOn ?? labels.animToggle)
        }
      />
    </div>
  </div>
);

export default LocaleThemeControls;
