import React from "react";
import { CONSTRUCTION_CONFIG } from "config/constructionConfig";
import UnderConstruction from "pages/UnderConstruction";

interface ConstructionWrapperProps {
  children: React.ReactNode;
}

const ConstructionWrapper: React.FC<ConstructionWrapperProps> = ({ children }) => {
  if (CONSTRUCTION_CONFIG.isUnderConstruction) {
    return <UnderConstruction />;
  }
  return <>{children}</>;
};

export default ConstructionWrapper;