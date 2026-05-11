'use client';

import { useRef, useCallback, useState } from 'react';
import type { AutoCaptureState } from '@/lib/types';
import { THRESHOLDS } from '@/lib/constants';

export function useAutoCapture(onCapture: () => void) {
  const [state, setState] = useState<AutoCaptureState>('idle');
  const [progress, setProgress] = useState(0);
  const stabilityStartRef = useRef<number | null>(null);

  const update = useCallback(
    (allPassed: boolean) => {
      if (!allPassed) {
        stabilityStartRef.current = null;
        setState('idle');
        setProgress(0);
        return;
      }

      if (stabilityStartRef.current === null) {
        stabilityStartRef.current = performance.now();
        setState('stabilizing');
      }

      const elapsed = performance.now() - stabilityStartRef.current;
      const p = Math.min(1, elapsed / THRESHOLDS.stabilityDuration);
      setProgress(p);

      if (p >= 1) {
        setState('captured');
        stabilityStartRef.current = null;
        onCapture();
      }
    },
    [onCapture]
  );

  const reset = useCallback(() => {
    stabilityStartRef.current = null;
    setState('idle');
    setProgress(0);
  }, []);

  return { state, progress, update, reset };
}
