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

  // Écouter les changements de route
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Écouter les changements d'URL
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

    // Initialiser
    handleRouteChange();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  // Vérifier si on est sur une route autorisée en mode construction
  const isAllowedRoute = () => {
    // Routes autorisées : privacy-policy dans toutes les langues
    return currentPath.includes('/privacy-policy');
  };

  // Si le mode construction est activé et qu'on n'est pas sur une route autorisée
  if (CONSTRUCTION_CONFIG.isUnderConstruction && !isAllowedRoute()) {
    return <UnderConstruction />;
  }

  // Sinon, afficher l'application normale
  return <>{children}</>;
};

export default ConstructionWrapper;