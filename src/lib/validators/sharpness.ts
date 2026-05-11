import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

export function checkSharpness(
  landmarks: NormalizedLandmarkList,
  imageData: ImageData,
  width: number,
  height: number
): CheckResult {
  const top = landmarks[LANDMARKS.foreheadTop];
  const chin = landmarks[LANDMARKS.chinBottom];
  const leftEdge = landmarks[LANDMARKS.leftFaceEdge];
  const rightEdge = landmarks[LANDMARKS.rightFaceEdge];
  if (!top || !chin || !leftEdge || !rightEdge) {
    return { status: 'unknown', message: '' };
  }

  // Face bounding box in pixel coords
  const x1 = Math.max(0, Math.floor(Math.min(leftEdge.x, rightEdge.x) * width));
  const y1 = Math.max(0, Math.floor(top.y * height));
  const x2 = Math.min(width - 1, Math.ceil(Math.max(leftEdge.x, rightEdge.x) * width));
  const y2 = Math.min(height - 1, Math.ceil(chin.y * height));

  const faceW = x2 - x1;
  const faceH = y2 - y1;
  if (faceW < 10 || faceH < 10) return { status: 'unknown', message: '' };

  // Sample a smaller region for performance (center of face)
  const sampleSize = 60;
  const cx = Math.floor((x1 + x2) / 2);
  const cy = Math.floor((y1 + y2) / 2);
  const sx1 = Math.max(1, cx - Math.floor(sampleSize / 2));
  const sy1 = Math.max(1, cy - Math.floor(sampleSize / 2));
  const sx2 = Math.min(width - 2, sx1 + sampleSize);
  const sy2 = Math.min(height - 2, sy1 + sampleSize);

  const data = imageData.data;

  // Laplacian variance on grayscale
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = sy1; y < sy2; y++) {
    for (let x = sx1; x < sx2; x++) {
      const getGray = (px: number, py: number) => {
        const i = (py * width + px) * 4;
        return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      };

      const center = getGray(x, y);
      const laplacian =
        getGray(x - 1, y) +
        getGray(x + 1, y) +
        getGray(x, y - 1) +
        getGray(x, y + 1) -
        4 * center;

      sum += laplacian;
      sumSq += laplacian * laplacian;
      count++;
    }
  }

  if (count === 0) return { status: 'unknown', message: '' };

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;

  if (variance < THRESHOLDS.minSharpness) {
    return { status: 'fail', message: ko.guidance.blurry };
  }

  return { status: 'pass', message: '' };
}
