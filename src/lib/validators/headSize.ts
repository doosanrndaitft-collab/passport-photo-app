import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

export function checkHeadSize(landmarks: NormalizedLandmarkList): CheckResult {
  const top = landmarks[LANDMARKS.foreheadTop];
  const chin = landmarks[LANDMARKS.chinBottom];
  if (!top || !chin) return { status: 'fail', message: ko.guidance.noFace };

  const headRatio = chin.y - top.y;

  if (headRatio < THRESHOLDS.minHeadFrameRatio) {
    return { status: 'fail', message: ko.guidance.headTooSmall };
  }

  if (headRatio > THRESHOLDS.maxHeadFrameRatio) {
    return { status: 'fail', message: ko.guidance.headTooLarge };
  }

  return { status: 'pass', message: '' };
}
