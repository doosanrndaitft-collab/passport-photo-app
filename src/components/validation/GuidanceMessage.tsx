'use client';

import { ko } from '@/locales/ko';

interface GuidanceMessageProps {
  message: string;
  allPassed: boolean;
}

export function GuidanceMessage({ message, allPassed }: GuidanceMessageProps) {
  if (allPassed) {
    return (
      <div className="rounded-xl bg-green-500/90 backdrop-blur px-4 py-2.5 text-center">
        <p className="text-sm font-semibold text-white">
          {ko.guidance.allPass}
        </p>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="rounded-xl bg-black/70 backdrop-blur px-4 py-2.5 text-center">
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  );
}
