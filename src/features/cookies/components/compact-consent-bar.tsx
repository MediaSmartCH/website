/**
 * Mobile consent bar.
 *
 * Below 768px the full modal would cover the page entirely, so the choice is
 * offered as a bottom sheet instead. Same three actions as the desktop panel.
 */

import { Cookie, Settings, X } from "lucide-react";
import { Link, useInRouterContext } from "react-router-dom";

import type { ConsentThemeClasses } from "@features/cookies/lib/consent-theme-classes";

import { useTranslations } from "@shared/i18n/translator";

export interface CompactConsentBarProps {
  language: string;
  themeClasses: ConsentThemeClasses;
  /** Drives the slide-out transition before the bar unmounts. */
  isClosing: boolean;
  privacyPath: string;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
  onCustomize: () => void;
}

export default function CompactConsentBar({
  language,
  themeClasses,
  isClosing,
  privacyPath,
  onAcceptAll,
  onRejectAll,
  onClose,
  onCustomize,
}: CompactConsentBarProps) {
  const t = useTranslations(language);
  // The banner can render above RouterProvider (construction mode), where
  // <Link> would throw. Fall back to a plain anchor there.
  const inRouter = useInRouterContext();

  return (
    <div
              className={`fixed inset-x-0 bottom-0 z-50 p-3 transition-all duration-300 ${isClosing ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
                }`}
              style={{ zIndex: 999999 }}
            >
              <div
                className={`mx-auto w-full max-w-md rounded-[26px] border p-4 shadow-[0_30px_80px_-40px_rgba(20,23,45,0.55)] ${themeClasses.modal} ${themeClasses.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <Cookie className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <h3 className={`text-base font-bold ${themeClasses.text}`}>
                        {t.text("cookies.title")}
                      </h3>
                      <p className={`mt-1 text-sm leading-5 ${themeClasses.textSecondary}`}>
                        {t.text("cookies.subtitle")}
                      </p>
                      {inRouter ? (
                        <Link
                          to={privacyPath}
                          className="mt-2 inline-block text-xs underline text-purple-600 hover:text-purple-800"
                        >
                          {t.text("cookies.privacyLinkText")}
                        </Link>
                      ) : (
                        <a
                          href={privacyPath}
                          className="mt-2 inline-block text-xs underline text-purple-600 hover:text-purple-800"
                        >
                          {t.text("cookies.privacyLinkText")}
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${themeClasses.bg} ${themeClasses.hover}`}
                    title={t.text("cookies.ariaCloseModal")}
                    aria-label={t.text("cookies.ariaCloseModal")}
                  >
                    <X className={`h-4 w-4 ${themeClasses.textSecondary}`} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button
                    onClick={onAcceptAll}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700"
                  >
                    {t.text("cookies.acceptAll")}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onRejectAll}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${themeClasses.buttonSecondary}`}
                    >
                      {t.text("cookies.refuse")}
                    </button>
                    <button
                      onClick={() => onCustomize()}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${themeClasses.bgSecondary} ${themeClasses.borderSecondary} ${themeClasses.text}`}
                    >
                      <Settings className="h-4 w-4" />
                      {t.text("cookies.customize")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
  );
}
