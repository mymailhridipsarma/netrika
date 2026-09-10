import sharp from 'sharp';
import type { ImageQualityResult } from './types';
import { classifyRetinalAuthenticity } from './retinaClassifier';

/**
 * Assesses the clinical gradability, retinal authenticity, and image quality of a fundus photograph.
 *
 * Stage 1: Retinal Authenticity Validation
 *   - Verifies circular pupil optical aperture geometry
 *   - Verifies ocular choroidal/RPE chromatic absorption (suppressed blue, monochromatic warm red)
 *   - Rejects human portraits/selfies, screenshots, documents, anterior segment macro photos, landscapes
 *
 * Stage 2: Optical Quality & Clinical Usability Assessment
 *   - Minimum clinical resolution (>= 256x256 px)
 *   - Sharpness & Motion Blur on vascular arcades (2D discrete Laplacian edge gradient)
 *   - Exposure & Illumination (flags severe underexposure and flash overexposure/glare)
 *   - Usable field-of-view aperture coverage
 */
export async function assessFundusQuality(imageBuffer: Buffer): Promise<ImageQualityResult> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // 1. Stage 1: Retinal Authenticity Classifier
  const auth = await classifyRetinalAuthenticity(imageBuffer);

  if (!auth.isRetinal) {
    return {
      isRetinal: false,
      isGradable: false,
      score: 30,
      status: 'Ungradable',
      clarity: 15,
      illumination: 20,
      reasons: [auth.reason || 'This does not appear to be a retinal/fundus image.'],
    };
  }

  // 2. Stage 2: Clinical Quality & Usability Assessment for Valid Retinal Images
  const reasons: string[] = [];

  // Minimum Resolution Check
  if (width < 256 || height < 256) {
    reasons.push(`Image resolution is too low (${width}x${height} px). Minimum 256x256 px required for clinical assessment.`);
  }

  // Extract raw RGB pixels at 128x128 normalized resolution for sharpness & illumination metrics
  const { data: rawPixels } = await sharp(imageBuffer)
    .resize(128, 128, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const greenValues = new Float32Array(128 * 128);
  for (let i = 0; i < 128 * 128; i++) {
    greenValues[i] = rawPixels[i * 3 + 1] / 255.0;
  }

  // Discrete 2D Laplacian on the green channel for retinal vessel sharpness
  let laplacianSum = 0;
  let lapCount = 0;
  for (let y = 1; y < 127; y++) {
    for (let x = 1; x < 127; x++) {
      const idx = y * 128 + x;
      const c = greenValues[idx];
      if (c > 0.08 && c < 0.95) {
        const lap = Math.abs(4 * c - greenValues[idx - 1] - greenValues[idx + 1] - greenValues[idx - 128] - greenValues[idx + 128]);
        laplacianSum += lap;
        lapCount++;
      }
    }
  }

  const sharpnessScore = lapCount > 0 ? (laplacianSum / lapCount) * 100 : 0;
  const clarity = Math.min(100, Math.max(10, Math.round(sharpnessScore * 14.5)));
  const illumination = Math.min(100, Math.max(10, Math.round(Math.min(auth.metrics.meanG * 1.3, 100))));

  // Clinical quality thresholds
  if (clarity < 30 || sharpnessScore < 4.0) {
    reasons.push('Image is too blurry or out of focus (vascular details cannot be resolved).');
  }
  if (auth.metrics.totalLuminance < 12 && auth.metrics.fgRatio < 0.15) {
    reasons.push('Insufficient retinal illumination (severely underexposed image).');
  }
  if (auth.metrics.meanCenterLum > 230) {
    reasons.push('Excessive flash overexposure or camera glare obscuring retinal field.');
  }
  if (auth.metrics.fgRatio < 0.20) {
    reasons.push('Insufficient retinal field of view (fundus area obscured or incomplete).');
  }

  const isGradable = reasons.length === 0;
  const overallScore = isGradable
    ? Math.min(99, Math.max(78, Math.round(0.6 * clarity + 0.4 * illumination)))
    : Math.min(45, Math.round(0.5 * clarity + 0.5 * illumination));

  return {
    isRetinal: true,
    isGradable,
    score: overallScore,
    status: isGradable ? 'Gradable' : 'Ungradable',
    clarity,
    illumination,
    reasons: reasons.length > 0 ? reasons : ['Optimal retinal field visibility', 'Clear vascular architecture'],
  };
}

