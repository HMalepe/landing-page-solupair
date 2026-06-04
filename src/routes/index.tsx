import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { LEGAL_NAME, SITE_NAME, SITE_TAGLINE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    pageHead({
      title: `${LEGAL_NAME} — ${SITE_TAGLINE}`,
      description: `${LEGAL_NAME} — Product UI/UX, brand systems, and software surfaces for B2B teams.`,
      path: "/",
    }),
});

const CAPABILITIES = [
  { title: "Product UI / UX", desc: "Dashboards, workflows, design systems." },
  { title: "Brand & marketing", desc: "Identity, landing pages, launch surfaces." },
  { title: "Design-engineering", desc: "Production React — we ship the code." },
  { title: "Internal tools", desc: "Ops consoles your team actually uses." },
];

const PHASES = ["Signal", "Shape", "System", "Ship"];

function HomePage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-grid opacity-[0.3]" />
      <div className="aurora-blob top-0 -left-32 h-[360px] w-[360px] bg-cyan/20" />
      <div className="aurora-blob top-40 right-0 h-[400px] w-[400px] bg-plasma/15" />

      {/* Hero */}
      <section className="relative mx-auto max-w-[900px] px-6 pt-32 pb-16 md:pt-40 md:pb-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">{LEGAL_NAME}</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight">
          {SITE_NAME} builds{" "}
          <span className="font-serif italic gradient-aurora-text">software surfaces</span>{" "}
          that ship.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          {SITE_TAGLINE} Product UI, brand, and code for SA startups — JHB, CPT, and remote. Clear scopes in rands, no agency bloat.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan"
          >
            Start a project →
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-cyan hover:text-cyan"
          >
            What we do
          </Link>
        </div>
      </section>

      {/* Capabilities — compact grid */}
      <section className="relative border-t border-border bg-surface/20 py-16 md:py-20">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal>
            <h2 className="text-center font-display text-2xl tracking-tight md:text-3xl">
              What we deliver
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">
              Four lanes. Same team from kickoff to production.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 40}>
                <div className="rounded-xl border border-border bg-background/50 p-5 transition-colors hover:border-cyan/50">
                  <h3 className="font-display text-lg tracking-tight">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link to="/services" className="font-mono text-[11px] uppercase tracking-widest text-cyan hover:underline">
              Full services →
            </Link>
          </p>
        </div>
      </section>

      {/* Process — one line */}
      <section className="relative py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">How we work</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {PHASES.map((p, i) => (
              <span key={p} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest">
                <span className="text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-foreground">{p}</span>
                {i < PHASES.length - 1 && <span className="hidden text-text-tertiary sm:inline">→</span>}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Most projects · 3–8 weeks · budgets from R35k</p>
          <Link to="/process" className="mt-3 inline-block font-mono text-[11px] uppercase tracking-widest text-cyan hover:underline">
            See the process →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-[700px] px-6 text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Ready to ship something?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us what you're building. {LEGAL_NAME} responds within 24 hours.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-full bg-cyan px-8 py-3 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan"
          >
            Get in touch →
          </Link>
        </div>
      </section>
    </div>
  );
}
