'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { CaptureData, ValidationState, NormalizedLandmarkList } from '@/lib/types';
import { useFaceLandmarker } from '@/hooks/useFaceLandmarker';
import { useValidation, isAllPassed, getGuidanceMessage } from '@/hooks/useValidation';
import { useAutoCapture } from '@/hooks/useAutoCapture';
import { FaceGuideOverlay } from '@/components/camera/FaceGuideOverlay';
import { ValidationChecklist } from '@/components/validation/ValidationChecklist';
import { GuidanceMessage } from '@/components/validation/GuidanceMessage';
import { StabilityIndicator } from '@/components/validation/StabilityIndicator';
import { Button } from '@/components/ui/Button';
import { ko } from '@/locales/ko';

interface ValidationStepProps {
  stream: MediaStream | null;
  onCapture: (data: CaptureData) => void;
  onBack: () => void;
}

const DEFAULT_STATE: ValidationState = {
  faceDetected: { status: 'unknown', message: '' },
  faceCentered: { status: 'unknown', message: '' },
  headSize: { status: 'unknown', message: '' },
  headForward: { status: 'unknown', message: '' },
  eyesOpen: { status: 'unknown', message: '' },
  mouthClosed: { status: 'unknown', message: '' },
  backgroundWhite: { status: 'unknown', message: '' },
  noShadow: { status: 'unknown', message: '' },
  imageSharp: { status: 'unknown', message: '' },
  noGlare: { status: 'unknown', message: '' },
};

export function ValidationStep({ stream, onCapture, onBack }: ValidationStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [showFlash, setShowFlash] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>(DEFAULT_STATE);
  const lastLandmarksRef = useRef<NormalizedLandmarkList | null>(null);

  const { detect, isLoading, error } = useFaceLandmarker();
  const { validate } = useValidation();

  const doCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !lastLandmarksRef.current) return;

    const video = videoRef.current;
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const ctx = captureCanvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    captureCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        setShowFlash(true);
        try { navigator.vibrate?.(200); } catch {}
        setTimeout(() => setShowFlash(false), 400);

        onCapture({
          blob,
          landmarks: lastLandmarksRef.current!,
          frameWidth: video.videoWidth,
          frameHeight: video.videoHeight,
        });
      },
      'image/jpeg',
      0.95
    );
  }, [onCapture]);

  const { state: captureState, progress, update: updateAutoCapture } = useAutoCapture(doCapture);

  // Attach stream and force play (iOS Safari needs explicit play())
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    stream.getVideoTracks().forEach((t) => {
      t.enabled = true;
    });

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const tryPlay = () => {
      video.play().catch((err) => {
        console.error('[ValidationStep] video.play() failed:', err);
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      const onLoaded = () => tryPlay();
      video.addEventListener('loadedmetadata', onLoaded, { once: true });
      return () => video.removeEventListener('loadedmetadata', onLoaded);
    }
  }, [stream]);

  // Animation loop
  useEffect(() => {
    if (isLoading || !stream) return;

    let running = true;

    const loop = () => {
      if (!running) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const result = detect(video, performance.now());
        const state = validate(result, video, canvas);
        setValidationState(state);

        if (result && result.faceLandmarks.length === 1) {
          lastLandmarksRef.current = result.faceLandmarks[0] as unknown as NormalizedLandmarkList;
        }

        const allPass = isAllPassed(state);
        updateAutoCapture(allPass);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoading, stream, detect, validate, updateAutoCapture]);

  const allPass = isAllPassed(validationState);
  const guidance = allPass ? '' : getGuidanceMessage(validationState);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{ko.loading.model}</p>
          <p className="text-xs text-gray-400 mt-1">{ko.loading.modelDesc}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-sm text-red-600">{error}</p>
        <Button variant="secondary" onClick={onBack}>{ko.back}</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pb-4 fade-in">
      {/* Camera viewport */}
      <div className="relative aspect-[3.5/4.5] w-full rounded-2xl overflow-hidden bg-black shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
        />

        <FaceGuideOverlay allPassed={allPass} />

        <StabilityIndicator
          progress={progress}
          visible={captureState === 'stabilizing'}
        />

        {/* Flash overlay */}
        {showFlash && (
          <div className="absolute inset-0 bg-white capture-flash" />
        )}

        {/* Guidance at bottom of video */}
        <div className="absolute bottom-3 left-3 right-3">
          <GuidanceMessage message={guidance} allPassed={allPass} />
        </div>
      </div>

      {/* Hidden canvas for image analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Checklist below video */}
      <div className="mt-3 rounded-xl bg-white p-3 shadow-sm border border-gray-100">
        <ValidationChecklist state={validationState} />
      </div>

      {/* Back button */}
      <div className="mt-3">
        <Button variant="ghost" onClick={onBack} size="sm">
          {ko.back}
        </Button>
      </div>
    </div>
  );
}
