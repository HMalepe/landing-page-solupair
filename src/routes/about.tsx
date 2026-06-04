import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { LEGAL_NAME, SITE_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () =>
    pageHead({
      title: `About — ${LEGAL_NAME}`,
      description: `${LEGAL_NAME} is a South African B2B company. Six people, twelve combined years of senior craft — design that ships beats design that wins awards.`,
      path: "/about",
    }),
});

const PRINCIPLES = [
  { n: "I.", t: "Ship over polish.", d: "Done in production beats perfect in Figma. We design with the deploy in mind." },
  { n: "II.", t: "Senior only.", d: "No juniors, no offshore, no account managers. The hands on your project are the hands you hired." },
  { n: "III.", t: "Opinions are deliverables.", d: "If we don't have a view, we haven't done the work yet." },
  { n: "IV.", t: "Design is downstream of decisions.", d: "Most design problems are product decisions in disguise. We help you make them." },
  { n: "V.", t: "Code is craft.", d: "We ship production React, Tailwind, Motion. The handoff is a commit, not a Figma link." },
  { n: "VI.", t: "Quiet over loud.", d: "We don't post our process on Twitter. The work is the proof." },
];

const TEAM = [
  { name: "Naledi Khumalo", role: "Founder · Design Director", bio: "Product design for SA fintech and SaaS startups. Based in Johannesburg.", grad: "linear-gradient(135deg, oklch(0.78 0.16 200), oklch(0.66 0.27 5))" },
  { name: "Sipho Ndlovu", role: "Design Engineer", bio: "Ships production React for local teams — remote-first across ZA.", grad: "linear-gradient(135deg, oklch(0.92 0.22 125), oklch(0.78 0.16 200))" },
  { name: "Amira Patel", role: "Brand Director", bio: "Brand systems for software companies from Cape Town to the continent.", grad: "linear-gradient(135deg, oklch(0.66 0.27 5), oklch(0.85 0.17 195))" },
];

function AboutPage() {
  return (
    <div className="relative pt-32 pb-32">
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-grid opacity-[0.25]" />
      <div className="aurora-blob top-32 -left-10 h-[420px] w-[420px] bg-plasma/20" />
      <div className="aurora-blob top-80 right-0 h-[500px] w-[500px] bg-cyan/20" />

      <header className="relative mx-auto max-w-[1320px] px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ about / {SITE_NAME.toLowerCase()} ]</p>
        <h1 className="mt-4 headline-mega text-[clamp(3rem,9vw,8rem)]">
          {LEGAL_NAME}
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-cyan">{SITE_NAME}</p>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
          <strong className="text-foreground">{LEGAL_NAME}</strong> is a South African B2B company building product UI, brand systems, and software surfaces for startups and scale-ups. Registered in SA, pricing in rands, POPIA-aware workflows. One shared belief: design that ships beats design that wins awards.
        </p>
      </header>

      {/* Manifesto */}
      <section className="relative mx-auto mt-24 max-w-[1320px] px-6">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ principles ]</p>
          <h2 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">Six rules we work by.</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 50}>
              <div className="group flex gap-5 rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-cyan">
                <span className="font-serif text-3xl italic text-cyan/60">{p.n}</span>
                <div>
                  <h3 className="font-display text-2xl tracking-tight">{p.t}</h3>
                  <p className="mt-2 text-muted-foreground">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="relative mx-auto mt-32 max-w-[1320px] px-6">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">[ the team ]</p>
          <h2 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
            Who you'll actually <span className="font-serif italic">be working with.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TEAM.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className="group rounded-2xl border border-border bg-surface/40 overflow-hidden lift">
                <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ background: p.grad }}>
                  <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-background/80">
                    <span>operator · {String(i + 1).padStart(2, "0")}</span>
                    <span>● online</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl tracking-tight">{p.name}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">{p.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-32 max-w-[1320px] px-6 text-center">
        <h3 className="font-display text-4xl tracking-tight md:text-6xl">
          Reasons to <span className="font-serif italic gradient-aurora-text">talk.</span>
        </h3>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-cyan px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-background shadow-glow-cyan">
          Start the conversation →
        </Link>
      </section>
    </div>
  );
}
