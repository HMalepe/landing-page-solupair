export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sp-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <filter id="sp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g stroke="url(#sp-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#sp-glow)">
        <path d="M 70 25 L 30 25 Q 18 25 18 37 Q 18 49 30 49 L 62 49 Q 74 49 74 61 Q 74 73 62 73 L 30 73" />
        <path d="M 46 73 L 46 88" />
      </g>
    </svg>
  );
}