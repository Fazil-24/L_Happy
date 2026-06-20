export interface LaunchBriefData {
  featureName: string;
  description: string;
  targetUsers: string;
  valueProposition: string;
  launchGoal: string;
  timeline: string;
  competitors: string;
  concerns: string;
}

export interface PersonaSliders {
  trustLevel: number;       // 0-100: Low trust → High trust in the product/company
  urgency: number;          // 0-100: Not urgent → Very urgent need
  priceSensitivity: number; // 0-100: Price-insensitive → Very price-sensitive
  switchingFriction: number; // 0-100: Easy to switch → Hard to switch (from alternatives)
  noveltyAppetite: number;  // 0-100: Risk-averse → Innovation-hungry
  adoptionReadiness: number; // 0-100: Resistant → Ready to adopt
}

export interface MarketConditions {
  marketMaturity: number;   // 0-100: Emerging → Mature market
  competitionIntensity: number; // 0-100: Low → High competition
  economicClimate: number;  // 0-100: Tight budgets → Expansionary
}

export interface ExtractedInsights {
  featureName: string;
  coreBenefit: string;
  targetSegments: string[];
  keyDifferentiators: string[];
  potentialConcerns: string[];
  launchComplexity: "low" | "medium" | "high";
  marketReadiness: string;
  summary: string;
}

export interface PersonaReaction {
  personaName: string;
  personaType: "power_user" | "casual_user" | "skeptic" | "admin" | "new_user";
  mood: "excited" | "interested" | "neutral" | "skeptical" | "confused" | "blocked" | "resistant";
  moodEmoji: string;
  quote: string;
  concerns: string[];
  drivers: string[];
  adoptionLikelihood: number; // 0-100
  scenario: "best" | "likely" | "worst";
}

export interface SimulationResult {
  overallSentiment: number; // 0-100
  sentimentLabel: string;
  personas: PersonaReaction[];
  weatherReport: {
    adoptionSunshine: number;
    backlashStorm: number;
    confusionFog: number;
    trustTurbulence: number;
  };
  topRisks: string[];
  topOpportunities: string[];
}

export interface LaunchStyle {
  name: string;
  description: string;
  fit: "excellent" | "good" | "neutral" | "poor";
  fitScore: number;
  pros: string[];
  cons: string[];
  messagingAngle: string;
}

export interface LaunchPlaybook {
  recommendedStyle: LaunchStyle;
  allStyles: LaunchStyle[];
  phases: {
    phase: string;
    duration: string;
    actions: string[];
    successMetric: string;
  }[];
  messaging: {
    headline: string;
    subheadline: string;
    cta: string;
    keyMessages: string[];
  };
  safeguards: string[];
  successMetrics: string[];
  launchReadinessScore: number;
}

export type WizardStep = "ingest" | "review" | "tune" | "simulate" | "playbook";

export interface LaunchSession {
  step: WizardStep;
  briefData?: LaunchBriefData;
  rawInput?: string;
  uploadedFileName?: string;
  insights?: ExtractedInsights;
  personaSliders?: PersonaSliders;
  marketConditions?: MarketConditions;
  simulationResult?: SimulationResult;
  playbook?: LaunchPlaybook;
  activeScenario: "best" | "likely" | "worst";
  isLoading: boolean;
  error?: string;
}
