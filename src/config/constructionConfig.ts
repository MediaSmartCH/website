// Configuration pour la page en construction
export const CONSTRUCTION_CONFIG = {
  // Mettre à true pour activer la page en construction
  isUnderConstruction: true,
  
  // Message personnalisé (optionnel)
  customMessage: "Nous préparons une expérience exceptionnelle...",
  
  // Date de lancement prévue (optionnel)
  launchDate: "2025-10-01",
  
  // Pourcentage de progression (0-100)
  progressPercentage: 85,
  
  // Activer/désactiver la collecte d'emails
  enableEmailCollection: true,
  
  // Email de contact d'urgence
  emergencyContact: "contact@mediasmart.fr"
};

// Types pour TypeScript
export interface ConstructionConfig {
  isUnderConstruction: boolean;
  customMessage?: string;
  launchDate?: string;
  progressPercentage?: number;
  enableEmailCollection?: boolean;
  emergencyContact?: string;
}