import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenueWeek } from "@/lib/mock-data";

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
      <div className="mb-2 flex items-center justify-end">
        <div className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          Avg R 94
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueWeek} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.95} />
                <stop offset="60%" stopColor="#A855F7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.12)" vertical={false} />
            <XAxis dataKey="day" stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} />
            <YAxis stroke="currentColor" className="text-muted-foreground text-xs" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "oklch(0.66 0.24 300 / 0.08)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(v) => [`R ${v as number}`, "Revenue"]}
            />
            <Bar dataKey="value" fill="url(#bar-grad)" radius={[8, 8, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}