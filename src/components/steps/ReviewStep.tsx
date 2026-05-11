'use client';

import { useEffect, useState } from 'react';
import type { CaptureData } from '@/lib/types';
import { processPassportPhoto, downloadPhoto } from '@/lib/photoProcessor';
import { Button } from '@/components/ui/Button';
import { ko } from '@/locales/ko';
import { PASSPORT_SPEC } from '@/lib/constants';

interface ReviewStepProps {
  captureData: CaptureData;
  onRetake: () => void;
}

interface ProcessedPhoto {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  fileSize: number;
}

export function ReviewStep({ captureData, onRetake }: ReviewStepProps) {
  const [photo, setPhoto] = useState<ProcessedPhoto | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    async function process() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = captureData.frameWidth;
        canvas.height = captureData.frameHeight;
        const ctx = canvas.getContext('2d')!;

        const img = new Image();
        img.src = URL.createObjectURL(captureData.blob);
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(img.src);
            resolve();
          };
        });

        const result = await processPassportPhoto(canvas, captureData.landmarks);
        setPhoto(result);
      } catch (err) {
        console.error('Photo processing failed:', err);
      } finally {
        setProcessing(false);
      }
    }

    process();
  }, [captureData]);

  if (processing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <svg className="w-8 h-8 text-blue-600 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">사진을 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-sm text-red-600">사진 처리 중 오류가 발생했습니다.</p>
        <Button variant="secondary" onClick={onRetake}>
          {ko.review.retake}
        </Button>
      </div>
    );
  }

  const fileSizeKB = Math.round(photo.fileSize / 1024);
  const isUnderLimit = photo.fileSize <= PASSPORT_SPEC.maxFileSize;

  return (
    <div className="flex-1 flex flex-col px-4 pb-4 fade-in">
      <div className="py-4">
        <h2 className="text-lg font-bold text-gray-900">{ko.review.title}</h2>
      </div>

      {/* Photo preview */}
      <div className="flex justify-center">
        <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt="여권사진 미리보기"
            width={photo.width}
            height={photo.height}
            className="max-w-[200px]"
          />
        </div>
      </div>

      {/* Specs */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">{ko.review.specs}</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-gray-500">{ko.review.size}</div>
          <div className="text-gray-900 font-medium">
            {photo.width} x {photo.height}px
          </div>
          <div className="text-gray-500">{ko.review.fileSize}</div>
          <div className={`font-medium ${isUnderLimit ? 'text-green-600' : 'text-red-600'}`}>
            {fileSizeKB}KB / 500KB
          </div>
          <div className="text-gray-500">{ko.review.format}</div>
          <div className="text-gray-900 font-medium">JPG/JPEG</div>
        </div>
      </div>

      {/* Warning */}
      <p className="mt-3 text-[10px] text-gray-400 text-center leading-relaxed px-2">
        {ko.review.warning}
      </p>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={onRetake} className="flex-1">
          {ko.review.retake}
        </Button>
        <Button
          onClick={() => downloadPhoto(photo.blob)}
          className="flex-1"
        >
          {ko.review.download}
        </Button>
      </div>
    </div>
  );
}
