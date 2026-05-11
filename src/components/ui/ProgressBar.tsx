'use client';

import type { WizardStep } from '@/lib/types';
import { ko } from '@/locales/ko';

interface ProgressBarProps {
  steps: WizardStep[];
  currentIndex: number;
}

export function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`h-1 w-full rounded-full transition-colors ${
              i <= currentIndex ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
          <span
            className={`text-[10px] transition-colors ${
              i <= currentIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}
          >
            {ko.steps[step]}
          </span>
        </div>
      ))}
    </div>
  );
}
