import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AICoachCard } from "@/components/dashboard/AICoachCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
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
  const calmTiles = metrics.filter((m) => !m.accent);
  const actionTiles = metrics.filter((m) => m.accent);
  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Today at a glance"
        subtitle={`${today} — bookings, revenue, and bot activity in one place.`}
        sections={["Needs you", "Snapshot", "Trends", "AI coach", "Schedule"]}
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
        {actionTiles.length > 0 && (
          <section id="needs-you">
            <SectionHeader
              eyebrow="Needs you"
              title="Action required"
              hint={`${actionTiles.length} items waiting`}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {actionTiles.map((m) => {
                const { key, ...rest } = m;
                return <MetricTile key={key} {...rest} />;
              })}
            </div>
          </section>
        )}

        <section id="snapshot">
          <SectionHeader eyebrow="Snapshot" title="Today's numbers" hint="Updated live" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {calmTiles.map((m) => {
              const { key, ...rest } = m;
              return <MetricTile key={key} {...rest} />;
            })}
          </div>
        </section>

        <section id="trends">
          <SectionHeader eyebrow="Trends" title="Revenue — last 7 days" hint="Daily totals · ZAR" />
          <RevenueChart />
        </section>

        <section id="ai-coach">
          <SectionHeader eyebrow="AI coach" title="Proactive nudges" />
          <AICoachCard />
        </section>

        <section id="schedule">
          <SectionHeader
            eyebrow="Schedule"
            title="Today's bookings"
            hint={`${bookings.length} on the calendar`}
            right={
              <Link to="/appointments" className="text-xs font-medium text-primary hover:underline">
                Open bookings →
              </Link>
            }
          />
          <div className="grid gap-3 md:grid-cols-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-elegant transition hover:-translate-y-0.5 hover:border-primary/40">
                <div className="font-mono text-xs text-muted-foreground">{b.time}</div>
                <div className="mt-1.5 text-sm font-semibold text-foreground">{b.service}</div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.client}</span>
                  <span className={
                    b.status === "confirmed paid"
                      ? "rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400"
                      : "rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400"
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