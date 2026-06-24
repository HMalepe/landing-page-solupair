import { createFileRoute } from "@tanstack/react-router";
import { Check, Pencil, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/services")({
  head: () => ({
    meta: [
      { title: "Services — Solupair" },
      { name: "description", content: "What you offer, how long, and what it costs." },
    ],
  }),
  component: ServicesPage,
});

function statusBadge(s: string) {
  if (s === "Active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (s === "Hidden") return "bg-muted text-muted-foreground border-border";
  return "bg-rose-500/10 text-rose-400 border-rose-500/30";
}

function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title="Services"
        subtitle="What you offer, how long it takes, what it costs."
        right={
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> New service
          </button>
        }
      />

      <div className="px-6 py-8 lg:px-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] gap-4 border-b border-border px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div>Service</div>
            <div className="text-right">Booked 30d</div>
            <div className="text-right">Rate</div>
            <div className="text-right">Price</div>
            <div className="text-right">Status</div>
          </div>
          {services.map((s, i) => (
            <div
              key={s.name}
              className={`group grid grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] items-center gap-4 px-6 py-4 transition hover:bg-accent/40 ${
                i !== services.length - 1 ? "border-b border-border/60" : ""
              } ${s.status !== "Active" ? "opacity-70" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm font-medium text-foreground">{s.name}</div>
                  {s.status === "Hidden" && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">Hidden</span>}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.duration}</div>
              </div>
              <div className="text-right font-mono text-sm text-muted-foreground">{s.booked}</div>
              <div className="text-right font-mono text-xs text-muted-foreground">{s.rate}</div>
              <div className="text-right font-mono text-sm font-semibold text-foreground">{s.price}</div>
              <div className="flex items-center justify-end gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${statusBadge(s.status)}`}>
                  {s.status === "Active" && <Check className="h-3 w-3" />}
                  {s.status}
                </span>
                <div className="hidden gap-1 group-hover:flex">
                  <button className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-card px-4 py-3 text-sm shadow-elegant">
        <Check className="h-4 w-4 text-emerald-500" />
        Color hidden from booking
      </div>
    </div>
  );
}