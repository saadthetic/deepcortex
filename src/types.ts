export const APP_VERSION = '1.4.2';

export type Region = 'abu-dhabi' | 'pakistan';
export type Language = 'en' | 'ur' | 'ar';
export type Tab = 'home' | 'brain-check' | 'risk-context' | 'care-plan' | 'telemetry' | 'mri-lab' | 'schemes' | 'history';
export type PrivacyMode = 'edge' | 'cloud';

export type MriStage = 'Non-Demented' | 'Very Mild Demented' | 'Mild Demented' | 'Moderate Demented';

export interface AnatomicalRegionData {
  status: string;
  metric: string;
  score: number;
  healthy: boolean;
}

export interface MriAnalysisResult {
  patientId: string;
  age?: number;
  gender?: string;
  classification: MriStage;
  scanType?: string;
  confidence: number;
  probabilities: {
    nonDemented: number;
    veryMild: number;
    mild: number;
    moderate: number;
  };
  confidenceInterval: string;
  uncertaintyNote: string;
  anatomicalRegions: {
    hippocampus: AnatomicalRegionData;
    lateralVentricles: AnatomicalRegionData;
    cerebralCortex: AnatomicalRegionData;
    medialTemporalLobe: AnatomicalRegionData;
  };
  gradCamActivationNotes: string;
  clinicalSummary: string;
  plainLanguageExplanation: string;
  differentialConsiderations: string[];
  recommendedNextStep: string;
  inferenceMode?: PrivacyMode;
  inferenceEngine?: 'Real Xception INT8 TFLite Weights (20.54 MB)' | 'Deterministic ZNCC Reference Calibrator';
  latencyMs?: number;
  dataTransmittedKb?: number;
  geminiReasoning?: string;
  scanImageUrl?: string;
  timestamp?: string;
}

export interface PatientHistoryRecord {
  id: string;
  type: 'mri' | 'memory' | 'health' | 'multimodal' | 'composite';
  sessionId?: string;
  title: string;
  timestamp: string;
  dateDisplay: string;
  scanType?: string;
  classification?: MriStage;
  confidence?: number;
  score?: number;
  inferenceMode: PrivacyMode;
  thumbnailUrl?: string;
  summary: string;
  mriDetails?: MriAnalysisResult;
  isPersonal?: boolean;
  details?: any;
}

export interface LongitudinalPoint {
  id: string;
  date: string;
  displayDate: string;
  score: number;
  recallScore: number;
  trailTimeSeconds: number;
  functionalScore: number;
  notes: string;
}

export interface ModifiableRiskAction {
  domain: string;
  target: string;
  current: string;
  impact: string;
  recommendation: string;
}

export interface ReferralFacility {
  tier: string;
  facility: string;
  location: string;
  contact: string;
  waitTime: string;
  malaffiHieCode: string;
  action: string;
}

export interface ClinicalServiceTelemetry {
  id: string;
  name: string;
  spec: string;
  status: 'online' | 'simulated-edge' | 'degraded';
  latencyMs: number;
  uptime: string;
  details: string;
}

export interface DoctorSignOff {
  signed: boolean;
  doctorName?: string;
  hospital?: string;
  licenseNumber?: string;
  signedDate?: string;
  checklistComplete?: boolean;
}

export interface SupportTicket {
  id: string;
  createdAt?: string;
  date: string;
  name: string;
  contact: string;
  category: string;
  details: string;
  status: 'Open' | 'In Review' | 'Resolved';
  resolutionNotes?: string;
  source?: string;
}

export interface UserConsentSettings {
  longitudinalTracking: boolean;
  clinicalHandover: boolean;
  employerZeroAccess: boolean; // Strictly true (Locked ON)
}

export interface UserProfile {
  id: string;
  isGuest: boolean;
  name: string;
  email: string;
  avatar?: string;
  authProvider: 'guest' | 'google' | 'email';
  educationLevel: 'none' | 'primary' | 'secondary' | 'higher';
  preferredLanguage: Language;
  preferredRegion: Region;
  latestMemoryScore: number | null;
  brainProtectionScore: number | null;
  personalScansCount: number;
  savedReportsCount: number;
  submittedTicketsCount: number;
  consentSettings: UserConsentSettings;
  lastSyncedAt?: string;
  isCloudSynced?: boolean;
}
