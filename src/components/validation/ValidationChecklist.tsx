'use client';

import type { ValidationState, ValidationKey } from '@/lib/types';
import { ko } from '@/locales/ko';

interface ValidationChecklistProps {
  state: ValidationState;
}

const CHECK_ORDER: ValidationKey[] = [
  'faceDetected',
  'faceCentered',
  'headSize',
  'headForward',
  'eyesOpen',
  'mouthClosed',
  'backgroundWhite',
  'noShadow',
  'imageSharp',
  'noGlare',
];

export function ValidationChecklist({ state }: ValidationChecklistProps) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {CHECK_ORDER.map((key) => {
        const check = state[key];
        const passed = check.status === 'pass';
        const failed = check.status === 'fail';

        return (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                passed
                  ? 'bg-green-500'
                  : failed
                  ? 'bg-red-500'
                  : 'bg-gray-300'
              }`}
            >
              {passed && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {failed && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] leading-tight ${
                passed ? 'text-green-700' : failed ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {ko.checks[key]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
