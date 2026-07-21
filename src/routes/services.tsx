import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES } from "@/lib/images";
import { LEGAL_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () =>
    pageHead({
      title: `Services — ${LEGAL_NAME}`,
      description:
        "Product UI/UX, brand systems, landing pages, e-commerce, internal tools, design-engineering, and AI surface design.",
      path: "/services",
    }),
});

const SERVICES = [
  { idx: "01", name: "Product UI / UX", lede: "Product design with embedded design-engineering for SA SaaS teams.",
    deliverables: ["Design system + component lib", "Research & flow architecture", "Prototype + production handoff", "Weekly design-eng pairing"], time: "6–12 weeks · from R40k", accent: "sage" },
  { idx: "02", name: "Landing pages", lede: "Marketing surfaces that ship fast — built for local startups and scale-ups.",
    deliverables: ["Concept + art direction", "Copy collaboration", "Production code in React + Tailwind", "A/B-ready variants"], time: "1–3 weeks · from R8k", accent: "clay" },
  { idx: "03", name: "Brand systems", lede: "Identity from pitch deck to product — POPIA-aware, investor-ready.",
    deliverables: ["Logo + wordmark system", "Type + color tokens", "Voice + tone", "Brand book + asset library"], time: "2–4 weeks · from R10k", accent: "leaf" },
  { idx: "04", name: "E-commerce", lede: "Shopify and headless storefronts tuned for SA payments and mobile-first buyers.",
    deliverables: ["Theme architecture", "PDP / cart / checkout polish", "Performance budget", "Lifecycle email design"], time: "3–6 weeks · from R25k", accent: "sage" },
  { idx: "05", name: "Internal tools", lede: "Admin panels and ops dashboards your team will actually use.",
    deliverables: ["UX audit + IA", "Component library", "Live data wiring", "Empty + edge states"], time: "3–8 weeks · from R30k", accent: "clay" },
  { idx: "06", name: "Design-engineering", lede: "We ship the code — React, Tailwind, TanStack. Same team, JHB / CPT / remote.",
    deliverables: ["Production components", "Animation systems", "Perf budgets + accessibility", "Storybook + docs"], time: "Ongoing · from R5k/day", accent: "leaf" },
  { idx: "07", name: "AI surface design", lede: "Chat, agents, and copilots — UI where your models meet users.",
    deliverables: ["Conversation IA", "Streaming UI patterns", "Tool-use affordances", "Trust + guardrail design"], time: "2–5 weeks · from R12k", accent: "sage" },
];

function accentClass(accent: string) {
  if (accent === "clay") return "bg-clay text-clay";
  if (accent === "leaf") return "bg-lime text-lime";
  return "bg-sage text-sage";
}

function ServicesPage() {
  return (
    <div className="relative pb-32">
      <section className="relative min-h-[45vh] overflow-hidden pt-24">
        <NatureImage
          src={IMAGES.studio}
          alt="Bright workspace with plants and natural light"
          className="absolute inset-0 h-full w-full"
          overlay="dark"
          priority
        />
        <header className="relative mx-auto flex min-h-[35vh] max-w-[1100px] flex-col justify-end px-6 pb-12 pt-32">
          <p className="text-sm font-medium text-sage">Services</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-tight">
            Seven things{" "}
            <span className="font-serif italic gradient-nature-text">we do well.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            One senior team based in South Africa. Startup-friendly scopes in ZAR. Most projects run 3 to 8 weeks. Written response within 24 hours.
          </p>
        </header>
      </section>

      <div className="relative mx-auto mt-16 max-w-[1100px] space-y-4 px-6">
        {SERVICES.map((s, i) => (
          <Reveal key={s.idx} delay={i * 40}>
            <article className="group grid grid-cols-1 gap-6 rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-sage/40 md:grid-cols-12 md:p-8">
              <div className="flex items-center justify-between gap-2 md:col-span-1 md:flex-col md:items-start md:justify-start">
                <span className="text-xs text-text-tertiary">{s.idx}</span>
                <span className={`h-2 w-2 rounded-full shadow-[0_0_18px_currentColor] ${accentClass(s.accent)}`} />
              </div>
              <div className="md:col-span-5">
                <h2 className="font-display text-2xl tracking-tight md:text-3xl group-hover:gradient-nature-text">{s.name}</h2>
                <p className="mt-3 text-muted-foreground">{s.lede}</p>
                <p className="mt-4 text-xs text-text-tertiary">{s.time}</p>
              </div>
              <ul className="grid grid-cols-1 gap-2 self-center md:col-span-6 md:grid-cols-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-sage" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="relative mx-auto mt-20 max-w-[1100px] px-6 text-center">
        <Link to="/contact" className="btn-nature-primary inline-flex">
          Brief us — 24h response
        </Link>
      </div>
    </div>
  );
}
