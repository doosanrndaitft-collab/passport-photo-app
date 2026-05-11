export type CheckStatus = 'pass' | 'fail' | 'unknown';

export interface CheckResult {
  status: CheckStatus;
  message: string;
}

export interface ValidationState {
  faceDetected: CheckResult;
  faceCentered: CheckResult;
  headSize: CheckResult;
  headForward: CheckResult;
  eyesOpen: CheckResult;
  mouthClosed: CheckResult;
  backgroundWhite: CheckResult;
  noShadow: CheckResult;
  imageSharp: CheckResult;
  noGlare: CheckResult;
}

export type ValidationKey = keyof ValidationState;

export interface CaptureData {
  blob: Blob;
  landmarks: NormalizedLandmarkList;
  frameWidth: number;
  frameHeight: number;
}

export type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
};

export type NormalizedLandmarkList = NormalizedLandmark[];

export type WizardStep = 'guide' | 'camera' | 'validation' | 'review';

export type AutoCaptureState = 'idle' | 'stabilizing' | 'captured';
