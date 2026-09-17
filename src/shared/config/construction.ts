// Controls the site-wide "under construction" banner/overlay rendered by ConstructionWrapper.
// Set isUnderConstruction to true to activate it across all routes.
import { getContactEmail } from "@shared/constants/contact";

export const CONSTRUCTION_CONFIG = {
  isUnderConstruction: false,
  customMessage: "La nouvelle version du site arrive prochainement.",
  launchDate: "2025-10-01",
  progressPercentage: 93,
  enableEmailCollection: true,
  // Assembled rather than written out, for the reason in @shared/constants/contact.
  emergencyContact: getContactEmail(),
};

export interface ConstructionConfig {
  isUnderConstruction: boolean;
  customMessage?: string;
  launchDate?: string;
  progressPercentage?: number;
  enableEmailCollection?: boolean;
  emergencyContact?: string;
}
