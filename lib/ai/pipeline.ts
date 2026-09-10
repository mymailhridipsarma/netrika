import type { ScreeningResult, DRClass, DRClassName } from './types';
import { assessFundusQuality } from './quality';
import { preprocessFundusImage } from './preprocess';
import { classifyDiabeticRetinopathy } from './model';
import { generateGradCAM } from './gradcam';
import { evaluateClinicalDecision } from './decision';

/**
 * Executes the complete NETRIKA End-to-End Explainable AI Screening Pipeline:
 *
 * Retinal/Fundus Image
 *   → Image Quality Check (Gradable vs Ungradable)
 *   → Image Preprocessing (Ben Graham fundus normalization)
 *   → AI Classification (DR Severity Levels 0–4)
 *   → Confidence Score
 *   → Grad-CAM Explanation (True Heatmap + Overlay generation)
 *   → Referable DR Decision (Levels 2, 3, 4 = Referable)
 *   → Ophthalmologist Review preparation
 */
export async function runScreeningPipeline(
  imageBuffer: Buffer,
  options?: { caseId?: string }
): Promise<ScreeningResult> {
  const startTime = Date.now();
  const caseId = options?.caseId || `NT-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Image Quality Assessment (Retinal verification, resolution, exposure, blur)
  const quality = await assessFundusQuality(imageBuffer);

  // 2. Preprocessing (Ben Graham normalization & channel extraction for visualization)
  const preprocessed = await preprocessFundusImage(imageBuffer);

  // If the image is ungradable / not a valid retinal image, abort AI classification and Grad-CAM
  if (!quality.isGradable) {
    const processingTimeMs = Date.now() - startTime;
    return {
      caseId,
      imageSrc: preprocessed.normalizedDataUrl,
      originalImageSrc: preprocessed.normalizedDataUrl,
      quality,
      drLevel: 0,
      drLevelText: 'UNGRADABLE',
      drClassName: 'No DR',
      confidence: 0,
      confidenceText: 'N/A',
      isReferable: false,
      referableStatus: 'Non-referable',
      referableBadge: 'NON-REFERABLE',
      probabilities: [0, 0, 0, 0, 0],
      gradcam: {
        heatmapDataUrl: '',
        overlayDataUrl: '',
        peakActivationQuadrant: 'N/A',
        salientCoordinates: [],
      },
      evidence: [],
      processingTimeMs,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. AI Classification (DR 0-4) — Only executed for validated gradable fundus images
  const prediction = classifyDiabeticRetinopathy(preprocessed);

  // 4. Grad-CAM XAI Heatmap & Overlay generation
  const gradcam = await generateGradCAM(preprocessed, prediction);

  // 5. Clinical Decision & Evidence extraction
  const decision = evaluateClinicalDecision(prediction);

  const processingTimeMs = Date.now() - startTime;

  return {
    caseId,
    imageSrc: preprocessed.normalizedDataUrl,
    originalImageSrc: preprocessed.normalizedDataUrl,
    quality,
    drLevel: prediction.predictedClass,
    drLevelText: `LEVEL ${prediction.predictedClass}`,
    drClassName: prediction.className,
    confidence: prediction.confidence,
    confidenceText: `${prediction.confidence.toFixed(1)}%`,
    isReferable: decision.isReferable,
    referableStatus: decision.referableStatus,
    referableBadge: decision.referableBadge,
    probabilities: prediction.probabilities,
    gradcam,
    evidence: decision.evidence,
    processingTimeMs,
    timestamp: new Date().toISOString(),
  };
}
