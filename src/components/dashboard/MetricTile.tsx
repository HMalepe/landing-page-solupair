import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function Number({ value }: { value: number | string }) {
  const isNum = typeof value === "number";
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (!isNum) return;
    const controls = animate(mv, value as number, { duration: 1.1, ease: "easeOut" });
    return controls.stop;
  }, [value, isNum, mv]);
  if (!isNum) return <>{value}</>;
  return <motion.span>{rounded}</motion.span>;
}

export function MetricTile({
  label,
  value,
  delta,
  deltaUp,
  accent,
  badge,
}: {
  label: string;
  value: number | string;
  delta?: string;
  deltaUp?: boolean;
  accent?: "warn" | "danger" | false;
  badge?: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elegant transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
      {accent && (
        <div
          aria-hidden
          className={`absolute -top-16 -right-16 h-32 w-32 rounded-full blur-2xl opacity-60 ${
            accent === "danger" ? "bg-rose-500/30" : "bg-amber-500/30"
          }`}
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
        {badge ? (
          <span
            className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold ${
              accent === "danger" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground">
        <Number value={value} />
      </div>
      {delta && (
        <div className={`mt-2 flex items-center gap-1 text-xs ${deltaUp ? "text-emerald-500" : "text-muted-foreground"}`}>
          {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </div>
      )}
    </div>
  );
}