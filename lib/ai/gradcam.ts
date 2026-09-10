import sharp from 'sharp';
import type { GradCAMResult } from './types';
import type { ModelPrediction } from './model';
import type { PreprocessedFundus } from './preprocess';

/**
 * Turbo / Medical Jet Colormap Converter
 * Maps a normalized float scalar [0, 1] to RGB values.
 */
function turboColormap(t: number): [number, number, number, number] {
  if (t < 0.08) {
    return [0, 0, 0, 0]; // Transparent background for non-salient areas
  }

  // Normalized 0..1 to color transitions
  let r = 0;
  let g = 0;
  let b = 0;
  const alpha = Math.min(255, Math.max(0, Math.round(Math.pow(t, 0.75) * 230)));

  if (t < 0.25) {
    const norm = t / 0.25;
    r = 20;
    g = Math.round(180 * norm + 40);
    b = Math.round(240 * (1 - norm * 0.2));
  } else if (t < 0.55) {
    const norm = (t - 0.25) / 0.3;
    r = Math.round(56 + norm * 180);
    g = Math.round(217 - norm * 20);
    b = Math.round(197 * (1 - norm));
  } else if (t < 0.8) {
    const norm = (t - 0.55) / 0.25;
    r = Math.round(236 + norm * 19);
    g = Math.round(197 - norm * 110);
    b = Math.round(75 * (1 - norm));
  } else {
    const norm = (t - 0.8) / 0.2;
    r = 255;
    g = Math.round(87 * (1 - norm * 0.7));
    b = Math.round(87 * (1 - norm * 0.7));
  }

  return [r, g, b, alpha];
}

/**
 * Generates true Grad-CAM Heatmap and Overlay visualizations.
 */
export async function generateGradCAM(
  preprocessed: PreprocessedFundus,
  prediction: ModelPrediction
): Promise<GradCAMResult> {
  const { width, height, processedBuffer } = preprocessed;
  const { featureMap, featureMapSize, quadrantActivations } = prediction;

  // Find peak quadrant
  const quads = [
    { name: 'Superior-Temporal', val: quadrantActivations.superiorTemporal },
    { name: 'Inferior-Temporal', val: quadrantActivations.inferiorTemporal },
    { name: 'Superior-Nasal', val: quadrantActivations.superiorNasal },
    { name: 'Inferior-Nasal', val: quadrantActivations.inferiorNasal },
    { name: 'Macular / Central', val: quadrantActivations.macular },
  ];
  quads.sort((a, b) => b.val - a.val);
  const peakActivationQuadrant = quads[0].name;

  // Bilinear interpolation of the feature map (16x16) to full resolution (width x height)
  const heatmapRgba = Buffer.alloc(width * height * 4);
  const salientCoordinates: Array<{ x: number; y: number; weight: number }> = [];

  // Find max value in feature map for normalization
  let maxVal = 0.0001;
  for (let i = 0; i < featureMap.length; i++) {
    if (featureMap[i] > maxVal) maxVal = featureMap[i];
  }

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = width * 0.46;

  for (let y = 0; y < height; y++) {
    const gy = (y / height) * (featureMapSize - 1);
    const gy0 = Math.floor(gy);
    const gy1 = Math.min(featureMapSize - 1, gy0 + 1);
    const fy = gy - gy0;

    for (let x = 0; x < width; x++) {
      const gx = (x / width) * (featureMapSize - 1);
      const gx0 = Math.floor(gx);
      const gx1 = Math.min(featureMapSize - 1, gx0 + 1);
      const fx = gx - gx0;

      // Distance from center of retina
      const distFromCenter = Math.hypot(x - cx, y - cy);
      if (distFromCenter > maxRadius) {
        const offset = (y * width + x) * 4;
        heatmapRgba[offset] = 0;
        heatmapRgba[offset + 1] = 0;
        heatmapRgba[offset + 2] = 0;
        heatmapRgba[offset + 3] = 0;
        continue;
      }

      // Bilinear interpolation
      const v00 = featureMap[gy0 * featureMapSize + gx0];
      const v10 = featureMap[gy0 * featureMapSize + gx1];
      const v01 = featureMap[gy1 * featureMapSize + gx0];
      const v11 = featureMap[gy1 * featureMapSize + gx1];

      const top = v00 * (1 - fx) + v10 * fx;
      const bottom = v01 * (1 - fx) + v11 * fx;
      const val = top * (1 - fy) + bottom * fy;

      // Normalized saliency intensity [0, 1]
      const normVal = Math.min(1.0, Math.max(0.0, val / maxVal));

      const [r, g, b, a] = turboColormap(normVal);
      const offset = (y * width + x) * 4;
      heatmapRgba[offset] = r;
      heatmapRgba[offset + 1] = g;
      heatmapRgba[offset + 2] = b;
      heatmapRgba[offset + 3] = a;

      if (normVal > 0.75 && y % 32 === 0 && x % 32 === 0) {
        salientCoordinates.push({
          x: Math.round((x / width) * 100),
          y: Math.round((y / height) * 100),
          weight: Math.round(normVal * 100),
        });
      }
    }
  }

  // Generate transparent PNG heatmap buffer
  const heatmapPngBuffer = await sharp(heatmapRgba, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  // Generate blended overlay image (Original Fundus + Grad-CAM Heatmap)
  const overlayPngBuffer = await sharp(processedBuffer)
    .composite([
      {
        input: heatmapPngBuffer,
        blend: 'over',
      },
    ])
    .png()
    .toBuffer();

  const heatmapDataUrl = `data:image/png;base64,${heatmapPngBuffer.toString('base64')}`;
  const overlayDataUrl = `data:image/png;base64,${overlayPngBuffer.toString('base64')}`;

  return {
    heatmapDataUrl,
    overlayDataUrl,
    peakActivationQuadrant,
    salientCoordinates: salientCoordinates.slice(0, 5),
  };
}
