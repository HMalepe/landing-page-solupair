import { Brain, Sparkles, ArrowUpRight, CreditCard, LifeBuoy } from "lucide-react";

const insights = [
  {
    icon: CreditCard,
    title: "11 bookings awaiting payment",
    body: "Payment links are still open — follow up before slots expire or clients drop off.",
    cta: "View bookings",
    accent: "amber",
  },
  {
    icon: LifeBuoy,
    title: "19 help requests need attention",
    body: "Unresolved tickets hurt retention — clear the queue while it's quiet.",
    cta: "View tickets",
    accent: "rose",
  },
];

export function AICoachCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-elegant border-gradient-brand">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand-soft border border-primary/30">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            AI Business Coach
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-brand-soft border border-primary/30 px-2 py-0.5 text-[10px] text-primary">
              <Sparkles className="h-3 w-3" /> Claude
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Proactive nudges from your bookings, revenue, and clients — not another report.</div>
        </div>
      </div>
      <div className="grid gap-3">
        {insights.map((i) => {
          const Icon = i.icon;
          return (
            <div
              key={i.title}
              className="group flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4 transition hover:border-primary/40"
            >
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${i.accent === "amber" ? "bg-amber-500/15 text-amber-500" : "bg-rose-500/15 text-rose-500"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{i.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{i.body}</div>
              </div>
              <button className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-gradient-brand px-3 py-1.5 text-xs font-medium text-white shadow-glow transition group-hover:scale-[1.02]">
                {i.cta} <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}