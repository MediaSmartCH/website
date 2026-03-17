import React, { useId } from "react";

type HeroBlobBgProps = {
  className?: string;
  theme: string;
};

const HeroBlobBg: React.FC<HeroBlobBgProps> = ({ className = "", theme }) => {
  const id = useId().replace(/:/g, "");
  const isLight = theme === "light";
  const gradientId = `hero-blob-${id}`;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 760"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient goes top→bottom: opaque at top, fades at the wave edge */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0.4" y2="1">
            <stop
              offset="0%"
              stopColor={isLight ? "#E8E3FF" : "#2B284C"}
              stopOpacity={isLight ? "0.92" : "0.95"}
            />
            <stop
              offset="55%"
              stopColor={isLight ? "#EDF0FF" : "#211D3E"}
              stopOpacity={isLight ? "0.72" : "0.68"}
            />
            <stop
              offset="100%"
              stopColor={isLight ? "#F8F6FF" : "#14172D"}
              stopOpacity="0.04"
            />
          </linearGradient>
        </defs>
        {/*
          Reversed WaveBackdrop path:
          fills from y=0 (top) DOWN to the organic wave line,
          so the entire top of the hero is covered.
        */}
        <path
          d="M-120 0 L1720 0 L1720 476
             C1580 542 1449 528 1332 437
             C1186 323 1020 285  824 313
             C 620 343  431 282  288 184
             C 154  92    6  96 -120 188 Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
};

export default HeroBlobBg;
