import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";
import { CONTACT_EMAIL, LEGAL_NAME, LOCATION_LABEL } from "@/lib/site";
import { ProjectsStaticGrid } from "@/components/nova/ProjectsStaticGrid";
import type { ProjectItem } from "@/components/nova/ProjectsStaticGrid";

export const projects: ProjectItem[] = [
  { name: "Lumina", tag: "Interactive Dashboard", img: project1 },
  { name: "Chroma", tag: "3D Brand Identity", img: project2 },
  { name: "Forma", tag: "Product Showcase", img: project3 },
  { name: "Flux", tag: "Motion Platform", img: project4 },
];

export function NovaLogo() {
  return (
    <div className="nova-gradient-text flex items-center gap-1 font-display text-2xl font-black tracking-tight">
      <span>N</span>
      <span className="relative inline-flex h-6 w-6 items-center justify-center">
        <span className="nova-logo-ring absolute inset-0 rounded-full border-[2.5px]" />
        <span className="relative">Ø</span>
      </span>
      <span>VA</span>
    </div>
  );
}

export function StaticViewportBall() {
  return (
    <div aria-hidden className="nova-viewport-ball">
      <div className="nova-viewport-ball-rider">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "var(--nova-ball-surface)",
            boxShadow:
              "inset -40px -50px 80px oklch(0 0 0 / 0.4), var(--solupair-glow), var(--solupair-glow-strong)",
          }}
        />
      </div>
    </div>
  );
}

export function HeroStatic() {
  return (
    <section className="nova-hero-bg relative z-10 min-h-screen overflow-hidden text-foreground">
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <NovaLogo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <a
            href="#work"
            className="nova-nav-pill rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-wider text-foreground/90 transition sm:px-5 sm:text-sm"
          >
            OUR WORK
          </a>
          <a
            href="#contact"
            className="nova-nav-pill rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-wider text-foreground/90 transition sm:px-5 sm:text-sm"
          >
            GET IN TOUCH
          </a>
        </nav>
      </header>

      <div className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-2">
        <div className="nova-gradient-text relative z-0 mb-4 text-center text-xs font-medium tracking-[0.28em] sm:text-sm">
          AUTOMATION &amp; WEB DESIGN
        </div>

        <div className="relative w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background: "var(--nova-ball-surface)",
                boxShadow:
                  "inset -40px -50px 80px oklch(0 0 0 / 0.4), var(--solupair-glow), var(--solupair-glow-strong)",
              }}
            />
          </div>
          <h1
            className="relative z-[1] w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter text-foreground"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            WE DESIGN
          </h1>
          <h1
            className="nova-gradient-text relative z-[1] w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            THE FUTURE
          </h1>
        </div>

        <p className="mt-10 max-w-xl px-4 text-center text-[11px] leading-relaxed tracking-[0.16em] text-foreground/70 sm:text-xs sm:tracking-[0.18em]">
          WE BUILD WEB APPLICATIONS WITH ADMIN DASHBOARDS, WHATSAPP BOOKING AGENTS — AND PLENTY MORE ON THE WAY.
        </p>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative z-[1] min-h-screen px-6 py-24 sm:px-10 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-7xl border-t border-white/10 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2
              className="font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              Let&apos;s Talk
            </h2>
            <p className="mt-6 max-w-md text-xs uppercase tracking-[0.18em] text-foreground/70 sm:text-sm">
              Got a project in mind? We&apos;d love to hear about it. Drop us a line and let&apos;s create something
              extraordinary.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-10 max-w-md space-y-6">
              <input
                placeholder="YOUR NAME"
                className="w-full border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-[var(--solupair-violet)] focus:outline-none focus:shadow-[0_1px_0_0_var(--solupair-cyan)]"
              />
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-[var(--solupair-violet)] focus:outline-none focus:shadow-[0_1px_0_0_var(--solupair-cyan)]"
              />
              <textarea
                rows={3}
                placeholder="Tell us about your project"
                className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-[var(--solupair-violet)] focus:outline-none focus:shadow-[0_1px_0_0_var(--solupair-cyan)]"
              />
              <button
                type="submit"
                className="nova-cta-btn inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-bold uppercase tracking-[0.2em]"
              >
                Send Message <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="lg:pl-12">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Follow Us</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Instagram", "Twitter", "LinkedIn", "Dribbble"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground transition hover:border-[var(--solupair-violet)] hover:text-[var(--solupair-cyan)]"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-12 space-y-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Email</div>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-1 block text-base text-foreground hover:text-[var(--solupair-cyan)]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Location</div>
                <div className="mt-1 text-base text-foreground">{LOCATION_LABEL}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-foreground/60">
          <div>
            © {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--solupair-cyan)]">
              Privacy
            </a>
            <a href="#" className="hover:text-[var(--solupair-cyan)]">
              Terms
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NovaHomeFallback() {
  return (
    <div className="nova-theme min-h-screen bg-background font-sans text-foreground">
      <StaticViewportBall />
      <main className="relative z-[1]">
        <HeroStatic />
        <div className="nova-lower-shell relative">
          <ProjectsStaticGrid projects={projects} />
          <Contact />
        </div>
      </main>
    </div>
  );
}
