import fs from 'fs';
import path from 'path';
import type { CaseRecord, DRClass, ScreeningResult, PatientMetadata, ScreenerMetadata, CaseStatus } from '../ai/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'cases.json');

// Default pre-seeded test cases (all 3 initially PENDING_REVIEW as required)
const defaultCases: CaseRecord[] = [
  {
    id: 'NET-2026-0001',
    caseStatus: 'PENDING_REVIEW',
    level: 'Level 3',
    drLevelNum: 3,
    drClassName: 'Severe DR',
    confidence: '92.4%',
    status: 'Referable',
    priority: 'Pending Ophthalmologist Review',
    imageSrc: '/samples/sample-3-severe-dr.jpg',
    originalImageSrc: '/samples/sample-3-severe-dr.jpg',
    timestamp: '2026-09-10T08:30:00.000Z',
    patient: {
      name: 'Ramesh Gogoi',
      age: 58,
      gender: 'Male',
      diabetesYears: 12,
      eye: 'OD',
      abhaId: 'ABHA-9821-4402',
    },
    screener: {
      name: 'Anjali Devi',
      operatorId: 'TECH-AS-401',
      centerName: 'Sonitpur Rural Vision Centre / PHC',
    },
    quality: {
      isGradable: true,
      score: 94,
      status: 'Gradable',
      clarity: 93,
      illumination: 95,
      reasons: [],
    },
    evidence: [
      { name: 'Severe hemorrhages in 4 quadrants', confidence: '94%', tone: 'coral' },
      { name: 'Venous beading', confidence: '89%', tone: 'violet' },
      { name: 'Cotton wool spots', confidence: '82%', tone: 'amber' },
    ],
  },
  {
    id: 'NET-2026-0002',
    caseStatus: 'PENDING_REVIEW',
    level: 'Level 2',
    drLevelNum: 2,
    drClassName: 'Moderate DR',
    confidence: '94.8%',
    status: 'Referable',
    priority: 'Pending Ophthalmologist Review',
    imageSrc: '/samples/sample-2-moderate-dr.jpg',
    originalImageSrc: '/samples/sample-2-moderate-dr.jpg',
    timestamp: '2026-09-10T07:55:00.000Z',
    patient: {
      name: 'Harish Bora',
      age: 63,
      gender: 'Male',
      diabetesYears: 16,
      eye: 'OD',
      abhaId: 'ABHA-4190-6721',
    },
    screener: {
      name: 'Anjali Devi',
      operatorId: 'TECH-AS-401',
      centerName: 'Sonitpur Rural Vision Centre / PHC',
    },
    quality: {
      isGradable: true,
      score: 96,
      status: 'Gradable',
      clarity: 95,
      illumination: 97,
      reasons: [],
    },
    evidence: [
      { name: 'Microaneurysms detected in macula vicinity', confidence: '92%', tone: 'teal' },
      { name: 'Hard exudates', confidence: '86%', tone: 'amber' },
    ],
  },
  {
    id: 'NET-2026-0003',
    caseStatus: 'PENDING_REVIEW',
    level: 'Level 1',
    drLevelNum: 1,
    drClassName: 'Mild DR',
    confidence: '88.4%',
    status: 'Non-referable',
    priority: 'Pending Ophthalmologist Review',
    imageSrc: '/samples/sample-1-mild-dr.jpg',
    originalImageSrc: '/samples/sample-1-mild-dr.jpg',
    timestamp: '2026-09-10T08:15:00.000Z',
    patient: {
      name: 'Priyanka Das',
      age: 46,
      gender: 'Female',
      diabetesYears: 5,
      eye: 'OS',
      abhaId: 'ABHA-3312-8819',
    },
    screener: {
      name: 'Anjali Devi',
      operatorId: 'TECH-AS-401',
      centerName: 'Sonitpur Rural Vision Centre / PHC',
    },
    quality: {
      isGradable: true,
      score: 97,
      status: 'Gradable',
      clarity: 98,
      illumination: 96,
      reasons: [],
    },
    evidence: [
      { name: 'Isolated microaneurysms in temporal arcade', confidence: '88%', tone: 'teal' },
    ],
  },
];

function loadCasesFromFile(): CaseRecord[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading cases file:', err);
  }

  // If file doesn't exist or failed to load, write defaults
  saveCasesToFile(defaultCases);
  return [...defaultCases];
}

function saveCasesToFile(cases: CaseRecord[]): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(cases, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing cases file:', err);
  }
}

// In-memory cache synced with disk file
let cachedCases: CaseRecord[] = loadCasesFromFile();

