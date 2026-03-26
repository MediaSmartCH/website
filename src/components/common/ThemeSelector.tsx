import React from "react";
import { Monitor, Moon, Sun, Zap, ZapOff } from "lucide-react";

import {
  ResolvedTheme,
  ThemePreference,
} from "store/slices/common/themeUtils";

type ThemeSelectorProps = {
  currentTheme: ResolvedTheme;
  themePreference: ThemePreference;
  onChange: (theme: ThemePreference) => void;
  labels: {
    selector: string;
    light: string;
    dark: string;
    system: string;
  };
  size?: "xs" | "sm" | "md";
  // Optional animation toggle — rendered as a 4th icon inside the pill.
  animationsEnabled?: boolean;
  onAnimationsToggle?: () => void;
  animToggleLabel?: string;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  themePreference,
  onChange,
  labels,
  size = "sm",
  animationsEnabled,
  onAnimationsToggle,
  animToggleLabel,
}) => {
  const dragAreaRef = React.useRef<HTMLDivElement | null>(null);
  // Prevents the click event that fires on pointer-up from being processed when
  // the interaction was actually a drag gesture.
  const suppressClickRef = React.useRef(false);
  const dragStateRef = React.useRef({
    pointerId: null as number | null,
    startX: 0,
    hasMoved: false,
  });
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  // Size-variant token sets — keeps inline style logic out of JSX.
  const sizeConfig =
    size === "xs"
      ? {
          padding: 2,
          gap: 2,
          button: 22,
          icon: 11,
        }
      : size === "sm"
      ? {
          padding: 2,
          gap: 3,
          button: 26,
          icon: 13,
        }
      : {
          padding: 3,
          gap: 3,
          button: 28,
          icon: 14,
        };

  const containerClasses =
    currentTheme === "light"
      ? "border-black/10 bg-white/80 shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
      : "border-white/10 bg-[#312D53]/72 shadow-[0_10px_24px_rgba(0,0,0,0.22)]";

  const thumbClasses =
    currentTheme === "light"
      ? "bg-[#1F2430] shadow-[0_8px_16px_rgba(15,23,42,0.18)]"
      : "bg-white shadow-[0_8px_18px_rgba(0,0,0,0.24)]";

  const inactiveButtonClasses =
    currentTheme === "light"
      ? "text-[#6B7280] hover:text-[#14172D]"
      : "text-[#D7DAE8] hover:text-white";

  const activeButtonClasses =
    currentTheme === "light" ? "text-white" : "text-[#22263A]";

  const animButtonClasses =
    currentTheme === "light"
      ? "text-[#6B7280] hover:text-[#14172D]"
      : "text-[#D7DAE8] hover:text-white";

  const separatorClass =
    currentTheme === "light" ? "bg-black/15" : "bg-white/20";

  const options = [
    { value: "light" as ThemePreference, label: labels.light, Icon: Sun },
    { value: "dark" as ThemePreference, label: labels.dark, Icon: Moon },
    { value: "system" as ThemePreference, label: labels.system, Icon: Monitor },
  ];

  const selectedIndex = Math.max(
    0,
    options.findIndex(({ value }) => value === themePreference)
  );
  // During a drag, show a live preview index; fall back to the committed selection.
  const activeIndex = dragIndex ?? selectedIndex;

  // Convert a clientX position into an option index by dividing the horizontal
  // offset within the drag area by the per-button stride (button width + gap).
  const getIndexFromClientX = (clientX: number) => {
    const rect = dragAreaRef.current?.getBoundingClientRect();
    if (!rect) return selectedIndex;

    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const step = sizeConfig.button + sizeConfig.gap;
    const nextIndex = Math.floor((offsetX + sizeConfig.gap / 2) / step);

    return Math.max(0, Math.min(options.length - 1, nextIndex));
  };

  const resetDragState = () => {
    dragStateRef.current.pointerId = null;
    dragStateRef.current.startX = 0;
    dragStateRef.current.hasMoved = false;
    setDragIndex(null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.pointerId = event.pointerId;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.hasMoved = false;
    setDragIndex(selectedIndex);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    if (Math.abs(event.clientX - dragStateRef.current.startX) > 4) {
      if (!dragStateRef.current.hasMoved) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      dragStateRef.current.hasMoved = true;
    }

    if (!dragStateRef.current.hasMoved) return;
    setDragIndex(getIndexFromClientX(event.clientX));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragStateRef.current.hasMoved && dragIndex !== null) {
      suppressClickRef.current = true;
      onChange(options[dragIndex].value);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    resetDragState();
  };

  const handleButtonClick = (value: ThemePreference) => {
    if (suppressClickRef.current) return;
    onChange(value);
  };

  return (
    // Outer pill — provides the shared visual container for theme + anim buttons.
    <div
      role="group"
      aria-label={labels.selector}
      className={`relative inline-flex select-none items-center rounded-full border backdrop-blur-md ${containerClasses}`}
      style={{
        padding: `${sizeConfig.padding}px`,
        gap: `${sizeConfig.gap}px`,
      }}
    >
      {/* Draggable area scoped to the 3 theme options only */}
      <div
        ref={dragAreaRef}
        className="relative inline-flex cursor-grab items-center active:cursor-grabbing"
        style={{ gap: `${sizeConfig.gap}px`, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {/* Sliding thumb */}
        <span
          aria-hidden="true"
          className={`absolute rounded-full transition-transform duration-200 ease-out ${thumbClasses}`}
          style={{
            width: `${sizeConfig.button}px`,
            height: `${sizeConfig.button}px`,
            left: 0,
            top: 0,
            transform: `translateX(${activeIndex * (sizeConfig.button + sizeConfig.gap)}px)`,
          }}
        />
        {options.map(({ value, label, Icon }, index) => {
          const isCommitted = themePreference === value;
          const isActive = activeIndex === index;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleButtonClick(value)}
              aria-label={label}
              aria-pressed={isCommitted}
              title={label}
              className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-150 ${
                isActive ? activeButtonClasses : inactiveButtonClasses
              }`}
              style={{
                width: `${sizeConfig.button}px`,
                height: `${sizeConfig.button}px`,
              }}
            >
              <Icon
                strokeWidth={1.9}
                style={{
                  width: `${sizeConfig.icon}px`,
                  height: `${sizeConfig.icon}px`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Animation toggle — inside the pill but outside the drag area */}
      {onAnimationsToggle !== undefined && (
        <>
          <span
            aria-hidden="true"
            className={`shrink-0 rounded-full ${separatorClass}`}
            style={{ width: 1, height: sizeConfig.button * 0.55 }}
          />
          <button
            type="button"
            onClick={onAnimationsToggle}
            aria-label={animToggleLabel}
            // aria-pressed reflects the *current* state so screen readers can
            // announce "Animations on, button" or "Animations off, button"
            // regardless of the label wording.
            aria-pressed={animationsEnabled}
            title={animToggleLabel}
            className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-150 ${animButtonClasses}`}
            style={{
              width: `${sizeConfig.button}px`,
              height: `${sizeConfig.button}px`,
            }}
          >
            {animationsEnabled
              ? <Zap strokeWidth={1.9} style={{ width: sizeConfig.icon, height: sizeConfig.icon }} />
              : <ZapOff strokeWidth={1.9} style={{ width: sizeConfig.icon, height: sizeConfig.icon }} />
            }
          </button>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
