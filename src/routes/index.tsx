import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/brand/Reveal";
import { SITE_HOST, pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    pageHead({
      title: "Solupair — Design studio for software that ships.",
      description:
        "Futures-first B2B design studio. Product UI/UX, brand systems, landing pages, e-commerce and internal tools.",
      path: "/",
    }),
});

/* ───────────────────────────────────── HERO ─────────────────────────────────── */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      {/* Background field */}
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="aurora-blob top-10 -left-20 h-[420px] w-[420px] bg-cyan/25" />
      <div className="aurora-blob top-32 right-0 h-[500px] w-[500px] bg-plasma/25" style={{ animationDelay: "-6s" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {/* Tag rail */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-lime pulse-dot" /> Live · 3 projects in flight
            </span>
            <span className="rounded-full border border-border bg-surface/60 px-3 py-1 backdrop-blur">v.2026.4</span>
            <span className="hidden md:inline rounded-full border border-border bg-surface/60 px-3 py-1 backdrop-blur">SF · LIS · Remote</span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 headline-mega text-[clamp(3.2rem,9vw,8rem)]">
            <span className="block">
              <span className="word-reveal"><span style={{ animationDelay: "0ms" }}>We</span></span>{" "}
              <span className="word-reveal"><span style={{ animationDelay: "80ms" }}>design</span></span>{" "}
              <span className="word-reveal"><span style={{ animationDelay: "160ms" }}>the</span></span>
            </span>
            <span className="block">
              <span className="word-reveal"><span style={{ animationDelay: "240ms" }} className="font-serif italic">interface</span></span>
            </span>
            <span className="block">
              <span className="word-reveal"><span style={{ animationDelay: "320ms" }}>between</span></span>{" "}
              <span className="word-reveal"><span style={{ animationDelay: "400ms" }} className="gradient-aurora-text">software</span></span>
            </span>
            <span className="block">
              <span className="word-reveal"><span style={{ animationDelay: "480ms" }}>and</span></span>{" "}
              <span className="word-reveal"><span style={{ animationDelay: "560ms" }}>the</span></span>{" "}
              <span className="word-reveal"><span style={{ animationDelay: "640ms" }} className="gradient-plasma-text">future.</span></span>
            </span>
          </h1>

          <Reveal delay={700}>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Solupair is a small, surgical design studio. We ship product UI, brand systems, landing pages,
              e-commerce and internal tools for software companies that refuse to look like the rest.
            </p>
          </Reveal>

          <Reveal delay={850}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-3 rounded-full bg-cyan px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan transition-transform hover:scale-[1.02]"
              >
                Start a project
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background/20">→</span>
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-3 rounded-full border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-foreground transition-colors hover:border-cyan hover:text-cyan"
              >
                See the work
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Studio terminal */}
        <div className="lg:col-span-5 lg:pl-6">
          <Reveal delay={400}>
            <StudioTerminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StudioTerminal() {
  const lines = [
    { t: "boot", v: `${SITE_HOST} · v.2026.4`, c: "text-cyan" },
    { t: "auth", v: "ok · session @ ops.deck", c: "text-lime" },
    { t: "scan", v: "queue · 3 projects in flight", c: "" },
    { t: "spec", v: "design system · 184 components", c: "" },
    { t: "perf", v: "lighthouse · 98 · 100 · 100", c: "text-cyan" },
    { t: "ship", v: "next release · 14d · 3h", c: "text-plasma" },
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= lines.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 380);
    return () => clearTimeout(t);
  }, [step, lines.length]);

  return (
    <div className="relative rounded-2xl border border-border bg-surface/70 p-5 shadow-glow-cyan backdrop-blur-xl">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan/5 via-transparent to-plasma/10 pointer-events-none" />
      {/* header */}
      <div className="relative flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-plasma/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">~/studio · ops.deck</span>
        <span className="font-mono text-[10px] text-cyan">●REC</span>
      </div>
      {/* lines */}
      <div className="relative mt-3 space-y-1.5 font-mono text-[12px]">
        {lines.slice(0, step + 1).map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-10 text-text-tertiary">{String(i + 1).padStart(2, "0")}</span>
            <span className="w-12 text-text-tertiary">{l.t}</span>
            <span className={l.c || "text-foreground"}>{l.v}</span>
          </div>
        ))}
        {step < lines.length && (
          <div className="flex gap-3">
            <span className="w-10 text-text-tertiary">{String(step + 2).padStart(2, "0")}</span>
            <span className="text-cyan ticker">▍</span>
          </div>
        )}
      </div>
      {/* gauge row */}
      <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Gauge label="velocity" value={94} accent="cyan" />
        <Gauge label="craft" value={99} accent="plasma" />
        <Gauge label="signal" value={87} accent="lime" />
      </div>
    </div>
  );
}

