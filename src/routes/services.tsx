import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () =>
    pageHead({
      title: "Services — Solupair Studio",
      description:
        "Product UI/UX, brand systems, landing pages, e-commerce, internal tools, design-engineering, and AI surface design.",
      path: "/services",
    }),
});

const SERVICES = [
  { idx: "01", name: "Product UI / UX", lede: "Multi-quarter product design with embedded design-engineering. The flagship offer.",
    deliverables: ["Design system + component lib", "Research & flow architecture", "Prototype + production handoff", "Weekly design-eng pairing"], time: "8–24 weeks", accent: "cyan" },
  { idx: "02", name: "Landing pages", lede: "Editorial marketing surfaces that ship in 14 days. Motion, copy, art direction included.",
    deliverables: ["Concept + art direction", "Copy collaboration", "Production code in React + Tailwind", "A/B-ready variants"], time: "2 weeks", accent: "plasma" },
  { idx: "03", name: "Brand systems", lede: "Identity that scales from pitch deck to product chrome to billboard.",
    deliverables: ["Logo + wordmark system", "Type + color tokens", "Voice + tone", "Brand book + asset library"], time: "4–6 weeks", accent: "lime" },
  { idx: "04", name: "E-commerce", lede: "Shopify and headless storefronts that look like editorial, convert like DTC.",
    deliverables: ["Theme architecture", "PDP / cart / checkout polish", "Performance budget", "Lifecycle email design"], time: "4–8 weeks", accent: "cyan" },
  { idx: "05", name: "Internal tools", lede: "Admin panels, ops dashboards, internal consoles your team actually wants to open.",
    deliverables: ["UX audit + IA", "Component library", "Live data wiring", "Empty + edge states"], time: "4–10 weeks", accent: "plasma" },
  { idx: "06", name: "Design-engineering", lede: "We ship the code. React, Tailwind, Framer Motion, TanStack, three.js when it counts.",
    deliverables: ["Production components", "Animation systems", "Perf budgets + accessibility", "Storybook + docs"], time: "Continuous", accent: "lime" },
  { idx: "07", name: "AI surface design", lede: "Chat, agents, command bars, copilots. The new surface where models meet humans.",
    deliverables: ["Conversation IA", "Streaming UI patterns", "Tool-use affordances", "Trust + guardrail design"], time: "3–8 weeks", accent: "cyan" },
];

function ServicesPage() {
  return (
    <div className="relative pt-32 pb-32">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-grid opacity-[0.25]" />
      <div className="aurora-blob top-20 -left-20 h-[400px] w-[400px] bg-cyan/20" />
      <div className="aurora-blob top-40 right-0 h-[460px] w-[460px] bg-plasma/20" />

      <header className="relative mx-auto max-w-[1320px] px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ services / index ]</p>
        <h1 className="mt-4 headline-mega text-[clamp(3rem,9vw,8rem)]">
          Seven things<br />
          <span className="font-serif italic gradient-aurora-text">we do well.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          One senior team. No handoffs. Most engagements run 4 to 8 weeks. Every brief gets a written response in 24 hours.
        </p>
      </header>

      <div className="relative mx-auto mt-20 max-w-[1320px] px-6 space-y-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.idx} delay={i * 40}>
            <article className="group grid grid-cols-1 gap-6 rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-cyan md:grid-cols-12 md:p-8">
              <div className="md:col-span-1 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{s.idx}</span>
                <span className={`h-2 w-2 rounded-full shadow-[0_0_18px_currentColor] ${
                  s.accent === "cyan" ? "bg-cyan text-cyan" : s.accent === "plasma" ? "bg-plasma text-plasma" : "bg-lime text-lime"
                }`} />
              </div>
              <div className="md:col-span-5">
                <h2 className="font-display text-3xl tracking-tight md:text-5xl group-hover:gradient-aurora-text">{s.name}</h2>
                <p className="mt-3 text-muted-foreground">{s.lede}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">~ {s.time}</p>
              </div>
              <ul className="md:col-span-6 grid grid-cols-1 gap-2 self-center md:grid-cols-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-cyan" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="relative mx-auto mt-24 max-w-[1320px] px-6 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-3 rounded-full bg-cyan px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan"
        >
          Brief us → 24h response
        </Link>
      </div>
    </div>
  );
}
