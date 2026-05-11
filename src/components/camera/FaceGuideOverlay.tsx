'use client';

interface FaceGuideOverlayProps {
  allPassed: boolean;
}

export function FaceGuideOverlay({ allPassed }: FaceGuideOverlayProps) {
  const color = allPassed ? '#22c55e' : 'rgba(255,255,255,0.6)';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 350 450"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Darkened corners outside the oval */}
      <defs>
        <mask id="ovalMask">
          <rect width="350" height="450" fill="white" />
          <ellipse cx="175" cy="195" rx="95" ry="125" fill="black" />
        </mask>
      </defs>
      <rect
        width="350"
        height="450"
        fill="rgba(0,0,0,0.25)"
        mask="url(#ovalMask)"
      />

      {/* Face oval guide */}
      <ellipse
        cx="175"
        cy="195"
        rx="95"
        ry="125"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={allPassed ? 'none' : '8 4'}
        className="transition-colors duration-300"
      />

      {/* Center crosshair */}
      <line x1="170" y1="195" x2="180" y2="195" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="175" y1="190" x2="175" y2="200" stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Shoulder guide line */}
      <path
        d="M 90 370 Q 175 340 260 370"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.4"
      />
    </svg>
  );
}
