import React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

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
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  themePreference,
  onChange,
  labels,
  size = "sm",
}) => {
  const selectorRef = React.useRef<HTMLDivElement | null>(null);
  const suppressClickRef = React.useRef(false);
  const dragStateRef = React.useRef({
    pointerId: null as number | null,
    startX: 0,
    hasMoved: false,
  });
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

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

  const options = [
    { value: "light" as ThemePreference, label: labels.light, Icon: Sun },
    { value: "dark" as ThemePreference, label: labels.dark, Icon: Moon },
    { value: "system" as ThemePreference, label: labels.system, Icon: Monitor },
  ];

  const selectedIndex = Math.max(
    0,
    options.findIndex(({ value }) => value === themePreference)
  );
  const activeIndex = dragIndex ?? selectedIndex;

  const getIndexFromClientX = (clientX: number) => {
    const rect = selectorRef.current?.getBoundingClientRect();
    if (!rect) return selectedIndex;

    const offsetX = Math.max(
      0,
      Math.min(clientX - rect.left - sizeConfig.padding, rect.width)
    );
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
    <div
      ref={selectorRef}
      role="group"
      aria-label={labels.selector}
      className={`relative inline-flex cursor-grab select-none items-center rounded-full border backdrop-blur-md active:cursor-grabbing ${containerClasses}`}
      style={{
        gap: `${sizeConfig.gap}px`,
        padding: `${sizeConfig.padding}px`,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <span
        aria-hidden="true"
        className={`absolute rounded-full transition-transform duration-200 ease-out ${thumbClasses}`}
        style={{
          width: `${sizeConfig.button}px`,
          height: `${sizeConfig.button}px`,
          left: `${sizeConfig.padding}px`,
          top: `${sizeConfig.padding}px`,
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
  );
};

export default ThemeSelector;
