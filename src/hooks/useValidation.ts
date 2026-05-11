'use client';

import { useCallback, useRef } from 'react';
import type { FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import type { ValidationState, NormalizedLandmarkList } from '@/lib/types';
import { checkFaceDetection } from '@/lib/validators/faceDetection';
import { checkFacePosition } from '@/lib/validators/facePosition';
import { checkHeadSize } from '@/lib/validators/headSize';
import { checkHeadPose } from '@/lib/validators/headPose';
import { checkEyesOpen } from '@/lib/validators/eyeOpen';
import { checkMouthClosed } from '@/lib/validators/mouthClosed';
import { checkBackground } from '@/lib/validators/background';
import { checkShadow } from '@/lib/validators/shadow';
import { checkSharpness } from '@/lib/validators/sharpness';
import { checkGlassesGlare } from '@/lib/validators/glassesGlare';

const UNKNOWN_CHECK = { status: 'unknown' as const, message: '' };

const DEFAULT_STATE: ValidationState = {
  faceDetected: UNKNOWN_CHECK,
  faceCentered: UNKNOWN_CHECK,
  headSize: UNKNOWN_CHECK,
  headForward: UNKNOWN_CHECK,
  eyesOpen: UNKNOWN_CHECK,
  mouthClosed: UNKNOWN_CHECK,
  backgroundWhite: UNKNOWN_CHECK,
  noShadow: UNKNOWN_CHECK,
  imageSharp: UNKNOWN_CHECK,
  noGlare: UNKNOWN_CHECK,
};

export function useValidation() {
  const frameCountRef = useRef(0);
  const lastImageChecksRef = useRef<Pick<ValidationState, 'backgroundWhite' | 'noShadow' | 'imageSharp' | 'noGlare'>>({
    backgroundWhite: UNKNOWN_CHECK,
    noShadow: UNKNOWN_CHECK,
    imageSharp: UNKNOWN_CHECK,
    noGlare: UNKNOWN_CHECK,
  });

  const validate = useCallback(
    (
      result: FaceLandmarkerResult | null,
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement
    ): ValidationState => {
      if (!result) return DEFAULT_STATE;

      const faceDetected = checkFaceDetection(
        result.faceLandmarks as unknown as NormalizedLandmarkList[]
      );

      if (faceDetected.status !== 'pass') {
        return { ...DEFAULT_STATE, faceDetected };
      }

      const landmarks = result.faceLandmarks[0] as unknown as NormalizedLandmarkList;
      const blendshapes = result.faceBlendshapes?.[0]?.categories;
      const rawMatrix = result.facialTransformationMatrixes?.[0];
      const matrix = rawMatrix
        ? { data: new Float32Array(rawMatrix.data) }
        : undefined;

      const faceCentered = checkFacePosition(landmarks);
      const headSize = checkHeadSize(landmarks);
      const headForward = checkHeadPose(matrix);
      const eyesOpen = checkEyesOpen(blendshapes);
      const mouthClosed = checkMouthClosed(blendshapes);

      // Run image analysis checks every 3rd frame for performance
      frameCountRef.current++;
      if (frameCountRef.current % 3 === 0) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx && video.readyState >= 2) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          lastImageChecksRef.current = {
            backgroundWhite: checkBackground(landmarks, imageData, canvas.width, canvas.height),
            noShadow: checkShadow(landmarks, imageData, canvas.width, canvas.height),
            imageSharp: checkSharpness(landmarks, imageData, canvas.width, canvas.height),
            noGlare: checkGlassesGlare(landmarks, imageData, canvas.width, canvas.height),
          };
        }
      }

      return {
        faceDetected,
        faceCentered,
        headSize,
        headForward,
        eyesOpen,
        mouthClosed,
        ...lastImageChecksRef.current,
      };
    },
    []
  );

  return { validate };
}

export function isAllPassed(state: ValidationState): boolean {
  return Object.values(state).every(
    (check) => check.status === 'pass'
  );
}

export function getGuidanceMessage(state: ValidationState): string {
  const priority: (keyof ValidationState)[] = [
    'faceDetected',
    'headSize',
    'faceCentered',
    'headForward',
    'eyesOpen',
    'mouthClosed',
    'backgroundWhite',
    'noShadow',
    'imageSharp',
    'noGlare',
  ];

  for (const key of priority) {
    if (state[key].status === 'fail' && state[key].message) {
      return state[key].message;
    }
  }

  return '';
}
