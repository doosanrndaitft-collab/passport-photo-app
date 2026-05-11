import type { CheckResult } from '@/lib/types';
import { THRESHOLDS, BLENDSHAPES } from '@/lib/constants';
import { ko } from '@/locales/ko';

interface BlendshapeCategory {
  categoryName: string;
  score: number;
}

export function checkMouthClosed(
  blendshapes: BlendshapeCategory[] | undefined
): CheckResult {
  if (!blendshapes) return { status: 'unknown', message: '' };

  const jawOpen = blendshapes.find(
    (b) => b.categoryName === BLENDSHAPES.jawOpen
  );
  const smileLeft = blendshapes.find(
    (b) => b.categoryName === BLENDSHAPES.mouthSmileLeft
  );
  const smileRight = blendshapes.find(
    (b) => b.categoryName === BLENDSHAPES.mouthSmileRight
  );

  if (jawOpen && jawOpen.score > THRESHOLDS.jawOpenMax) {
    return { status: 'fail', message: ko.guidance.mouthOpen };
  }

  if (smileLeft && smileRight) {
    if (smileLeft.score + smileRight.score > THRESHOLDS.smileSumMax) {
      return { status: 'fail', message: ko.guidance.smiling };
    }
  }

  return { status: 'pass', message: '' };
}
