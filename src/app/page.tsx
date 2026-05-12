'use client';

import { useState, useCallback } from 'react';
import type { WizardStep, CaptureData } from '@/lib/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { GuideStep } from '@/components/steps/GuideStep';
import { CameraSetupStep } from '@/components/steps/CameraSetupStep';
import { ValidationStep } from '@/components/steps/ValidationStep';
import { ReviewStep } from '@/components/steps/ReviewStep';

const STEPS: WizardStep[] = ['guide', 'camera', 'validation', 'review'];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('guide');
  const [captureData, setCaptureData] = useState<CaptureData | null>(null);

  const stepIndex = STEPS.indexOf(currentStep);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, []);

  const handleCapture = useCallback((data: CaptureData) => {
    setCaptureData(data);
    goToStep('review');
  }, [goToStep]);

  const handleRetake = useCallback(() => {
    setCaptureData(null);
    goToStep('validation');
  }, [goToStep]);

  return (
    <main className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      <header className="px-4 pt-4 pb-2">
        <ProgressBar steps={STEPS} currentIndex={stepIndex} />
      </header>

      <div className="flex-1 flex flex-col">
        {currentStep === 'guide' && (
          <GuideStep onNext={() => goToStep('camera')} />
        )}
        {currentStep === 'camera' && (
          <CameraSetupStep
            onNext={() => goToStep('validation')}
            onBack={() => goToStep('guide')}
          />
        )}
        {currentStep === 'validation' && (
          <ValidationStep
            onCapture={handleCapture}
            onBack={() => goToStep('camera')}
          />
        )}
        {currentStep === 'review' && captureData && (
          <ReviewStep
            captureData={captureData}
            onRetake={handleRetake}
          />
        )}
      </div>
    </main>
  );
}
