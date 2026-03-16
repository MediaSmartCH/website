import React, { useId } from "react";

type WaveBackdropProps = {
  className?: string;
  theme: string;
};

const WaveBackdrop: React.FC<WaveBackdropProps> = ({
  className = "",
  theme,
}) => {
  const gradientId = useId().replace(/:/g, "");
  const isLight = theme === "light";
  const fillGradientId = `wave-fill-${gradientId}`;

  return (
    <div
      className={`pointer-events-none absolute left-[-6%] w-[112%] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 760"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isLight ? "#F4F1FF" : "#2B284C"}
              stopOpacity={isLight ? "0.88" : "0.9"}
            />
            <stop
              offset="62%"
              stopColor={isLight ? "#F6F4FF" : "#211D3E"}
              stopOpacity={isLight ? "0.74" : "0.62"}
            />
            <stop
              offset="100%"
              stopColor={isLight ? "#FFFFFF" : "#14172D"}
              stopOpacity={isLight ? "0.08" : "0.02"}
            />
          </linearGradient>
        </defs>

        <path
          d="M-120 188C6 96 154 92 288 184C431 282 620 343 824 313C1020 285 1186 323 1332 437C1449 528 1580 542 1720 476V760H-120V188Z"
          fill={`url(#${fillGradientId})`}
        />
      </svg>

      <div
        className="absolute bottom-[-6%] left-1/2 h-[26%] w-[76%] -translate-x-1/2 rounded-[50%] blur-[72px]"
        style={{
          background: isLight
            ? "rgba(255, 255, 255, 0.72)"
            : "rgba(20, 23, 45, 0.32)",
        }}
      />
    </div>
  );
};

export default WaveBackdrop;
