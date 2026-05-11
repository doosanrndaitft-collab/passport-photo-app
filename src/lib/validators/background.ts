import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

export function checkBackground(
  landmarks: NormalizedLandmarkList,
  imageData: ImageData,
  width: number,
  height: number
): CheckResult {
  const faceOval = LANDMARKS.faceOvalIndices.map((i) => landmarks[i]);
  if (faceOval.some((p) => !p)) return { status: 'unknown', message: '' };

  // Build a simple bounding box for the face with padding
  const faceXs = faceOval.map((p) => p.x);
  const faceYs = faceOval.map((p) => p.y);
  const faceMinX = Math.min(...faceXs);
  const faceMaxX = Math.max(...faceXs);
  const faceMinY = Math.min(...faceYs);
  const faceMaxY = Math.max(...faceYs);

  const faceW = faceMaxX - faceMinX;
  const faceH = faceMaxY - faceMinY;

  // Expanded body region (below face, wider)
  const bodyMinX = faceMinX - faceW * 0.5;
  const bodyMaxX = faceMaxX + faceW * 0.5;
  const bodyMinY = faceMaxY;
  const bodyMaxY = Math.min(1, faceMaxY + faceH * 1.2);

  const data = imageData.data;
  let passCount = 0;
  let totalSampled = 0;

  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / THRESHOLDS.bgSampleCount)));

  for (let sy = 0; sy < height; sy += step) {
    for (let sx = 0; sx < width; sx += step) {
      const nx = sx / width;
      const ny = sy / height;

      // Skip face region (with padding)
      if (
        nx > faceMinX - faceW * 0.15 &&
        nx < faceMaxX + faceW * 0.15 &&
        ny > faceMinY - faceH * 0.1 &&
        ny < faceMaxY + faceH * 0.05
      ) {
        continue;
      }

      // Skip body region
      if (nx > bodyMinX && nx < bodyMaxX && ny > bodyMinY && ny < bodyMaxY) {
        continue;
      }

      const idx = (sy * width + sx) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      totalSampled++;

      const minCh = Math.min(r, g, b);
      const maxCh = Math.max(r, g, b);

      if (minCh >= THRESHOLDS.bgMinChannel && maxCh - minCh <= THRESHOLDS.bgMaxChannelDiff) {
        passCount++;
      }
    }
  }

  if (totalSampled < 20) return { status: 'unknown', message: '' };

  const ratio = passCount / totalSampled;
  if (ratio < THRESHOLDS.bgPassRatio) {
    return { status: 'fail', message: ko.guidance.bgNotWhite };
  }

  return { status: 'pass', message: '' };
}
