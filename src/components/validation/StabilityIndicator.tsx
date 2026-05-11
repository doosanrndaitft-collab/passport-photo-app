'use client';

interface StabilityIndicatorProps {
  progress: number;
  visible: boolean;
}

export function StabilityIndicator({ progress, visible }: StabilityIndicatorProps) {
  if (!visible) return null;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg width="72" height="72" className="pulse-ring">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          className="transition-[stroke-dashoffset] duration-100"
        />
      </svg>
    </div>
  );
}
