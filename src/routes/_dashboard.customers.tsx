import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, AlertTriangle, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { clients } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/customers")({
  head: () => ({
    meta: [
      { title: "Clients — Solupair" },
      { name: "description", content: "Every client, every visit, every Rand." },
    ],
  }),
  component: ClientsPage,
});

const filters = [
  { key: "all", label: "All", count: 10 },
  { key: "new", label: "New", count: 8 },
  { key: "risk", label: "At risk", count: 0 },
  { key: "champ", label: "Champions", count: 1 },
  { key: "vip", label: "VIP", count: 0 },
];

function statusDot(s: string) {
  if (s === "active") return "bg-emerald-500";
  if (s === "pending") return "bg-amber-500";
  return "bg-muted-foreground/50";
}

function ClientsPage() {
  const [filter, setFilter] = useState("all");
  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title="Clients"
        subtitle="8 clients — 2 look like duplicates, tap to merge."
        right={
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input className="w-56 bg-transparent outline-none text-sm placeholder:text-muted-foreground" placeholder="Name, email, or phone…" />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:border-primary/40">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        }
      />

      <div className="space-y-6 px-6 py-8 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={
                  active
                    ? "inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-medium text-white shadow-glow"
                    : "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground transition hover:text-foreground hover:border-primary/40"
                }
              >
                {f.label}
                <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] ${active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{f.count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1 text-sm">
            <span className="font-semibold text-amber-500">2 phone numbers matched to multiple records.</span>
            <span className="ml-1 text-foreground/80">Use the Merge button on each duplicate pair to consolidate history into one profile.</span>
          </div>
          <button className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-amber-950">Review duplicates</button>
        </div>

        <div className="grid gap-3">
          {clients.map((c) => (
            <div key={c.id} className="group rounded-2xl border border-border bg-card p-5 shadow-elegant transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${c.color} text-sm font-semibold text-white shadow-glow`}>
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-base font-semibold text-foreground">{c.name}</div>
                    {c.badge && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">{c.badge}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className={`inline-flex items-center gap-1.5`}>
                      <span className={`h-2 w-2 rounded-full ${statusDot(c.status)}`} />
                      <Phone className="h-3 w-3" /> {c.phone}
                    </span>
                    {c.email && <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.email}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>Spent <span className="font-mono font-semibold text-foreground">R {c.spent}</span></span>
                    <span>Last visit <span className="font-semibold text-foreground">{c.lastVisit}</span></span>
                    <span>{c.visits} {c.visits === 1 ? "visit" : "visits"}</span>
                  </div>
                </div>
                <button className="shrink-0 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition group-hover:text-foreground group-hover:border-primary/40">View profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}