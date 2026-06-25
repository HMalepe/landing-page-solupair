export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.82_0.16_210/0.08)] blur-[140px]" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.66_0.24_300/0.08)] blur-[160px]" />
    </div>
  );
}