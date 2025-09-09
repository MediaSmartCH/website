// DotAnim.tsx
import React, { memo, useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "@dotlottie/player-component"; // ✅ enregistre <dotlottie-player>
import { useAppSelector } from "services/hooks/hooks";
import { LOTTIES, LottieKey, LottiePair } from "config/lotties";

type Base = {
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
  protect?: boolean;
  /** Rend l’anim en SVG (plus net) via <dotlottie-player> */
  crisp?: boolean;
};

type ByKeyProps = Base & { anim: LottieKey; light?: never; dark?: never };
type BySrcProps = Base & { light: string; dark?: string; anim?: never };
export type DotAnimProps = ByKeyProps | BySrcProps;

function hasAnim(p: DotAnimProps): p is ByKeyProps {
  return (p as ByKeyProps).anim !== undefined;
}
function selectSrc(theme: string, pair: LottiePair) {
  return theme === "dark" && pair.dark ? pair.dark : pair.light;
}

function DotAnim(props: DotAnimProps) {
  const theme = useAppSelector((s) => s.theme.currentTheme);
  const {
    className,
    style,
    autoplay = true,
    loop = true,
    protect = false,
    crisp = true, // ⬅️ par défaut on vise la netteté
  } = props;

  const pair: LottiePair = useMemo(
    () => (hasAnim(props) ? LOTTIES[props.anim] : { light: props.light, dark: props.dark }),
    [props]
  );
  const src = selectSrc(theme, pair);

  const prevent = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative ${className || ""}`}
      style={{
        ...style,
        userSelect: protect ? "none" : undefined,
        WebkitUserSelect: protect ? "none" : undefined,
        WebkitTouchCallout: protect ? "none" : undefined,
      }}
      onContextMenu={protect ? prevent : undefined}
      onDragStart={protect ? prevent : undefined}
      draggable={protect ? false : undefined}
    >
      {crisp ? (
        // ✅ Rendu SVG, très net, responsive
        <dotlottie-player
          key={src}
          src={src}
          autoplay={autoplay}
          loop={loop}
          renderer="svg"
          preserveAspectRatio="xMidYMid meet"
          // pas de height forcée → pas d’upscale baveux
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ) : (
        // 🟨 fallback DotLottieReact si tu veux rester sur ce player
        <DotLottieReact
          key={src}
          src={src}
          autoplay={autoplay}
          loop={loop}
          // ne pas forcer height à 100% : laisse respirer
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      )}

      {protect && (
        <div
          aria-hidden
          className="absolute inset-0"
          onContextMenu={prevent}
          onDragStart={prevent}
          onMouseDown={prevent}
          onTouchStart={prevent}
          onTouchMove={prevent}
          onTouchEnd={prevent}
          style={{ background: "transparent", pointerEvents: "auto" }}
        />
      )}
    </div>
  );
}

export default memo(DotAnim);
