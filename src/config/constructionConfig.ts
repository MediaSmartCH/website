// Controls the site-wide "under construction" banner/overlay rendered by ConstructionWrapper.
// Set isUnderConstruction to true to activate it across all routes.
export const CONSTRUCTION_CONFIG = {
  isUnderConstruction: false,
  customMessage: "Nous préparons une expérience exceptionnelle...",
  launchDate: "2025-10-01",
  progressPercentage: 93,
  enableEmailCollection: true,
  emergencyContact: "hello@mediasmart.ch"
};

export interface ConstructionConfig {
  isUnderConstruction: boolean;
  customMessage?: string;
  launchDate?: string;
  progressPercentage?: number;
  enableEmailCollection?: boolean;
  emergencyContact?: string;
}
