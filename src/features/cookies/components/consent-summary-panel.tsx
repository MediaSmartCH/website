/**
 * Default consent panel: what the site stores, and the three ways out
 * (accept everything, refuse everything, or open the detailed choices).
 */

import { BarChart3, Settings, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import type { ConsentThemeClasses } from "@features/cookies/lib/consent-theme-classes";

import { useTranslations } from "@shared/i18n/translator";

export interface ConsentSummaryPanelProps {
  language: string;
  themeClasses: ConsentThemeClasses;
  privacyPath: string;
  /** False when rendered above RouterProvider, where <Link> would throw. */
  inRouter: boolean;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export default function ConsentSummaryPanel({
  language,
  themeClasses,
  privacyPath,
  inRouter,
}: Pick<
  ConsentSummaryPanelProps,
  "language" | "themeClasses" | "privacyPath" | "inRouter"
>) {
  const t = useTranslations(language);

  return (
    <div>
                <div className="mb-6">
                  <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                    {t.text("cookies.description")}
                  </p>
                  {inRouter ? (
                    <Link to={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                      {t.text("cookies.privacyLinkText")}
                    </Link>
                  ) : (
                    <a href={privacyPath} className="block mt-2 text-sm underline text-purple-600 hover:text-purple-800">
                      {t.text("cookies.privacyLinkText")}
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200">
                    <Shield className="w-3 h-3 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 text-xs">{t.text("cookies.necessary")}</p>
                      <p className="text-xs text-green-700">{t.text("cookies.alwaysActive")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 border border-purple-200">
                    <Zap className="w-3 h-3 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900 text-xs">{t.text("cookies.functionality")}</p>
                      <p className="text-xs text-purple-700">{t.text("cookies.yourChoice")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 border border-blue-200">
                    <BarChart3 className="w-3 h-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 text-xs">{t.text("cookies.performance")}</p>
                      <p className="text-xs text-blue-700">{t.text("cookies.yourChoice")}</p>
                    </div>
                  </div>
                </div>
    </div>
  );
}

/** The three ways out, rendered in the shell's pinned footer. */
export function ConsentSummaryActions({
  language,
  themeClasses,
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: Pick<
  ConsentSummaryPanelProps,
  "language" | "themeClasses" | "onAcceptAll" | "onRejectAll" | "onCustomize"
>) {
  const t = useTranslations(language);

  return (
                <div className="flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-3 w-full">
                  <button
                    onClick={onAcceptAll}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 md:px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {t.text("cookies.acceptAll")}
                  </button>
                  <button
                    onClick={onRejectAll}
                    className={`flex-1 px-4 md:px-6 py-3 rounded-xl font-medium transition-colors ${themeClasses.buttonSecondary}`}
                  >
                    {t.text("cookies.refuse")}
                  </button>
                  <button
                    onClick={() => onCustomize()}
                    className={`flex-1 flex items-center justify-center gap-2 ${themeClasses.bgSecondary} border-2 ${themeClasses.borderSecondary} ${themeClasses.text} px-4 md:px-6 py-3 rounded-xl font-medium hover:${themeClasses.border} ${themeClasses.hover} transition-colors`}
                  >
                    <Settings className="w-4 h-4" />
                    {t.text("cookies.customize")}
                  </button>
                </div>
  );
}
