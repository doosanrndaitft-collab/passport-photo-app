import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { ko } from '@/locales/ko';

export function checkFaceDetection(
  faceLandmarks: NormalizedLandmarkList[]
): CheckResult {
  if (faceLandmarks.length === 0) {
    return { status: 'fail', message: ko.guidance.noFace };
  }
  if (faceLandmarks.length > 1) {
    return { status: 'fail', message: ko.guidance.multipleFaces };
  }
  return { status: 'pass', message: '' };
}
