import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/brand/Reveal";
import { NatureImage } from "@/components/brand/NatureImage";
import { IMAGES } from "@/lib/images";
import { LEGAL_NAME, pageHead } from "@/lib/site";
import expiryDeskImg from "@/assets/project-expiry-desk.png";
import livePulseImg from "@/assets/project-live-pulse.png";
import whatsappAgentImg from "@/assets/project-whatsapp-agent.png";

export const Route = createFileRoute("/work")({
  component: WorkPage,
  head: () =>
    pageHead({
      title: `Work — ${LEGAL_NAME}`,
      description: "Selected builds: pharmacy inventory dashboards, owner dashboards and WhatsApp booking automation.",
      path: "/work",
    }),
});

const CASES = [
  {
    n: "01",
    client: "ExpiryDesk PRO",
    scope: "Pharmacy inventory dashboard · expiry tracking",
    tag: "Inventory intelligence",
    size: "lg",
    img: expiryDeskImg,
  },
  {
    n: "02",
    client: "Live Pulse",
    scope: "Owner dashboard · bookings, revenue, WhatsApp inbox",
    tag: "Business visibility",
    size: "md",
    img: livePulseImg,
  },
  {
    n: "03",
    client: "WhatsApp Agent",
    scope: "WhatsApp booking automation",
    tag: "Customer automation",
    size: "md",
    img: whatsappAgentImg,
  },
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
          const span = c.size === "lg" ? "md:col-span-4" : "md:col-span-3";
          const ratio = c.size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]";
          return (
            <Reveal key={c.n} delay={i * 60} className={span}>
              <div className="group block lift overflow-hidden rounded-2xl border border-border bg-surface/40">
                <NatureImage
                  src={c.img}
                  alt={`${c.client} preview`}
                  className={`${ratio} w-full`}
                  overlay="dark"
                />
                <div className="flex items-center justify-between border-t border-border bg-surface/60 px-5 py-4">
                  <div>
                    <h2 className="font-display text-xl tracking-tight group-hover:gradient-nature-text md:text-2xl">{c.client}</h2>
                    <p className="text-xs text-muted-foreground">{c.scope}</p>
                  </div>
                  <span className="text-xs text-text-tertiary">{c.tag}</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="relative mx-auto mt-20 max-w-[1100px] px-6">
        <div className="rounded-2xl border border-border bg-surface/40 p-10 text-center md:p-16">
          <h3 className="font-display text-3xl tracking-tight md:text-4xl">
            Got something <span className="font-serif italic gradient-nature-text">like this?</span>
          </h3>
          <p className="mt-4 text-muted-foreground">Tell us what you're building — we'll tell you honestly if we're the right fit.</p>
          <Link to="/contact" className="btn-nature-outline mt-8 inline-flex">
            Tell us about it
          </Link>
        </div>
      </div>
    </div>
  );
}
