/**
 * Detailed consent panel: one switch per category, one per service, and save.
 *
 * Takes the whole useConsentPreferences() result because it is the consumer of
 * every part of it — splitting that into ten props would say less, not more.
 */

import { BarChart3, Shield, Zap } from "lucide-react";

import CategoryToggle from "@features/cookies/components/category-toggle";
import type { ConsentThemeClasses } from "@features/cookies/lib/consent-theme-classes";
import type { useConsentPreferences } from "@features/cookies/hooks/use-consent-preferences";

import { useTranslations } from "@shared/i18n/translator";

export interface ConsentPreferencesPanelProps {
  language: string;
  theme: string;
  themeClasses: ConsentThemeClasses;
  consent: ReturnType<typeof useConsentPreferences>;
  onSave: () => void;
  onBack: () => void;
}

export default function ConsentPreferencesPanel({
  language,
  theme,
  themeClasses,
  consent,
}: Pick<
  ConsentPreferencesPanelProps,
  "language" | "theme" | "themeClasses" | "consent"
>) {
  const t = useTranslations(language);
  const themeReducer = theme;
  const {
    googleAnalytics,
    themePreference,
    languagePreference,
    setGoogleAnalytics,
    setThemePreference,
    setLanguagePreference,
    functionalityState,
    performanceState,
    toggleFunctionality,
    togglePerformance,
  } = consent;

  return (
                  <div className="space-y-3">
                    <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesNecessary")}</h4>
                        </div>
                        <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-1">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                      <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                        {t.text("cookies.necessaryDesc")}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.contactForm")}</p>
                          </div>
                          <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.contactFormDesc")}</p>
                        </div>
                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <p className={`font-medium text-xs ${themeClasses.text}`}>Google reCAPTCHA</p>
                          </div>
                          <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.antiSpamDesc")}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesFunctionality")}</h4>
                        </div>
                        <CategoryToggle
                          state={functionalityState}
                          onClick={toggleFunctionality}
                        />
                      </div>
                      <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                        {t.text("cookies.functionalityDesc")}
                      </p>

                      <div className="space-y-2">
                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${themePreference ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.themePreference")}</p>
                              </div>
                              <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.themePreferenceDesc")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={themePreference}
                                onChange={(e) => setThemePreference(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                            </label>
                          </div>
                        </div>

                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${languagePreference ? 'bg-purple-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.languagePreference")}</p>
                              </div>
                              <p className={`text-xs ${themeClasses.textSecondary}`}>{t.text("cookies.languagePreferenceDesc")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={languagePreference}
                                onChange={(e) => setLanguagePreference(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 md:p-4 rounded-2xl ${themeClasses.bg} border ${themeClasses.borderSecondary}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <h4 className={`font-semibold ${themeClasses.text} text-sm`}>{t.text("cookies.cookiesPerformance")}</h4>
                        </div>
                        <CategoryToggle
                          state={performanceState}
                          onClick={togglePerformance}
                        />
                      </div>
                      <p className={`text-xs ${themeClasses.textSecondary} mb-3`}>
                        {t.text("cookies.performanceDesc")}
                      </p>

                      <div className="space-y-2">
                        <div className={`p-2 ${themeClasses.bgSecondary} rounded-lg border ${themeClasses.borderSecondary}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${googleAnalytics ? 'bg-blue-500' : themeReducer === "light" ? 'bg-gray-300' : 'bg-gray-500'}`}></div>
                                <p className={`font-medium text-xs ${themeClasses.text}`}>Google Analytics</p>
                              </div>
                              <p className={`font-medium text-xs ${themeClasses.text}`}>{t.text("cookies.pagesVisited")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={googleAnalytics}
                                onChange={(e) => setGoogleAnalytics(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className={`w-8 h-4 ${themeReducer === "light" ? "bg-gray-300" : "bg-gray-600"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
  );
}

/** Save / back, rendered in the shell's pinned footer. */
export function ConsentPreferencesActions({
  language,
  themeClasses,
  onSave,
  onBack,
}: Pick<
  ConsentPreferencesPanelProps,
  "language" | "themeClasses" | "onSave" | "onBack"
>) {
  const t = useTranslations(language);

  return (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={onSave}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                    >
                      {t.text("cookies.confirmChoices")}
                    </button>
                    <button
                      onClick={() => onBack()}
                      className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm ${themeClasses.buttonSecondary}`}
                    >
                      {t.text("cookies.back")}
                    </button>
                  </div>
  );
}
