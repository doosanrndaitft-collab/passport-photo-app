import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

function analyzeEyeRegion(
  landmarks: NormalizedLandmarkList,
  innerIdx: number,
  outerIdx: number,
  imageData: ImageData,
  width: number,
  height: number
): number {
  const inner = landmarks[innerIdx];
  const outer = landmarks[outerIdx];
  if (!inner || !outer) return 0;

  const eyeW = Math.abs(outer.x - inner.x) * width;
  const eyeCx = ((inner.x + outer.x) / 2) * width;
  const eyeCy = ((inner.y + outer.y) / 2) * height;

  const halfW = eyeW * 0.7;
  const halfH = eyeW * 0.5;

  const x1 = Math.max(0, Math.floor(eyeCx - halfW));
  const y1 = Math.max(0, Math.floor(eyeCy - halfH));
  const x2 = Math.min(width - 1, Math.ceil(eyeCx + halfW));
  const y2 = Math.min(height - 1, Math.ceil(eyeCy + halfH));

  const data = imageData.data;
  let glarePixels = 0;
  let total = 0;

  for (let y = y1; y <= y2; y += 2) {
    for (let x = x1; x <= x2; x += 2) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      total++;
      if (
        r > THRESHOLDS.glarePixelThreshold &&
        g > THRESHOLDS.glarePixelThreshold &&
        b > THRESHOLDS.glarePixelThreshold
      ) {
        glarePixels++;
      }
    }
  }

  return total > 0 ? glarePixels / total : 0;
}

export function checkGlassesGlare(
  landmarks: NormalizedLandmarkList,
  imageData: ImageData,
  width: number,
  height: number
): CheckResult {
  const rightGlare = analyzeEyeRegion(
    landmarks,
    LANDMARKS.rightEyeInner,
    LANDMARKS.rightEyeOuter,
    imageData,
    width,
    height
  );
  const leftGlare = analyzeEyeRegion(
    landmarks,
    LANDMARKS.leftEyeInner,
    LANDMARKS.leftEyeOuter,
    imageData,
    width,
    height
  );

  if (rightGlare > THRESHOLDS.maxGlareRatio || leftGlare > THRESHOLDS.maxGlareRatio) {
    return { status: 'fail', message: ko.guidance.glareDetected };
  }

  return { status: 'pass', message: '' };
}
