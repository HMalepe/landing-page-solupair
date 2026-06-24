import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AICoachCard } from "@/components/dashboard/AICoachCard";
import { metrics, bookings } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/")({
  head: () => ({
    meta: [
      { title: "Today at a glance — Solupair" },
      { name: "description", content: "Bookings, revenue, and bot activity at a glance." },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div>
      <PageHeader
        eyebrow="Today at a glance"
        title="Today at a glance"
        subtitle={`${today} — bookings, revenue, and bot activity in one place.`}
        sections={["Snapshot", "Trends", "AI coach", "Today's schedule"]}
        right={
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:shadow-glow"
          >
            <Calendar className="h-4 w-4 text-primary" />
            View all bookings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="space-y-8 px-6 py-8 lg:px-10">
        <section id="snapshot" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((m) => {
            const { key, ...rest } = m;
            return <MetricTile key={key} {...rest} />;
          })}
        </section>

        <section id="trends">
          <RevenueChart />
        </section>

        <section id="ai-coach">
          <AICoachCard />
        </section>

        <section id="todays-schedule" className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Today's schedule</div>
              <div className="text-xs text-muted-foreground">{bookings.length} bookings on the calendar</div>
            </div>
            <Link to="/appointments" className="text-xs text-primary hover:underline">Open bookings →</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-background/40 p-4 transition hover:border-primary/40">
                <div className="font-mono text-xs text-muted-foreground">{b.time}</div>
                <div className="mt-1 text-sm font-medium text-foreground">{b.service}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.client}</span>
                  <span className={
                    b.status === "confirmed paid"
                      ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-500"
                      : "rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-500"
                  }>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}