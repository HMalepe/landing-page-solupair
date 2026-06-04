import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () =>
    pageHead({
      title: "Process — Solupair Studio",
      description: "How we work: Signal, Shape, System, Ship. Four phases, one senior team, 4-to-8 week cycles.",
      path: "/process",
    }),
});

const PHASES = [
  { n: "01", k: "SIGNAL", t: "Discover what's actually true.", d: "We audit your product, talk to your team, watch your users. We leave with the brief you wish you'd written.", days: "Week 1", artifacts: ["Audit deck", "Stakeholder synthesis", "Refined brief", "Success criteria"], color: "cyan" },
  { n: "02", k: "SHAPE", t: "Pick a direction with conviction.", d: "Three concept routes. Real artifacts, not moodboards. We kill two and double down on one — together.", days: "Weeks 2–3", artifacts: ["Three concept directions", "Art direction", "Information architecture", "Motion principles"], color: "plasma" },
  { n: "03", k: "SYSTEM", t: "Build the machine that ships pixels.", d: "Tokens, components, motion specs, copy patterns. Every screen comes out of the same engine.", days: "Weeks 4–6", artifacts: ["Design system + tokens", "Component library", "Motion + interaction specs", "Production-ready prototypes"], color: "lime" },
  { n: "04", k: "SHIP", t: "Hand off — or write the code ourselves.", d: "Pixel-perfect handoff to your team, or production React + Tailwind + Motion built by us. Your call.", days: "Weeks 6–8", artifacts: ["Production handoff or build", "Storybook + docs", "QA + accessibility pass", "Post-ship retro"], color: "cyan" },
];

function ProcessPage() {
  return (
    <div className="relative pt-32 pb-32">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-grid opacity-[0.25]" />
      <div className="aurora-blob top-32 -left-10 h-[400px] w-[400px] bg-cyan/20" />
      <div className="aurora-blob top-80 right-0 h-[500px] w-[500px] bg-plasma/20" />

      <header className="relative mx-auto max-w-[1320px] px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ process / how we work ]</p>
        <h1 className="mt-4 headline-mega text-[clamp(3rem,9vw,8rem)]">
          Four phases.<br />
          <span className="font-serif italic gradient-aurora-text">Zero handoffs.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          Same senior team from first call to last commit. Most engagements run 4 to 8 weeks. No account managers, no junior designers, no surprise invoices.
        </p>
      </header>

      <div className="relative mx-auto mt-24 max-w-[1320px] px-6">
        <div className="relative">
          {/* connecting rail */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-cyan via-plasma to-lime opacity-50 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-20">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className={`relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  {/* node */}
                  <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                    <span className={`relative flex h-4 w-4 items-center justify-center rounded-full ${p.color === "cyan" ? "bg-cyan" : p.color === "plasma" ? "bg-plasma" : "bg-lime"} shadow-[0_0_24px_currentColor]`}>
                      <span className="absolute inset-0 rounded-full bg-background/30" />
                    </span>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">phase {p.n} · {p.days}</p>
                    <h2 className="mt-2 font-display text-5xl tracking-tight md:text-7xl">
                      <span className={p.color === "cyan" ? "text-cyan" : p.color === "plasma" ? "text-plasma" : "text-lime"}>{p.k}</span>
                    </h2>
                    <p className="mt-4 font-display text-2xl tracking-tight text-foreground/90 md:text-3xl">{p.t}</p>
                    <p className="mt-4 max-w-md text-muted-foreground">{p.d}</p>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <div className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">artifacts</p>
                      <ul className="mt-4 space-y-3">
                        {p.artifacts.map((a) => (
                          <li key={a} className="flex items-start gap-3 text-sm">
                            <span className="mt-2 h-1 w-1 rounded-full bg-cyan" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-32 max-w-[1320px] px-6 text-center">
        <h3 className="font-display text-4xl tracking-tight md:text-6xl">
          Ready when <span className="font-serif italic">you are.</span>
        </h3>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-cyan px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan">
          Start phase 01 →
        </Link>
      </div>
    </div>
  );
}
