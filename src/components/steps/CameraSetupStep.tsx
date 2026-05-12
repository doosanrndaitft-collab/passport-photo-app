'use client';

import { useEffect, useState, useRef } from 'react';
import { ko } from '@/locales/ko';
import { Button } from '@/components/ui/Button';
import { CAMERA_CONSTRAINTS } from '@/lib/constants';

interface CameraSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
}

type CameraState = 'requesting' | 'ready' | 'denied' | 'not-found' | 'error';

export function CameraSetupStep({ onNext, onBack, stream, setStream }: CameraSetupStepProps) {
  const [state, setState] = useState<CameraState>(stream ? 'ready' : 'requesting');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream) {
      setState('ready');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
        if (cancelled) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(mediaStream);
        setState('ready');
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            setState('denied');
          } else if (err.name === 'NotFoundError') {
            setState('not-found');
          } else {
            setState('error');
          }
        } else {
          setState('error');
        }
      }
    }

    startCamera();
    return () => { cancelled = true; };
  }, [stream, setStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const tryPlay = () => {
      video.play().catch((err) => {
        console.error('[CameraSetupStep] video.play() failed:', err);
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

  return (
    <div className="flex-1 flex flex-col px-4 pb-4 fade-in">
      <div className="flex-1 flex flex-col items-center justify-center">
        {state === 'requesting' && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{ko.camera.requesting}</p>
          </div>
        )}

        {state === 'ready' && (
          <div className="w-full space-y-4">
            <div className="relative aspect-[3.5/4.5] w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-green-700 font-medium">{ko.camera.ready}</p>
            </div>
          </div>
        )}

        {(state === 'denied' || state === 'not-found' || state === 'error') && (
          <div className="text-center space-y-3 px-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              {state === 'denied' && ko.camera.denied}
              {state === 'not-found' && ko.camera.notFound}
              {state === 'error' && ko.camera.error}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          {ko.back}
        </Button>
        <Button onClick={onNext} disabled={state !== 'ready'} className="flex-1">
          {ko.camera.proceed}
        </Button>
      </div>
    </div>
  );
}
