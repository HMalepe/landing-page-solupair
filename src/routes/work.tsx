import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () => ({
    meta: [
      { title: "Work — Solupair Studio" },
      { name: "description", content: "Selected case studies in product UI, brand, landing pages and internal tools." },
      { property: "og:title", content: "Work — Solupair Studio" },
      { property: "og:description", content: "Selected work from the studio. Cobra Labs, Helix.ai, Atlas Capital and more." },
    ],
  }),
});

const CASES = [
  { n: "01", client: "Cobra Labs", scope: "Product UI · Design System", year: "2025", tag: "B2B SaaS", grad: "linear-gradient(135deg, oklch(0.78 0.16 200), oklch(0.35 0.14 220))", size: "lg" },
  { n: "02", client: "Helix.ai", scope: "Brand + Landing + Docs", year: "2025", tag: "AI Platform", grad: "linear-gradient(135deg, oklch(0.66 0.27 5), oklch(0.32 0.18 350))", size: "md" },
  { n: "03", client: "Atlas Capital", scope: "Trading Console", year: "2024", tag: "Fintech", grad: "linear-gradient(135deg, oklch(0.92 0.22 125), oklch(0.36 0.14 145))", size: "md" },
  { n: "04", client: "Northwind Mail", scope: "Marketing UI redesign", year: "2024", tag: "Communications", grad: "linear-gradient(135deg, oklch(0.78 0.16 200), oklch(0.66 0.27 5))", size: "lg" },
  { n: "05", client: "Verge Studio", scope: "Brand + Identity", year: "2024", tag: "Creative", grad: "linear-gradient(135deg, oklch(0.85 0.17 195), oklch(0.4 0.1 260))", size: "sm" },
  { n: "06", client: "Pinecone HR", scope: "Internal admin tools", year: "2023", tag: "HR Tech", grad: "linear-gradient(135deg, oklch(0.66 0.27 5), oklch(0.92 0.22 125))", size: "sm" },
];

function WorkPage() {
  return (
    <div className="relative pt-32 pb-32">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-grid opacity-[0.25]" />
      <div className="aurora-blob top-32 -left-10 h-[400px] w-[400px] bg-plasma/20" />

      <header className="relative mx-auto max-w-[1320px] px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ work / archive ]</p>
        <h1 className="mt-4 headline-mega text-[clamp(3rem,9vw,8rem)]">
          Selected<br />
          <span className="font-serif italic gradient-aurora-text">receipts.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          A small sample of shipped work. Full case studies — including private NDA work — available on request.
        </p>
      </header>

      <div className="relative mx-auto mt-20 grid max-w-[1320px] grid-cols-1 gap-5 px-6 md:grid-cols-6">
        {CASES.map((c, i) => {
          const span = c.size === "lg" ? "md:col-span-4" : c.size === "md" ? "md:col-span-3" : "md:col-span-2";
          const ratio = c.size === "lg" ? "aspect-[16/10]" : c.size === "md" ? "aspect-[4/3]" : "aspect-square";
          return (
            <Reveal key={c.n} delay={i * 60} className={span}>
              <Link to="/work" className="group block lift overflow-hidden rounded-2xl border border-border bg-surface/40">
                <div className={`relative ${ratio} w-full overflow-hidden`} style={{ background: c.grad }}>
                  <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-background/80">case · {c.n}</span>
                  <span className="absolute top-4 right-4 rounded-full bg-background/30 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-background backdrop-blur">{c.tag}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border bg-surface/60 px-5 py-4">
                  <div>
                    <h2 className="font-display text-xl tracking-tight group-hover:gradient-aurora-text md:text-2xl">{c.client}</h2>
                    <p className="text-xs text-muted-foreground">{c.scope}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{c.year}</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="relative mx-auto mt-24 max-w-[1320px] px-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-10 text-center md:p-16">
          <h3 className="font-display text-4xl tracking-tight md:text-6xl">
            Want the <span className="font-serif italic">NDA work?</span>
          </h3>
          <p className="mt-4 text-muted-foreground">We share private case studies on call. Most of what we ship never makes the archive.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full border border-cyan px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-cyan btn-fill">
            Request portfolio →
          </Link>
        </div>
      </div>
    </div>
  );
}
