import React from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  AppLanguage,
  getLanguageConfig,
  SUPPORTED_LANGUAGES,
} from "config/languages";
import { ResolvedTheme } from "store/slices/common/themeUtils";

type LanguageSelectorProps = {
  currentLanguage: AppLanguage;
  currentTheme: ResolvedTheme;
  onChange: (language: AppLanguage) => void;
  ariaLabel: string;
  size?: "xs" | "sm" | "md";
  menuAlign?: "left" | "right";
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  currentTheme,
  onChange,
  ariaLabel,
  size = "sm",
  menuAlign = "right",
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const activeLanguage = getLanguageConfig(currentLanguage);
  const isLightTheme = currentTheme === "light";

  // Size-variant token sets — keeps inline style logic out of JSX.
  const sizeConfig =
    size === "xs"
      ? {
          triggerPadding: "px-2 py-1.5",
          flag: "h-3.5 w-3.5",
          code: "text-[11px]",
          chevron: 12,
          panel: "min-w-[170px] p-1.5",
          item: "px-2.5 py-2",
          title: "text-[12px]",
          meta: "text-[10px]",
        }
      : size === "sm"
      ? {
          triggerPadding: "px-2.5 py-1.5",
          flag: "h-4 w-4",
          code: "text-[12px]",
          chevron: 13,
          panel: "min-w-[180px] p-1.5",
          item: "px-3 py-2",
          title: "text-[13px]",
          meta: "text-[10px]",
        }
      : {
          triggerPadding: "px-3 py-2",
          flag: "h-[18px] w-[18px]",
          code: "text-[13px]",
          chevron: 14,
          panel: "min-w-[190px] p-2",
          item: "px-3 py-2.5",
          title: "text-[14px]",
          meta: "text-[11px]",
        };

  // Attach global listeners only while the dropdown is open to avoid unnecessary
  // overhead, and clean them up as soon as it closes.
  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const triggerClasses = isLightTheme
    ? "border-black/10 bg-white/80 text-[#14172D] hover:bg-white shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
    : "border-white/10 bg-[#312D53]/72 text-[#F6F6F6] hover:bg-[#3A3560] shadow-[0_10px_24px_rgba(0,0,0,0.22)]";

  const panelClasses = isLightTheme
    ? "border-black/10 bg-white/95 text-[#14172D] shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
    : "border-white/10 bg-[#262243]/95 text-[#F6F6F6] shadow-[0_18px_45px_rgba(0,0,0,0.34)]";

  const activeItemClasses = isLightTheme
    ? "bg-[#EEF0FF] text-[#14172D]"
    : "bg-white/10 text-white";

  const inactiveItemClasses = isLightTheme
    ? "text-[#14172D] hover:bg-[#F7F8FF]"
    : "text-[#F6F6F6] hover:bg-white/10";

  const mutedTextClasses = isLightTheme ? "text-[#6B7280]" : "text-[#CFCDE0]";

  return (
    <div ref={containerRef} className="relative z-20">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={ariaLabel}
        title={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-md transition-colors duration-200 ${sizeConfig.triggerPadding} ${triggerClasses}`}
      >
        <img
          src={activeLanguage.flagSrc}
          alt={activeLanguage.nativeLabel}
          className={`${sizeConfig.flag} rounded-full object-cover`}
        />
        <span
          className={`font-poppins font-semibold uppercase leading-none tracking-[0.04em] ${sizeConfig.code}`}
        >
          {activeLanguage.shortLabel}
        </span>
        <ChevronDown
          strokeWidth={2}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{
            width: `${sizeConfig.chevron}px`,
            height: `${sizeConfig.chevron}px`,
          }}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-[calc(100%+0.55rem)] ${menuAlign === "right" ? "right-0" : "left-0"} rounded-2xl border backdrop-blur-xl ${sizeConfig.panel} ${panelClasses}`}
        >
          <div role="listbox" aria-label={ariaLabel} className="flex flex-col gap-1">
            {SUPPORTED_LANGUAGES.map((language) => {
              const isActive = language.code === activeLanguage.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(language.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl transition-colors duration-150 ${sizeConfig.item} ${
                    isActive ? activeItemClasses : inactiveItemClasses
                  }`}
                >
                  <img
                    src={language.flagSrc}
                    alt={language.nativeLabel}
                    className={`${sizeConfig.flag} rounded-full object-cover`}
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className={`font-poppins font-medium leading-none ${sizeConfig.title}`}>
                      {language.nativeLabel}
                    </p>
                    <p
                      className={`mt-1 font-poppins uppercase tracking-[0.18em] ${sizeConfig.meta} ${mutedTextClasses}`}
                    >
                      {language.shortLabel}
                    </p>
                  </div>
                  {isActive && <Check className="h-4 w-4 shrink-0" strokeWidth={2.4} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
