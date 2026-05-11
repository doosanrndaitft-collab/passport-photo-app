import type { CheckResult, NormalizedLandmarkList } from '@/lib/types';
import { LANDMARKS, THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

export function checkFacePosition(landmarks: NormalizedLandmarkList): CheckResult {
  const nose = landmarks[LANDMARKS.noseTip];
  if (!nose) return { status: 'fail', message: ko.guidance.noFace };

  const offsetX = nose.x - 0.5;
  const offsetY = nose.y - 0.5;

  if (Math.abs(offsetX) > THRESHOLDS.maxFaceOffsetX) {
    return {
      status: 'fail',
      message: offsetX > 0 ? ko.guidance.faceRight : ko.guidance.faceLeft,
    };
  }

  if (Math.abs(offsetY) > THRESHOLDS.maxFaceOffsetY) {
    return {
      status: 'fail',
      message: offsetY > 0 ? ko.guidance.faceDown : ko.guidance.faceUp,
    };
  }

  return { status: 'pass', message: '' };
}
