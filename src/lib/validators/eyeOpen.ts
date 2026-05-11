import type { CheckResult } from '@/lib/types';
import { THRESHOLDS, BLENDSHAPES } from '@/lib/constants';
import { ko } from '@/locales/ko';

interface BlendshapeCategory {
  categoryName: string;
  score: number;
}

export function checkEyesOpen(
  blendshapes: BlendshapeCategory[] | undefined
): CheckResult {
  if (!blendshapes) return { status: 'unknown', message: '' };

  const blinkLeft = blendshapes.find(
    (b) => b.categoryName === BLENDSHAPES.eyeBlinkLeft
  );
  const blinkRight = blendshapes.find(
    (b) => b.categoryName === BLENDSHAPES.eyeBlinkRight
  );

  if (!blinkLeft || !blinkRight) return { status: 'unknown', message: '' };

  if (
    blinkLeft.score > THRESHOLDS.eyeBlinkMax ||
    blinkRight.score > THRESHOLDS.eyeBlinkMax
  ) {
    return { status: 'fail', message: ko.guidance.eyesClosed };
  }

  return { status: 'pass', message: '' };
}
