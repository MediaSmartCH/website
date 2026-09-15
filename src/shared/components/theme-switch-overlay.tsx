/**
 * Full-screen veil shown while the theme swaps.
 *
 * The swap repaints every surface at once; without this the page flashes
 * through a half-applied palette. Rendered from the consent banner because that
 * is where the theme control lives when the banner is open.
 */

import { useTranslations } from "@shared/i18n/translator";

export interface ThemeSwitchOverlayProps {
  theme: string;
  language: string;
}

export default function ThemeSwitchOverlay({ theme, language }: ThemeSwitchOverlayProps) {
  const t = useTranslations(language);
  const themeReducer = theme;

  return (
    <div
              className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${themeReducer === 'light' ? 'bg-white/90' : 'bg-black/90'
                }`}
            >
              <div className={`text-center p-8 rounded-lg border shadow-2xl ${themeReducer === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-800 border-gray-700'
                }`}>
                <div className="flex justify-center mb-6">
                  <div className="preloader-orbit-loading">
                    <div className="cssload-inner cssload-one"></div>
                    <div className="cssload-inner cssload-two"></div>
                    <div className="cssload-inner cssload-three"></div>
                  </div>
                </div>
                <h3 className={`font-medium text-xl mb-2 ${themeReducer === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                  {t.text("navbar.themeChangingTitle")}
                </h3>
                <p className={`text-sm ${themeReducer === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                  {t.text("navbar.themeChangingDescription")}
                </p>
              </div>
            </div>
  );
}
