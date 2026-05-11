// Korean passport photo specifications (Ministry of Foreign Affairs)
export const PASSPORT_SPEC = {
  // Online submission size (recommended)
  outputWidth: 413,
  outputHeight: 531,
  // Acceptable upload range
  minWidth: 395,
  maxWidth: 431,
  minHeight: 507,
  maxHeight: 550,
  // Print size in cm
  printWidthCm: 3.5,
  printHeightCm: 4.5,
  // Head length range in cm (crown to chin)
  minHeadCm: 3.2,
  maxHeadCm: 3.6,
  targetHeadCm: 3.4,
  // Head length as ratio of total height
  minHeadRatio: 3.2 / 4.5, // ~0.711
  maxHeadRatio: 3.6 / 4.5, // ~0.800
  // File constraints
  maxFileSize: 500 * 1024, // 500KB
  format: 'image/jpeg' as const,
  initialJpegQuality: 0.92,
  jpegQualityStep: 0.05,
  minJpegQuality: 0.5,
} as const;

// Camera constraints
export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 1706 },
  },
  audio: false,
};

// Validation thresholds
export const THRESHOLDS = {
  // Face position: nose tip offset from center as fraction of frame
  maxFaceOffsetX: 0.10,
  maxFaceOffsetY: 0.10,
  // Head pose angles in degrees
  maxYaw: 8,
  maxPitch: 8,
  maxRoll: 5,
  // Blendshape thresholds
  eyeBlinkMax: 0.45,
  jawOpenMax: 0.15,
  smileSumMax: 0.35,
  // Background analysis
  bgMinChannel: 185,
  bgMaxChannelDiff: 35,
  bgPassRatio: 0.80,
  bgSampleCount: 200,
  // Shadow detection
  bgMaxStdDev: 20,
  // Sharpness (Laplacian variance)
  minSharpness: 30,
  // Glasses glare
  glarePixelThreshold: 240,
  maxGlareRatio: 0.08,
  // Auto-capture stability duration in ms
  stabilityDuration: 1500,
  // Head size tolerance in the camera frame (ratio of face height to guide oval)
  minHeadFrameRatio: 0.28,
  maxHeadFrameRatio: 0.45,
} as const;

// MediaPipe landmark indices
export const LANDMARKS = {
  foreheadTop: 10,
  chinBottom: 152,
  noseTip: 1,
  rightEyeInner: 33,
  rightEyeOuter: 133,
  leftEyeInner: 362,
  leftEyeOuter: 263,
  rightFaceEdge: 234,
  leftFaceEdge: 454,
  // Face oval indices for background sampling boundary
  faceOvalIndices: [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
  ],
} as const;

// Blendshape names used for validation
export const BLENDSHAPES = {
  eyeBlinkLeft: 'eyeBlinkLeft',
  eyeBlinkRight: 'eyeBlinkRight',
  jawOpen: 'jawOpen',
  mouthSmileLeft: 'mouthSmileLeft',
  mouthSmileRight: 'mouthSmileRight',
} as const;

export const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
export const MEDIAPIPE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
