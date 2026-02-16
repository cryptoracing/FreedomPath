
export enum QuitPhase {
  BASELINE = 'BASELINE',
  TRIGGER_ID = 'TRIGGER_ID',
  REDUCTION = 'REDUCTION',
  STABILIZE_4 = 'STABILIZE_4',
  FREEDOM = 'FREEDOM'
}

export type Language = 'en' | 'ru' | 'es';

export interface CigaretteLog {
  id: string;
  timestamp: number;
  trigger?: string;
  context?: string;
  isDouble?: boolean;
}

export interface UserSettings {
  language: Language;
  currency: string;
  costPerPack: number;
  packSize: number;
  baselinePerDay: number;
  customTriggers: string[];
}

export interface TriggerAnalysis {
  topTriggers: { name: string; count: number }[];
  doublesCount: number;
  advice: string;
  suggestedAction: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
