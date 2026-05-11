'use client';

import { ko } from '@/locales/ko';
import { Button } from '@/components/ui/Button';

const ICONS: Record<string, string> = {
  '벽': '🏠',
  '조명': '💡',
  '모자': '🧢',
  '머리': '💇',
  '카메라': '📷',
  '거리': '📏',
};

interface GuideStepProps {
  onNext: () => void;
}

export function GuideStep({ onNext }: GuideStepProps) {
  return (
    <div className="flex-1 flex flex-col px-4 pb-4 fade-in">
      <div className="py-4">
        <h1 className="text-xl font-bold text-gray-900">{ko.guide.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{ko.guide.subtitle}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {ko.guide.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl bg-white p-3.5 shadow-sm border border-gray-100"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
              {ICONS[item.icon] || '📋'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 space-y-2">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-2">
          {ko.guide.disclaimer}
        </p>
        <Button onClick={onNext} size="lg" className="w-full">
          {ko.guide.startButton}
        </Button>
      </div>
    </div>
  );
}
