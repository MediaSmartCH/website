import React from "react";
import { CONSTRUCTION_CONFIG } from "config/constructionConfig";
import UnderConstruction from "pages/UnderConstruction";

interface ConstructionWrapperProps {
  children: React.ReactNode;
}

const ConstructionWrapper: React.FC<ConstructionWrapperProps> = ({ children }) => {
  // Vérifier si le mode construction est activé
  if (CONSTRUCTION_CONFIG.isUnderConstruction) {
    return <UnderConstruction />;
  }

  // Sinon, afficher le site normal
  return <>{children}</>;
};

export default ConstructionWrapper;