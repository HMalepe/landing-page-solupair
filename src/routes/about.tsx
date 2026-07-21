import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES, TEAM_IMAGES } from "@/lib/images";
import { LEGAL_NAME, SITE_NAME, pageHead } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () =>
    pageHead({
      title: `About — ${LEGAL_NAME}`,
      description: `${LEGAL_NAME} is a South African company. Six people, twelve combined years of senior craft — design that ships beats design that wins awards.`,
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
  { name: "Naledi Khumalo", role: "Founder · Design Director", bio: "Product design for SA fintech and SaaS startups. Based in Johannesburg." },
  { name: "Sipho Ndlovu", role: "Design Engineer", bio: "Ships production React for local teams — remote-first across ZA." },
  { name: "Amira Patel", role: "Brand Director", bio: "Brand systems for software companies from Cape Town to the continent." },
];

function AboutPage() {
  return (
    <div className="relative pb-32">
      <section className="relative min-h-[50vh] overflow-hidden pt-24">
        <NatureImage
          src={IMAGES.mountains}
          alt="Mountain range in morning mist"
          className="absolute inset-0 h-full w-full"
          overlay="dark"
          priority
        />
        <header className="relative mx-auto flex min-h-[40vh] max-w-[1100px] flex-col justify-end px-6 pb-12 pt-32">
          <p className="text-sm font-medium text-sage">About {SITE_NAME}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] tracking-tight">
            {LEGAL_NAME}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            A South African company building product UI, brand systems, and software for startups and scale-ups.
            Registered in SA, pricing in rands, POPIA-aware workflows. One shared belief: design that ships beats design that wins awards.
          </p>
        </header>
      </section>

      <section className="relative mx-auto mt-20 max-w-[1100px] px-6">
        <Reveal>
          <p className="text-sm font-medium text-sage">Principles</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">Six rules we work by.</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 50}>
              <div className="group flex gap-5 rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-sage/40">
                <span className="font-serif text-3xl italic text-sage/60">{p.n}</span>
                <div>
                  <h3 className="font-display text-xl tracking-tight">{p.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-[1100px] px-6">
        <Reveal>
          <p className="text-sm font-medium text-sage">The team</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
            Who you'll actually <span className="font-serif italic gradient-nature-text">be working with.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TEAM.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className="group overflow-hidden rounded-2xl border border-border bg-surface/40 lift">
                <NatureImage
                  src={TEAM_IMAGES[i].src}
                  alt={TEAM_IMAGES[i].alt}
                  className="aspect-[4/5] w-full"
                  overlay="light"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-sm font-medium text-sage">{p.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-[1100px] px-6 text-center">
        <NatureImage
          src={IMAGES.coast}
          alt="South African coastline"
          className="mb-10 aspect-[21/9] rounded-2xl border border-border"
          overlay="dark"
        />
        <h3 className="font-display text-3xl tracking-tight md:text-4xl">
          Reasons to <span className="font-serif italic gradient-nature-text">talk.</span>
        </h3>
        <Link to="/contact" className="btn-nature-primary mt-8 inline-flex">
          Start the conversation
        </Link>
      </section>
    </div>
  );
}
