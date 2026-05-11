import type { NormalizedLandmarkList } from '@/lib/types';
import { PASSPORT_SPEC, LANDMARKS } from '@/lib/constants';

interface ProcessResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export async function processPassportPhoto(
  sourceCanvas: HTMLCanvasElement,
  landmarks: NormalizedLandmarkList
): Promise<ProcessResult> {
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  const top = landmarks[LANDMARKS.foreheadTop];
  const chin = landmarks[LANDMARKS.chinBottom];
  const nose = landmarks[LANDMARKS.noseTip];

  const crownY = top.y * srcH;
  const chinY = chin.y * srcH;
  const headHeight = chinY - crownY;
  const faceCenterX = nose.x * srcW;

  // Target: head should be targetHeadCm in a printHeightCm photo
  const targetRatio = PASSPORT_SPEC.targetHeadCm / PASSPORT_SPEC.printHeightCm;
  const cropHeight = headHeight / targetRatio;
  const cropWidth = cropHeight * (PASSPORT_SPEC.printWidthCm / PASSPORT_SPEC.printHeightCm);

  // Position: head vertically centered with slightly more space above
  const topMargin = (cropHeight - headHeight) / 2;
  // Standard passport: ~40% above head, ~rest below chin for shoulders
  let cropTop = crownY - topMargin * 0.7;
  let cropLeft = faceCenterX - cropWidth / 2;

  // Clamp to source bounds
  cropLeft = Math.max(0, Math.min(srcW - cropWidth, cropLeft));
  cropTop = Math.max(0, Math.min(srcH - cropHeight, cropTop));

  // Crop and resize
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = PASSPORT_SPEC.outputWidth;
  outputCanvas.height = PASSPORT_SPEC.outputHeight;
  const ctx = outputCanvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    sourceCanvas,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    PASSPORT_SPEC.outputWidth,
    PASSPORT_SPEC.outputHeight
  );

  // Compress to JPEG under 500KB
  let quality = PASSPORT_SPEC.initialJpegQuality;
  let blob: Blob;

  do {
    blob = await new Promise<Blob>((resolve) => {
      outputCanvas.toBlob(
        (b) => resolve(b!),
        PASSPORT_SPEC.format,
        quality
      );
    });
    quality -= PASSPORT_SPEC.jpegQualityStep;
  } while (blob.size > PASSPORT_SPEC.maxFileSize && quality > PASSPORT_SPEC.minJpegQuality);

  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    width: PASSPORT_SPEC.outputWidth,
    height: PASSPORT_SPEC.outputHeight,
    fileSize: blob.size,
  };
}

export function downloadPhoto(blob: Blob, filename = '여권사진.jpg') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