function Gauge({ label, value, accent }: { label: string; value: number; accent: "cyan" | "plasma" | "lime" }) {
  const color = accent === "cyan" ? "var(--color-cyan)" : accent === "plasma" ? "var(--color-plasma)" : "var(--color-lime)";
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-2xl tracking-tight" style={{ color }}>{value}</span>
        <span className="font-mono text-[10px] text-text-tertiary">/100</span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-border overflow-hidden">
        <div className="h-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────── MARQUEE ─────────────────────────────────── */
function ClientStrip() {
  const items = [
    "Acquired by Stripe", "Series B · $42M", "Y Combinator W25", "Featured in Sifted",
    "Awwwards SOTD", "Webby Winner", "TechCrunch Disrupt", "Product Hunt #1",
  ];
  const doubled = [...items, ...items];
  return (
    <section className="relative border-y border-border bg-surface/30 py-6 overflow-hidden marquee">
      <div className="marquee-track gap-12 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {doubled.map((x, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap">
            <span>{x}</span>
            <span className="text-cyan">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────── SERVICES ────────────────────────────────── */
function ServicesBento() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1320px] px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ 01 / services ]</p>
              <h2 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">
                Five surfaces.<br />
                <span className="font-serif italic gradient-aurora-text">One studio.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Every engagement is run by the same senior team end-to-end. No handoffs, no juniors, no decks for the sake of decks.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2 md:[grid-auto-rows:minmax(220px,_auto)]">
          <ServiceCard className="md:col-span-3 md:row-span-2" idx="01" title="Product UI / UX" accent="cyan" tall>
            <p>The flagship. Multi-quarter design system, component libraries, design-engineering pairing. We sit inside your team.</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              <li>· dashboards</li><li>· workflows</li>
              <li>· design systems</li><li>· design-eng</li>
              <li>· research</li><li>· prototyping</li>
            </ul>
          </ServiceCard>
          <ServiceCard className="md:col-span-3" idx="02" title="Landing pages that convert" accent="plasma">
            <p>Editorial-grade marketing pages built to ship in 14 days. Motion, copy, art-direction, A/B-ready.</p>
          </ServiceCard>
          <ServiceCard className="md:col-span-2" idx="03" title="Brand systems" accent="lime">
            <p>Identity that scales from pitch deck to product chrome.</p>
          </ServiceCard>
          <ServiceCard className="md:col-span-1" idx="04" title="E-commerce" accent="cyan">
            <p>Shopify / headless storefronts that look like editorial, sell like DTC.</p>
          </ServiceCard>
        </div>

        <Reveal>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <ServiceCard idx="05" title="Internal tools" accent="plasma">
              <p>Admin panels, dashboards, ops consoles your team actually wants to use.</p>
            </ServiceCard>
            <ServiceCard idx="06" title="Design-engineering" accent="lime">
              <p>Production React + Tailwind / Framer Motion. We ship the code too.</p>
            </ServiceCard>
            <ServiceCard idx="07" title="AI surface design" accent="cyan">
              <p>Chat, agents, command-bars. Designing the surface where models meet humans.</p>
            </ServiceCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({
  children, idx, title, accent, className = "", tall = false,
}: {
  children: React.ReactNode; idx: string; title: string; accent: "cyan" | "plasma" | "lime"; className?: string; tall?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dot = accent === "cyan" ? "bg-cyan" : accent === "plasma" ? "bg-plasma" : "bg-lime";

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`spotlight lift group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className={`h-2 w-2 rounded-full ${dot} shadow-[0_0_18px_currentColor]`} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{idx}</span>
      </div>
      <div className={tall ? "mt-auto" : "mt-10"}>
        <h3 className="font-display text-2xl tracking-tight md:text-3xl">{title}</h3>
        <div className="mt-3 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────── WORK ──────────────────────────────────── */
function WorkPreview() {
  const items = [
    { num: "01", client: "Cobra Labs", scope: "Product UI + design system", color: "cyan", year: "2025", img: "linear-gradient(135deg, oklch(0.78 0.16 200), oklch(0.4 0.12 200))" },
    { num: "02", client: "Helix.ai", scope: "Brand + landing + docs", color: "plasma", year: "2025", img: "linear-gradient(135deg, oklch(0.66 0.27 5), oklch(0.35 0.18 5))" },
    { num: "03", client: "Atlas Capital", scope: "Internal trading console", color: "lime", year: "2024", img: "linear-gradient(135deg, oklch(0.92 0.22 125), oklch(0.4 0.15 125))" },
  ];
  return (
    <section className="relative border-t border-border bg-background py-28 md:py-36">
      <div className="mx-auto max-w-[1320px] px-6">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ 02 / selected work ]</p>
              <h2 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">
                Receipts<span className="font-serif italic">.</span>
              </h2>
            </div>
            <Link to="/work" className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-cyan">
              All work →
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 space-y-8">
          {items.map((it, i) => (
            <Reveal key={it.num} delay={i * 80}>
              <Link
                to="/work"
                className={`group relative flex flex-col gap-6 rounded-2xl border border-border bg-surface/40 p-6 md:flex-row md:items-center md:p-8 lift ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-xl md:w-[58%]"
                  style={{ background: it.img }}
                >
                  <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-background/80">
                    <span>{it.client.toLowerCase()}.app</span>
                    <span>● live</span>
                  </div>
                </div>
                <div className="md:flex-1">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                    <span>case · {it.num}</span>
                    <span className="h-px flex-1 bg-border" />
                    <span>{it.year}</span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl tracking-tight md:text-5xl group-hover:gradient-aurora-text">
                    {it.client}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{it.scope}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan">
                    Open case study →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────── PROCESS ─────────────────────────────────── */
function ProcessOrbit() {
  const phases = [
    { n: "01", t: "Signal", d: "Discovery, audit, alignment. 1 week." },
    { n: "02", t: "Shape", d: "Concept, art direction, structure. 2 weeks." },
    { n: "03", t: "System", d: "Tokens, components, motion. 3 weeks." },
    { n: "04", t: "Ship", d: "Pixel handoff or production code." },
  ];
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface/30 py-28 md:py-36">
      <div className="absolute inset-0 bg-dot opacity-30" />
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ 03 / process ]</p>
          <h2 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">
            A studio,<br />
            <span className="font-serif italic">not an agency.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Four phases. No middlemen. Senior craft from kickoff to ship — most engagements run 4 to 8 weeks.
          </p>

          <div className="mt-10 space-y-4">
            {phases.map((p) => (
              <div key={p.n} className="group flex items-start gap-4 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-cyan">
                <span className="font-mono text-[11px] text-text-tertiary group-hover:text-cyan">{p.n}</span>
                <div>
                  <h3 className="font-display text-xl tracking-tight">{p.t}</h3>
                  <p className="text-sm text-muted-foreground">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orbit diagram */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ring1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--color-cyan)" stopOpacity="0.9" />
                <stop offset="1" stopColor="var(--color-plasma)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <g className="orbit-rotate" style={{ transformOrigin: "200px 200px" }}>
              <circle cx="200" cy="200" r="180" fill="none" stroke="url(#ring1)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="200" cy="20" r="5" fill="var(--color-cyan)" />
              <circle cx="380" cy="200" r="3" fill="var(--color-plasma)" />
            </g>
            <g className="orbit-rotate-reverse" style={{ transformOrigin: "200px 200px" }}>
              <circle cx="200" cy="200" r="130" fill="none" stroke="var(--color-border)" strokeWidth="1" />
              <circle cx="330" cy="200" r="4" fill="var(--color-lime)" />
            </g>
            <circle cx="200" cy="200" r="80" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
            {/* core */}
            <circle cx="200" cy="200" r="44" fill="var(--color-background)" stroke="var(--color-cyan)" strokeWidth="1" />
            <text x="200" y="196" textAnchor="middle" fontFamily="Space Grotesk" fontSize="14" fill="var(--color-foreground)" letterSpacing="-0.04em">solupair</text>
            <text x="200" y="214" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="var(--color-cyan)" letterSpacing="0.2em">/ STUDIO</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────── STATS ─────────────────────────────────── */
function Stats() {
  const stats = [
    { k: "184", l: "Components shipped", s: "across active design systems" },
    { k: "12yr", l: "Combined craft", s: "in product + brand design" },
    { k: "98", l: "Avg Lighthouse", s: "on shipped landing pages" },
    { k: "4–8w", l: "Engagement length", s: "for most ship cycles" },
  ];
  return (
    <section className="relative border-t border-border py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-12 px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 70}>
            <div className="flex flex-col gap-1 border-l border-border pl-6">
              <span className="font-display text-5xl tracking-tight gradient-aurora-text">{s.k}</span>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-foreground">{s.l}</span>
              <span className="text-xs text-text-tertiary">{s.s}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────────── CTA ─────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-32 md:py-44">
      <div className="aurora-blob -top-20 left-1/4 h-[500px] w-[500px] bg-cyan/25" />
      <div className="aurora-blob bottom-0 right-1/4 h-[500px] w-[500px] bg-plasma/25" style={{ animationDelay: "-4s" }} />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-[1320px] px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ 04 / let's build ]</p>
        <h2 className="mx-auto mt-4 max-w-4xl headline-mega text-[clamp(2.8rem,8vw,7rem)]">
          Your next surface,<br />
          <span className="gradient-aurora-text">designed in public.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          We're booking Q3. Tell us what you're shipping — we'll come back in 24h with whether we're the right studio for it.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="rounded-full bg-cyan px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan transition-transform hover:scale-[1.02]"
          >
            Start the conversation →
          </Link>
          <Link
            to="/work"
            className="rounded-full border border-border px-8 py-4 font-mono text-[11px] uppercase tracking-widest hover:border-cyan hover:text-cyan"
          >
            Browse the work
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <ServicesBento />
      <WorkPreview />
      <ProcessOrbit />
      <Stats />
      <FinalCTA />
    </>
  );
}
