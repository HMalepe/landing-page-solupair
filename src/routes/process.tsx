import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES } from "@/lib/images";
import { LEGAL_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () =>
    pageHead({
      title: `Process — ${LEGAL_NAME}`,
      description: "How we work: Listen, Sketch, Grow, Ship. Four phases, one senior team, 3-to-8 week cycles.",
      path: "/process",
    }),
});

const PHASES = [
  { n: "01", k: "Listen", t: "Understand the soil.", d: "We audit your product, talk to your team, watch your users. We leave with the brief you wish you'd written.", days: "Week 1", artifacts: ["Audit deck", "Stakeholder synthesis", "Refined brief", "Success criteria"], color: "sage" },
  { n: "02", k: "Sketch", t: "Map the terrain.", d: "Three concept routes. Real artifacts, not moodboards. We kill two and double down on one — together.", days: "Weeks 2–3", artifacts: ["Three concept directions", "Art direction", "Information architecture", "Motion principles"], color: "clay" },
  { n: "03", k: "Grow", t: "Build with care.", d: "Tokens, components, motion specs, copy patterns. Every screen comes out of the same engine.", days: "Weeks 4–6", artifacts: ["Design system + tokens", "Component library", "Motion + interaction specs", "Production-ready prototypes"], color: "leaf" },
  { n: "04", k: "Ship", t: "Harvest & iterate.", d: "Pixel-perfect handoff to your team, or production React + Tailwind built by us. Your call.", days: "Weeks 6–8", artifacts: ["Production handoff or build", "Storybook + docs", "QA + accessibility pass", "Post-ship retro"], color: "sage" },
];

function phaseColor(color: string) {
  if (color === "clay") return "bg-clay text-clay";
  if (color === "leaf") return "bg-lime text-lime";
  return "bg-sage text-sage";
}

function ProcessPage() {
  return (
    <div className="relative pb-32">
      <section className="relative min-h-[45vh] overflow-hidden pt-24">
        <NatureImage
          src={IMAGES.fynbos}
          alt="Green hills in morning mist"
          className="absolute inset-0 h-full w-full"
          overlay="dark"
          priority
        />
        <header className="relative mx-auto flex min-h-[35vh] max-w-[1100px] flex-col justify-end px-6 pb-12 pt-32">
          <p className="text-sm font-medium text-sage">Process</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-tight">
            Four phases.{" "}
            <span className="font-serif italic gradient-nature-text">One team.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Same senior team from first call to last commit. Most SA startup projects run 3 to 8 weeks. Quotes in ZAR, ex. VAT where applicable.
          </p>
        </header>
      </section>

      <div className="relative mx-auto mt-16 max-w-[1100px] px-6">
        <div className="relative">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-sage via-clay to-lime opacity-40 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-16">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className={`relative grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                    <span className={`relative flex h-4 w-4 items-center justify-center rounded-full ${phaseColor(p.color)} shadow-[0_0_24px_currentColor]`}>
                      <span className="absolute inset-0 rounded-full bg-background/30" />
                    </span>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <p className="text-xs text-text-tertiary">Phase {p.n} · {p.days}</p>
                    <h2 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
                      <span className={p.color === "clay" ? "text-clay" : p.color === "leaf" ? "text-lime" : "text-sage"}>{p.k}</span>
                    </h2>
                    <p className="mt-4 font-display text-xl tracking-tight text-foreground/90">{p.t}</p>
                    <p className="mt-4 max-w-md text-sm text-muted-foreground">{p.d}</p>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <div className="rounded-2xl border border-border bg-surface/40 p-6">
                      <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Deliverables</p>
                      <ul className="mt-4 space-y-3">
                        {p.artifacts.map((a) => (
                          <li key={a} className="flex items-start gap-3 text-sm">
                            <span className="mt-2 h-1 w-1 rounded-full bg-sage" />
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

      <div className="relative mx-auto mt-20 max-w-[1100px] px-6 text-center">
        <h3 className="font-display text-3xl tracking-tight md:text-4xl">
          Ready when <span className="font-serif italic gradient-nature-text">you are.</span>
        </h3>
        <Link to="/contact" className="btn-nature-primary mt-8 inline-flex">
          Start phase 01
        </Link>
      </div>
    </div>
  );
}