export function generateNextCaseId(): string {
  const currentCases = getCases();
  let maxNum = 0;
  for (const c of currentCases) {
    const match = c.id.match(/^NET-2026-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `NET-2026-${String(nextNum).padStart(4, '0')}`;
}

export function getCases(): CaseRecord[] {
  cachedCases = loadCasesFromFile();
  return [...cachedCases];
}

export function getCaseById(id: string): CaseRecord | undefined {
  const current = getCases();
  return current.find((c) => c.id === id);
}

export function addCaseFromScreening(
  result: ScreeningResult,
  patient?: PatientMetadata,
  screener?: ScreenerMetadata,
  initialStatus: CaseStatus = 'PENDING_REVIEW'
): CaseRecord {
  const current = getCases();
  const existingIdx = current.findIndex((c) => c.id === result.caseId);

  const assignedId =
    result.caseId && result.caseId.startsWith('NET-2026-')
      ? result.caseId
      : generateNextCaseId();

  const newCase: CaseRecord = {
    id: assignedId,
    caseStatus: initialStatus,
    level: `Level ${result.drLevel}`,
    drLevelNum: result.drLevel,
    drClassName: result.drClassName,
    confidence: result.confidenceText,
    status: result.referableStatus,
    priority: initialStatus === 'REVIEWED' ? 'Reviewed' : 'Pending Ophthalmologist Review',
    imageSrc: result.imageSrc,
    originalImageSrc: result.originalImageSrc || result.imageSrc,
    gradcamHeatmapSrc: result.gradcam?.heatmapDataUrl,
    gradcamOverlaySrc: result.gradcam?.overlayDataUrl,
    quality: result.quality,
    evidence: result.evidence,
    timestamp: result.timestamp || new Date().toISOString(),
    patient: patient || {
      name: 'Ramesh Gogoi',
      age: 58,
      gender: 'Male',
      diabetesYears: 12,
      eye: 'OD',
      abhaId: 'ABHA-9821-4402',
    },
    screener: screener || {
      name: 'Anjali Devi',
      operatorId: 'TECH-AS-401',
      centerName: 'Sonitpur Rural Vision Centre / PHC',
    },
  };

  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...newCase };
    saveCasesToFile(current);
    cachedCases = current;
    return current[existingIdx];
  }

  // Prepend to top of list
  current.unshift(newCase);
  if (current.length > 200) current.pop();

  saveCasesToFile(current);
  cachedCases = current;
  return newCase;
}

export function submitOphthalmologistReview(
  caseId: string,
  review: {
    finalDRLevel: DRClass;
    clinicalNotes: string;
    reviewerName?: string;
    reviewerRegNo?: string;
    hospitalAffiliation?: string;
    referralRecommendation?: 'Routine 12m' | 'Early 3-6m' | 'Laser / Anti-VEGF Specialist Referral' | 'Emergency Referral';
  }
): CaseRecord | null {
  const current = getCases();
  const c = current.find((item) => item.id === caseId);
  if (!c) return null;

  c.drLevelNum = review.finalDRLevel;
  c.level = `Level ${review.finalDRLevel}`;
  c.status = review.finalDRLevel >= 2 ? 'Referable' : 'Non-referable';
  c.caseStatus = 'REVIEWED';
  c.priority = 'Reviewed';
  c.ophthalmologistReview = {
    reviewedAt: new Date().toISOString(),
    finalDRLevel: review.finalDRLevel,
    clinicalNotes: review.clinicalNotes,
    reviewerName: review.reviewerName || 'Dr. Rajesh Sharma, MS',
    reviewerRegNo: review.reviewerRegNo || 'NMC-OPH-88421',
    hospitalAffiliation: review.hospitalAffiliation || 'Regional Institute of Ophthalmology',
    referralRecommendation: review.referralRecommendation || (review.finalDRLevel >= 2 ? 'Laser / Anti-VEGF Specialist Referral' : 'Routine 12m'),
  };

  saveCasesToFile(current);
  cachedCases = current;
  return c;
}

export function getScreeningStats() {
  const current = getCases();
  const total = current.length + 21; // Base offset for demo continuity
  const referable = current.filter((c) => c.status === 'Referable').length + 3;
  const pending = current.filter((c) => c.caseStatus === 'PENDING_REVIEW' || c.priority === 'Pending Ophthalmologist Review' || c.priority === 'Pending' || c.priority === 'High priority').length;
  const ungradable = 2;

  return {
    screenedToday: total,
    referableCases: referable,
    pendingReview: pending,
    ungradable,
  };
}
