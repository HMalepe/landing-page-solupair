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
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{eyebrow ?? title}</div>
        {sections && sections.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="mr-2 text-[10px] uppercase tracking-widest text-muted-foreground">On this page</div>
            {sections.map((s, i) => (
              <a
                key={s}
                href={`#${s.toLowerCase().replace(/\s+/g, "-")}`}
                className={
                  i === 0
                    ? "rounded-full border border-primary/40 bg-gradient-brand-soft px-3 py-1.5 text-xs font-medium text-foreground"
                    : "rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground hover:border-primary/30"
                }
              >
                {s}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 px-6 py-8 lg:px-10">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}