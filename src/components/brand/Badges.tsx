import { Check, AlertTriangle } from "lucide-react";

export type ShelfLevel = "floor" | "manager" | "ops";

const SHELF_META: Record<ShelfLevel, { label: string; dot: string }> = {
  floor: { label: "Floor Level", dot: "bg-emerald-400" },
  manager: { label: "Manager Level", dot: "bg-amber-400" },
  ops: { label: "Ops Level", dot: "bg-rose-400" },
};

export function ShelfCheckBadge({ level }: { level: ShelfLevel }) {
  const meta = SHELF_META[level];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function FreshnessBadge({ verifiedAt }: { verifiedAt: string }) {
  const date = new Date(verifiedAt);
  const monthsOld = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const stale = monthsOld > 6;
  const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  if (stale) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: "var(--color-amber)", borderColor: "color-mix(in oklab, var(--color-amber) 40%, transparent)" }}
      >
        <AlertTriangle className="h-3 w-3" />
        Review Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-teal">
      <Check className="h-3 w-3" />
      Verified {label}
    </span>
  );
}

export function CategoryTag({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all duration-200";
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${
          active
            ? "bg-teal text-background scale-105"
            : "border border-border bg-surface text-muted-foreground hover:text-teal hover:border-teal/40"
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={`${base} border border-teal/30 bg-teal/5 text-teal`}>{children}</span>
  );
}
