import React from "react";
import { useLocation } from "react-router-dom";

import { useAppSelector } from "@shared/hooks/store-hooks";

const BACKDROP_HEIGHTS: Record<string, string> = {
  "/": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1260px]",
  "/web-development": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  // VIDÉO DÉSACTIVÉ — NE PAS SUPPRIMER : hauteur du backdrop de la page vidéo,
  // conservée telle quelle pour une réactivation immédiate de l'offre.
  "/video-services": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  "/support-contract": "h-[820px] md:h-[940px] lg:h-[1040px] xl:h-[1160px] 2xl:h-[1260px]",
  "/privacy-policy": "h-[760px] md:h-[860px] lg:h-[960px] xl:h-[1080px] 2xl:h-[1180px]",
  // The two other text-only legal pages share the privacy policy's proportions:
  // same heading block, same measure, so the wave breaks at the same point.
  "/legal-notice": "h-[760px] md:h-[860px] lg:h-[960px] xl:h-[1080px] 2xl:h-[1180px]",
  "/terms": "h-[760px] md:h-[860px] lg:h-[960px] xl:h-[1080px] 2xl:h-[1180px]",
  // The regional pages open like the services page — heading, lead, then an
  // animation — so the wave breaks at the same point.
  "/agence-web-suisse-romande":
    "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  "/agence-web-valais": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  // Text-only openings, like the legal pages: the visuals start lower down.
  "/realisations": "h-[760px] md:h-[860px] lg:h-[960px] xl:h-[1080px] 2xl:h-[1180px]",
};

/**
 * Paths whose children share the parent's backdrop.
 *
 * A project page is `/realisations/<projet>`, which no exact key can match and
 * which would otherwise open on a bare white page — the one thing that made
 * these pages look bolted on.
 */
const BACKDROP_PREFIXES: Array<[string, string]> = [
  ["/realisations/", BACKDROP_HEIGHTS["/realisations"]],
];

const normalizePathname = (pathname: string) => {
  const localizedPath = pathname.replace(/^\/(fr|en)(?=\/|$)/, "");

  return localizedPath === "" ? "/" : localizedPath;
};

const PageTopBackdrop: React.FC = () => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const { pathname } = useLocation();
  const normalizedPath = normalizePathname(pathname);
  const heightClass =
    BACKDROP_HEIGHTS[normalizedPath] ??
    BACKDROP_PREFIXES.find(([prefix]) => normalizedPath.startsWith(prefix))?.[1];

  if (!heightClass) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 ${heightClass} ${
        themeReducer === "light" ? "hero-bg" : "hero-bg-dark"
      }`}
    />
  );
};

export default PageTopBackdrop;
