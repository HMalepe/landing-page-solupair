import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { bookings } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/appointments")({
  head: () => ({
    meta: [
      { title: "Bookings — Solupair" },
      { name: "description", content: "Every chair, every booking, live." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Bookings"
        title="Bookings"
        subtitle="Every chair, every booking, live."
        sections={["Summary", "Search & filters", "Today", "Upcoming", "Past"]}
        right={
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live sync
          </div>
        }
      />

      <div className="space-y-6 px-6 py-8 lg:px-10">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" placeholder="Search bookings — name, phone, service…" />
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Pending pay", "Paid", "Confirmed", "Cancelled"].map((f, i) => (
              <button
                key={f}
                className={
                  i === 0
                    ? "rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-medium text-white shadow-glow"
                    : "rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs text-muted-foreground transition hover:text-foreground hover:border-primary/40"
                }
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-card p-6 shadow-elegant">
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-brand" />
          <div className="pl-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-2xl font-semibold text-foreground">Today</h2>
              <span className="rounded-full bg-gradient-brand-soft border border-primary/30 px-2 py-0.5 text-xs text-primary">{bookings.length}</span>
              <span className="text-xs text-muted-foreground">Wednesday, 24 June</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {bookings.map((b) => (
                <div key={b.id} className="group rounded-xl border border-border bg-background/40 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
                  <div className="font-mono text-xs text-muted-foreground">{b.time}</div>
                  <div className="mt-1 text-base font-semibold text-foreground">{b.service}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.note}</div>
                  <div className="mt-1 text-sm text-foreground/80">{b.client}</div>
                  <div className="mt-3">
                    <span className={
                      b.status === "confirmed paid"
                        ? "inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[11px] text-cyan-500"
                        : "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-500"
                    }>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}