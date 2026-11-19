import React, { useId } from "react";

type WaveBackdropProps = {
  className?: string;
  theme: string;
};

const WaveBackdrop: React.FC<WaveBackdropProps> = ({
  className = "",
  theme,
}) => {
  // useId produces strings like ":r0:" — colons are invalid in SVG id attributes.
  const gradientId = useId().replace(/:/g, "");
  const isLight = theme === "light";
  const fillGradientId = `wave-fill-${gradientId}`;

  return (
    <div
      className={`pointer-events-none absolute left-[-6%] w-[112%] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/*
        Wider than its frame on a narrow screen, so the curve stays a curve.

        `preserveAspectRatio="none"` stretches the 1600x760 viewBox to whatever
        box it is given. On a phone that box is roughly 420x460, which squashes
        the horizontal run 2.3x harder than the vertical drop and turns the
        wave into an oblique line. Holding the svg at a floor of 840px shows a
        narrower window of the same path — one crest and one trough across the
        viewport instead of the whole thing — which is the shape this is meant
        to be.

        `max(840px, 100%)` rather than a percentage: a percentage ladder is
        not monotone. Stepping 200% down to 150% at a breakpoint makes the
        curve STEEPER as the screen gets wider, which is backwards. A pixel
        floor keeps the horizontal scale constant across the whole phone band,
        then hands over to 100% at about 750px — by which point the frame is
        already wider than the floor, so the two meet without a seam. At md
        and above it is `w-full`, byte for byte what desktop has always
        rendered.
      */}
      <svg
        className="absolute inset-0 h-full w-[max(840px,100%)] md:w-full"
        viewBox="0 0 1600 760"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            {/* Dark reads the surface token the header paints with, rather
                than repeating its value, and paints it opaque: an alpha here
                composites over the page background and lands a couple of
                points short of the header, which shows as a seam where the two
                meet. Light is a deliberate tint over a white header, not a
                continuation of it, so it keeps its own colour and alpha. */}
            <stop
              offset="0%"
              stopColor={isLight ? "#F4F1FF" : "var(--palette-night-900)"}
              stopOpacity={isLight ? "0.88" : "1"}
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

        {/* Organic wave path — fills from the wave line downward to the bottom
            of the viewBox, creating a soft background wash beneath content. */}
        <path
          d="M-120 188C6 96 154 92 288 184C431 282 620 343 824 313C1020 285 1186 323 1332 437C1449 528 1580 542 1720 476V760H-120V188Z"
          fill={`url(#${fillGradientId})`}
        />
      </svg>

      {/* Soft elliptical glow at the bottom edge to blend the wave into the
          section below it. */}
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
