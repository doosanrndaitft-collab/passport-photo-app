import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_WASM_URL, MEDIAPIPE_MODEL_URL } from '@/lib/constants';

let landmarkerInstance: FaceLandmarker | null = null;
let initPromise: Promise<FaceLandmarker> | null = null;

export async function getOrCreateLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);

    const landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MEDIAPIPE_MODEL_URL,
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 2,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
    });

    landmarkerInstance = landmarker;
    return landmarker;
  })().catch((err) => {
    initPromise = null;
    throw err;
  });

  return initPromise;
}

export function destroyLandmarker() {
  if (landmarkerInstance) {
    landmarkerInstance.close();
    landmarkerInstance = null;
    initPromise = null;
  }
}
