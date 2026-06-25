import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  hint,
  right,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70">{eyebrow}</div>
        )}
        <div className="mt-1 flex items-baseline gap-3">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}