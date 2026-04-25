import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setPct(Math.min(100, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-teal transition-[width] duration-100 ease-out"
        style={{ width: `${pct}%`, boxShadow: "0 0 12px var(--color-teal)" }}
      />
      {pct > 1 && (
        <div
          className="pointer-events-none absolute -top-0.5 hidden -translate-x-full rounded-bl-md border-b border-l border-teal/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-teal backdrop-blur md:block"
          style={{ left: `${pct}%` }}
        >
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
