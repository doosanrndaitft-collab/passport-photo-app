'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { FaceLandmarker, FaceLandmarkerResult } from '@mediapipe/tasks-vision';
import { getOrCreateLandmarker, destroyLandmarker } from '@/lib/mediapipe/initLandmarker';

export function useFaceLandmarker() {
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getOrCreateLandmarker()
      .then((lm) => {
        if (!cancelled) {
          landmarkerRef.current = lm;
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load face detection model');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const detect = useCallback(
    (video: HTMLVideoElement, timestamp: number): FaceLandmarkerResult | null => {
      if (!landmarkerRef.current) return null;
      if (video.readyState < 2) return null;
      try {
        return landmarkerRef.current.detectForVideo(video, timestamp);
      } catch {
        return null;
      }
    },
    []
  );

  return { detect, isLoading, error, destroyLandmarker };
}
