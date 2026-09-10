export type DRClass = 0 | 1 | 2 | 3 | 4;

export type DRClassName =
  | 'No DR'
  | 'Mild DR'
  | 'Moderate DR'
  | 'Severe DR'
  | 'Proliferative DR';

export interface ImageQualityResult {
  isRetinal: boolean;
  isGradable: boolean;
  score: number;
  status: 'Gradable' | 'Ungradable';
  clarity: number;
  illumination: number;
  reasons: string[];
}

export interface EvidenceItem {
  name: string;
  confidence: string;
  tone: 'teal' | 'violet' | 'amber' | 'coral';
  location?: string;
  description?: string;
}

export interface GradCAMResult {
  heatmapDataUrl: string;
  overlayDataUrl: string;
  peakActivationQuadrant: string;
  salientCoordinates: Array<{ x: number; y: number; weight: number }>;
}

export interface ScreeningResult {
  caseId: string;
  imageSrc: string;
  originalImageSrc: string;
  quality: ImageQualityResult;
  drLevel: DRClass;
  drLevelText: string;
  drClassName: DRClassName;
  confidence: number;
  confidenceText: string;
  isReferable: boolean;
  referableStatus: 'Referable' | 'Non-referable';
  referableBadge: 'REFERABLE DR' | 'NON-REFERABLE';
  probabilities: number[];
  gradcam: GradCAMResult;
  evidence: EvidenceItem[];
  processingTimeMs: number;
  timestamp: string;
}

export interface PatientMetadata {
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  diabetesYears?: number;
  eye?: 'OD' | 'OS';
  abhaId?: string;
}

export interface ScreenerMetadata {
  name: string;
  operatorId?: string;
  centerName?: string;
}

export interface SpecialistReview {
  reviewedAt: string;
  finalDRLevel: DRClass;
  clinicalNotes: string;
  reviewerName?: string;
  reviewerRegNo?: string;
  hospitalAffiliation?: string;
  referralRecommendation?: 'Routine 12m' | 'Early 3-6m' | 'Laser / Anti-VEGF Specialist Referral' | 'Emergency Referral';
}

export type CaseStatus = 'PENDING_REVIEW' | 'REVIEWED';

export interface CaseRecord {
  id: string;
  caseStatus: CaseStatus;
  level: string;
  drLevelNum: DRClass;
  drClassName?: DRClassName;
  confidence: string;
  status: 'Referable' | 'Non-referable';
  priority:
    | 'Pending Ophthalmologist Review'
    | 'Reviewed'
    | 'Finalized'
    | 'High priority'
    | 'Normal review'
    | 'Pending'
    | 'Completed';
  imageSrc: string;
  originalImageSrc?: string;
  gradcamHeatmapSrc?: string;
  gradcamOverlaySrc?: string;
  timestamp: string;
  patient?: PatientMetadata;
  screener?: ScreenerMetadata;
  evidence?: EvidenceItem[];
  quality?: ImageQualityResult;
  ophthalmologistReview?: SpecialistReview;
}
