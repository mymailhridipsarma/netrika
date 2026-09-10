import sharp from 'sharp';

export interface RetinalClassificationResult {
  isRetinal: boolean;
  confidence: number;
  reason?: string;
  metrics: {
    cornerToCenterRatio: number;
    meanCornerLum: number;
    meanCenterLum: number;
    blueToRedRatio: number;
    coolOrMultiColorRatio: number;
    neutralRatio: number;
    retinalWarmRatio: number;
    fgRatio: number;
    meanR: number;
    meanG: number;
    meanB: number;
    totalLuminance: number;
  };
}

/**
 * Stage 1: Retinal Image Validation Classifier
 *
 * Distinguishes authentic retinal fundus photographs from arbitrary non-retinal images,
 * including human photographs / selfies / portraits, computer/mobile screenshots,
 * scanned text documents, landscapes, animals, and macro anterior eye photographs.
 *
 * Key criteria evaluated:
 * 1. Optical Aperture Geometry: Fundus cameras illuminate through a circular pupil aperture,
 *    creating a central concave illumination field with dark or subdued peripheral corners.
 * 2. Ocular Chromatic Gamut: The ocular fundus (choroid and retinal pigment epithelium)
 *    absorbs short-wavelength blue light, producing a warm orange-red spectrum with suppressed blue.
 * 3. Color Diversity & Histogram: Non-retinal photos (people, rooms, clothing, outdoor scenes)
 *    exhibit multi-modal color clusters and neutral gray text/sclera/backgrounds.
 */
export async function classifyRetinalAuthenticity(imageBuffer: Buffer): Promise<RetinalClassificationResult> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Minimum resolution bound for clinical assessment
  if (width < 256 || height < 256) {
    return {
      isRetinal: false,
      confidence: 0.95,
      reason: `Image resolution is too low (${width}x${height} px). Minimum 256x256 px required.`,
      metrics: {
        cornerToCenterRatio: 1,
        meanCornerLum: 0,
        meanCenterLum: 0,
        blueToRedRatio: 1,
        coolOrMultiColorRatio: 0,
        neutralRatio: 0,
        retinalWarmRatio: 0,
        fgRatio: 0,
        meanR: 0,
        meanG: 0,
        meanB: 0,
        totalLuminance: 0,
      },
    };
  }

  // Extract raw RGB pixels at 128x128 normalized resolution
  const { data: rawPixels, info } = await sharp(imageBuffer)
    .resize(128, 128, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  let totalLuminance = 0;
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let fgPixels = 0;

  let highSatWarmCount = 0;
  let neutralCount = 0;
  let coolOrMultiColorCount = 0;

  let cornerLumSum = 0;
  let cornerCount = 0;
  let centerLumSum = 0;
  let centerCount = 0;

  const cx = Math.floor(info.width / 2);
  const cy = Math.floor(info.height / 2);
  const maxR = cx;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = y * info.width + x;
      const r = rawPixels[idx * 3];
      const g = rawPixels[idx * 3 + 1];
      const b = rawPixels[idx * 3 + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      totalR += r;
      totalG += g;
      totalB += b;
      totalLuminance += lum;

      const dist = Math.hypot(x - cx, y - cy);

      // Outer corner quadrants vs central fundus disc
      if (dist > maxR * 0.78) {
        cornerLumSum += lum;
        cornerCount++;
      } else if (dist < maxR * 0.40) {
        centerLumSum += lum;
        centerCount++;
      }

      // Fast RGB to HSV conversion for chromatic gamut analysis
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      let hue = 0;
      const sat = max === 0 ? 0 : delta / max;

      if (delta !== 0) {
        if (max === r) hue = ((g - b) / delta) % 6;
        else if (max === g) hue = (b - r) / delta + 2;
        else hue = (r - g) / delta + 4;
        hue = Math.round(hue * 60);
        if (hue < 0) hue += 360;
      }

      // Foreground pixels (excluding deep black borders)
      if (lum > 18) {
        fgPixels++;

        // 1. Warm Retinal Pigment Spectrum (Monochromatic deep red/amber/orange)
        const isWarmHue = hue <= 42 || hue >= 345;
        const isHighSat = sat >= 0.35;
        const isSuppressedBlue = b <= r * 0.75 + 15;
        if (isWarmHue && isHighSat && isSuppressedBlue) {
          highSatWarmCount++;
        }

        // 2. Neutral grayscale pixels (Eyes, teeth, paper, walls, spreadsheets, UI text)
        if (delta <= 16 && lum > 35) {
          neutralCount++;
        }

        // 3. Non-retinal cool / multi-color clusters (Clothing, sky, plants, UI elements)
        if (b > r + 15 || g > r + 20 || (hue > 65 && hue < 330 && sat > 0.22)) {
          coolOrMultiColorCount++;
        }
      }
    }
  }

  const meanCornerLum = cornerCount > 0 ? cornerLumSum / cornerCount : 0;
  const meanCenterLum = centerCount > 0 ? centerLumSum / centerCount : 0;
  const cornerToCenterRatio = meanCenterLum > 0 ? meanCornerLum / meanCenterLum : 1;

  const fgRatio = fgPixels / pixelCount;
  const retinalWarmRatio = fgPixels > 0 ? highSatWarmCount / fgPixels : 0;
  const neutralRatio = fgPixels > 0 ? neutralCount / fgPixels : 0;
  const coolOrMultiColorRatio = fgPixels > 0 ? coolOrMultiColorCount / fgPixels : 0;

  const meanR = fgPixels > 0 ? totalR / fgPixels : 0;
  const meanG = fgPixels > 0 ? totalG / fgPixels : 0;
  const meanB = fgPixels > 0 ? totalB / fgPixels : 0;
  const blueToRedRatio = meanR > 0 ? meanB / meanR : 1;

  // Validation Rules:
  // - Non-circular aperture: continuous rectangular illumination into corners (typical of portraits/rooms/screens)
  const isNonCircularAperture = cornerToCenterRatio > 0.88 || meanCornerLum > 88;
  // - Cool or clothing colors: dominant blues, greens, clothing colors
  const hasCoolOrClothingColors = coolOrMultiColorRatio > 0.58 || blueToRedRatio > 1.02;
  // - Grayscale / Document: high neutral gray text/page ratio
  const isDocumentOrGrayscale = neutralRatio > 0.25;
  // - Lack of retinal pigment: insufficient warm orange-red luminance
  const lacksRetinalPigment = retinalWarmRatio < 0.04 && meanR < 75;

  const isRetinal = !(isNonCircularAperture || hasCoolOrClothingColors || isDocumentOrGrayscale || lacksRetinalPigment);

  return {
    isRetinal,
    confidence: isRetinal ? 0.96 : 0.98,
    reason: isRetinal ? undefined : 'This does not appear to be a retinal/fundus image.',
    metrics: {
      cornerToCenterRatio,
      meanCornerLum,
      meanCenterLum,
      blueToRedRatio,
      coolOrMultiColorRatio,
      neutralRatio,
      retinalWarmRatio,
      fgRatio,
      meanR,
      meanG,
      meanB,
      totalLuminance: totalLuminance / pixelCount,
    },
  };
}
