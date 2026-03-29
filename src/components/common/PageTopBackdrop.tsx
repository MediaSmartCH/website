import React from "react";
import { useLocation } from "react-router-dom";

import { useAppSelector } from "services/hooks/hooks";

const BACKDROP_HEIGHTS: Record<string, string> = {
  "/": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1260px]",
  "/it-services": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  "/video-services": "h-[900px] md:h-[1040px] lg:h-[1160px] xl:h-[1240px]",
  "/support-contract": "h-[820px] md:h-[940px] lg:h-[1040px] xl:h-[1160px] 2xl:h-[1260px]",
  "/privacy-policy": "h-[760px] md:h-[860px] lg:h-[960px] xl:h-[1080px] 2xl:h-[1180px]",
};

const normalizePathname = (pathname: string) => {
  const localizedPath = pathname.replace(/^\/(fr|en)(?=\/|$)/, "");

  return localizedPath === "" ? "/" : localizedPath;
};

const PageTopBackdrop: React.FC = () => {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);
  const { pathname } = useLocation();
  const normalizedPath = normalizePathname(pathname);
  const heightClass = BACKDROP_HEIGHTS[normalizedPath];

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
