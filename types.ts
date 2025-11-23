export enum Sentiment {
  TRES_NEGATIF = "Tres Négatif",
  NEGATIF = "Négatif",
  NEUTRE = "Neutre",
  POSITIF = "Positif",
}

export enum Urgency {
  CRITIQUE = 5,
  URGENT = 4,
  MOYEN = 3,
  FAIBLE = 2,
  INFORMATIF = 1,
}

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  avatarUrl?: string;
  // Simulated enriched data
  clientSince?: string;
  location?: string;
  isVip?: boolean;
  isPro?: boolean;
  historyIncidentCount?: number;
}

export interface LLMAnalysis {
  sentiment: Sentiment;
  urgency: Urgency;
  category: string;
  subCategory?: string;
  summary: string;
  suggestedResponse: string;
  emojis: string[];
  intent: string;
}

export interface EnrichedTweet extends Tweet {
  analysis?: LLMAnalysis;
  status: 'pending' | 'processed' | 'escalated';
}

export type UserRole = 'agent' | 'supervisor' | 'analyst' | null;
