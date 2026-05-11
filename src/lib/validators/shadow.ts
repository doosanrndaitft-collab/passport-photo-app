import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

export function checkShadow(
  landmarks: NormalizedLandmarkList,
  imageData: ImageData,
  width: number,
  height: number
): CheckResult {
  const faceOval = LANDMARKS.faceOvalIndices.map((i) => landmarks[i]);
  if (faceOval.some((p) => !p)) return { status: 'unknown', message: '' };

  const faceXs = faceOval.map((p) => p.x);
  const faceYs = faceOval.map((p) => p.y);
  const faceMinX = Math.min(...faceXs);
  const faceMaxX = Math.max(...faceXs);
  const faceMinY = Math.min(...faceYs);
  const faceMaxY = Math.max(...faceYs);
  const faceW = faceMaxX - faceMinX;
  const faceH = faceMaxY - faceMinY;

  const data = imageData.data;
  const luminances: number[] = [];

  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / THRESHOLDS.bgSampleCount)));

  for (let sy = 0; sy < height; sy += step) {
    for (let sx = 0; sx < width; sx += step) {
      const nx = sx / width;
      const ny = sy / height;

      if (
        nx > faceMinX - faceW * 0.3 &&
        nx < faceMaxX + faceW * 0.3 &&
        ny > faceMinY - faceH * 0.2 &&
        ny < faceMaxY + faceH * 0.8
      ) {
        continue;
      }

      const idx = (sy * width + sx) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      luminances.push(0.299 * r + 0.587 * g + 0.114 * b);
    }
  }

  if (luminances.length < 20) return { status: 'unknown', message: '' };

  const mean = luminances.reduce((a, b) => a + b, 0) / luminances.length;
  const variance =
    luminances.reduce((sum, v) => sum + (v - mean) ** 2, 0) / luminances.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev > THRESHOLDS.bgMaxStdDev) {
    return { status: 'fail', message: ko.guidance.shadowDetected };
  }

  return { status: 'pass', message: '' };
}
