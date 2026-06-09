import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES, WORK_IMAGES } from "@/lib/images";
import { LEGAL_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () =>
    pageHead({
      title: `Work — ${LEGAL_NAME}`,
      description: "Selected case studies in product UI, brand, landing pages and internal tools.",
      path: "/work",
    }),
});

const CASES = [
  { n: "01", client: "Payflow", scope: "Product UI · Design System", year: "2025", tag: "SA Fintech", size: "lg" },
  { n: "02", client: "Ledger Rhino", scope: "Brand + Landing", year: "2025", tag: "B2B SaaS", size: "md" },
  { n: "03", client: "AgriSense", scope: "Ops Dashboard", year: "2024", tag: "Agtech · CPT", size: "md" },
  { n: "04", client: "Northwind Mail", scope: "Marketing UI redesign", year: "2024", tag: "Communications", size: "lg" },
  { n: "05", client: "Verge Studio", scope: "Brand + Identity", year: "2024", tag: "Creative", size: "sm" },
  { n: "06", client: "Pinecone HR", scope: "Internal admin tools", year: "2023", tag: "HR Tech", size: "sm" },
];

function WorkPage() {
  return (
    <div className="relative pb-32">
      <section className="relative min-h-[45vh] overflow-hidden pt-24">
        <NatureImage
          src={IMAGES.grassland}
          alt="Golden grassland at sunset"
          className="absolute inset-0 h-full w-full"
          overlay="dark"
          priority
        />
        <header className="relative mx-auto flex min-h-[35vh] max-w-[1100px] flex-col justify-end px-6 pb-12 pt-32">
          <p className="text-sm font-medium text-sage">Work</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-tight">
            Selected{" "}
            <span className="font-serif italic gradient-nature-text">projects.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A small sample of shipped work. Full case studies — including private NDA work — available on request.
          </p>
        </header>
      </section>

      <div className="relative mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-5 px-6 md:grid-cols-6">
        {CASES.map((c, i) => {
          const span = c.size === "lg" ? "md:col-span-4" : c.size === "md" ? "md:col-span-3" : "md:col-span-2";
          const ratio = c.size === "lg" ? "aspect-[16/10]" : c.size === "md" ? "aspect-[4/3]" : "aspect-square";
          const img = WORK_IMAGES[i];
          return (
            <Reveal key={c.n} delay={i * 60} className={span}>
              <Link to="/work" className="group block lift overflow-hidden rounded-2xl border border-border bg-surface/40">
                <NatureImage
                  src={img.src}
                  alt={img.alt}
                  className={`${ratio} w-full`}
                  overlay="dark"
                />
                <div className="flex items-center justify-between border-t border-border bg-surface/60 px-5 py-4">
                  <div>
                    <h2 className="font-display text-xl tracking-tight group-hover:gradient-nature-text md:text-2xl">{c.client}</h2>
                    <p className="text-xs text-muted-foreground">{c.scope}</p>
                  </div>
                  <span className="text-xs text-text-tertiary">{c.year}</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="relative mx-auto mt-20 max-w-[1100px] px-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-10 text-center md:p-16">
          <h3 className="font-display text-3xl tracking-tight md:text-4xl">
            Want the <span className="font-serif italic gradient-nature-text">NDA work?</span>
          </h3>
          <p className="mt-4 text-muted-foreground">We share private case studies on call. Most of what we ship never makes the archive.</p>
          <Link to="/contact" className="btn-nature-outline mt-8 inline-flex">
            Request portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
