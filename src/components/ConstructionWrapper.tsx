import React, { useState, useEffect } from "react";
import { CONSTRUCTION_CONFIG } from "config/constructionConfig";
import UnderConstruction from "pages/UnderConstruction";

interface ConstructionWrapperProps {
  children: React.ReactNode;
}

const ConstructionWrapper: React.FC<ConstructionWrapperProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  // Track client-side navigation by patching history methods and listening to
  // popstate/hashchange, since there is no router context available here.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    window.history.pushState = function(...args) {
      originalPushState(...args);
      handleRouteChange();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState(...args);
      handleRouteChange();
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);

    handleRouteChange();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  // Privacy-policy pages are always accessible regardless of construction mode
  const isAllowedRoute = () => {
    return currentPath.includes('/privacy-policy');
  };

  if (CONSTRUCTION_CONFIG.isUnderConstruction && !isAllowedRoute()) {
    return <UnderConstruction />;
  }

  return <>{children}</>;
};

export default ConstructionWrapper;
