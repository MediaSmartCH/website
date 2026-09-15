import React, { lazy, Suspense } from "react";

import { CONSTRUCTION_CONFIG } from "@shared/config/construction";
import { useLocationPath } from "@shared/hooks/use-location-path";

// Construction mode is off in normal operation, so this page must not be part
// of the entry chunk — a static import drags the booking + reCAPTCHA subtree
// into the critical path on every visit.
const UnderConstruction = lazy(() => import("@features/under-construction/under-construction-page"));

interface ConstructionWrapperProps {
  children: React.ReactNode;
}

const ConstructionWrapper: React.FC<ConstructionWrapperProps> = ({ children }) => {
  // Rendered above RouterProvider, so the path has to come from the History API.
  const currentPath = useLocationPath();

  // Privacy-policy pages are always accessible regardless of construction mode
  const isAllowedRoute = () => {
    return currentPath.includes('/privacy-policy');
  };

  if (CONSTRUCTION_CONFIG.isUnderConstruction && !isAllowedRoute()) {
    return (
      <Suspense fallback={null}>
        <UnderConstruction />
      </Suspense>
    );
  }

  return <>{children}</>;
};

export default ConstructionWrapper;
