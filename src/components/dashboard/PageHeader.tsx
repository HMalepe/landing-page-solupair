import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  sections,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  sections?: string[];
  right?: ReactNode;
}) {
  return (
    <div className="border-b border-border/60">
      <div className="px-6 pt-6 lg:px-10">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">{eyebrow}</div>
        )}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 px-6 pt-3 pb-6 lg:px-10">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {sections && sections.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 px-6 pb-3 lg:px-10">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {s}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}