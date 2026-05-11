import type { CheckResult } from '@/lib/types';
import { THRESHOLDS } from '@/lib/constants';
import { ko } from '@/locales/ko';

const RAD_TO_DEG = 180 / Math.PI;

export function checkHeadPose(
  transformationMatrix: { data: Float32Array } | undefined
): CheckResult {
  if (!transformationMatrix) {
    return { status: 'fail', message: ko.guidance.lookForward };
  }

  const d = transformationMatrix.data;
  // 4x4 column-major matrix decomposition
  const pitch = Math.asin(Math.max(-1, Math.min(1, -d[2]))) * RAD_TO_DEG;
  const yaw = Math.atan2(d[1], d[0]) * RAD_TO_DEG;
  const roll = Math.atan2(d[6], d[10]) * RAD_TO_DEG;

  if (Math.abs(yaw) > THRESHOLDS.maxYaw) {
    return {
      status: 'fail',
      message: yaw > 0 ? ko.guidance.turnRight : ko.guidance.turnLeft,
    };
  }

  if (Math.abs(pitch) > THRESHOLDS.maxPitch) {
    return {
      status: 'fail',
      message: pitch > 0 ? ko.guidance.lookUp : ko.guidance.lookDown,
    };
  }

  if (Math.abs(roll) > THRESHOLDS.maxRoll) {
    return { status: 'fail', message: ko.guidance.headTilted };
  }

  return { status: 'pass', message: '' };
}
