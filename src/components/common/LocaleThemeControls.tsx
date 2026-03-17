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
  };
  size?: "xs" | "sm" | "md";
  className?: string;
  menuAlign?: "left" | "right";
  themeDisabled?: boolean;
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
      />
    </div>
  </div>
);

export default LocaleThemeControls;
