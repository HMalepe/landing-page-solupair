import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

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
  const isAction = accent === "warn" || accent === "danger";
  const ring =
    accent === "danger"
      ? "border-rose-500/40 bg-rose-500/[0.04]"
      : accent === "warn"
        ? "border-amber-500/40 bg-amber-500/[0.04]"
        : "border-border bg-card";
  const bar =
    accent === "danger" ? "bg-rose-500" : accent === "warn" ? "bg-amber-500" : "";
  const labelTone =
    accent === "danger" ? "text-rose-500" : accent === "warn" ? "text-amber-500" : "text-muted-foreground";
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 shadow-elegant transition hover:-translate-y-0.5 ${ring} ${
        isAction ? "hover:shadow-glow" : "hover:border-primary/40"
      }`}
    >
      {isAction && <span aria-hidden className={`absolute left-0 top-0 h-full w-1 ${bar}`} />}
      <div className="flex items-start justify-between gap-2">
        <div className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${labelTone}`}>{label}</div>
        {badge ? (
          <span
            className={`grid h-6 min-w-6 place-items-center rounded-full px-2 text-[11px] font-bold ${
              accent === "danger" ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-4 font-mono text-[2rem] font-semibold leading-none tracking-tight text-foreground">
        <Number value={value} />
      </div>
      {delta && (
        <div
          className={`mt-3 flex items-center gap-1 text-xs ${
            isAction
              ? "font-medium text-foreground"
              : deltaUp
                ? "text-emerald-500"
                : "text-muted-foreground"
          }`}
        >
          {isAction ? (
            <>
              {delta} <ArrowRight className="h-3 w-3" />
            </>
          ) : (
            <>
              {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {delta}
            </>
          )}
        </div>
      )}
    </div>
  );
}