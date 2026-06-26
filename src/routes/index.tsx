import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";
import solupairLogo from "@/assets/solupair-logo.png";

export const Route = createFileRoute("/")({
  component: NovaHome,
});

const projects = [
  { name: "Lumina", tag: "Interactive Dashboard", img: project1 },
  { name: "Chroma", tag: "3D Brand Identity", img: project2 },
  { name: "Forma", tag: "Product Showcase", img: project3 },
  { name: "Flux", tag: "Motion Platform", img: project4 },
];

function SolupairLogo() {
  return (
    <a href="https://solupair.co.za" className="inline-flex items-center">
      <img
        src={solupairLogo}
        alt="Solupair"
        className="h-10 w-10 object-contain sm:h-12 sm:w-12"
      />
    </a>
  );
}

function FaceBall() {
  const { scrollY } = useScroll();
  // Eyes: lids closed (scaleY 1) → open (0) as user begins to scroll
  const lidRaw = useTransform(scrollY, [0, 220], [1, 0]);
  const lidScale = useSpring(lidRaw, { stiffness: 140, damping: 22 });
  // Smile: 0 (neutral dot) → 1 (full grin) as scroll continues
  const smileRaw = useTransform(scrollY, [180, 520], [0, 1]);
  const smile = useSpring(smileRaw, { stiffness: 140, damping: 22 });
  const mouthWidth = useTransform(smile, (v: number) => `${22 + v * 70}px`);
  const mouthHeight = useTransform(smile, (v: number) => `${36 + v * 12}px`);
  const mouthRadius = useTransform(
    smile,
    (v: number) =>
      `${50 - v * 40}% ${50 - v * 40}% ${50 + v * 45}% ${50 + v * 45}% / ${50 - v * 35}% ${50 - v * 35}% ${50 + v * 55}% ${50 + v * 55}%`,
  );
  // Bounce amplitude grows from 8 → 34 px with scroll
  const bounceAmp = useTransform(scrollY, [0, 600], [8, 34]);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
    >
      <BouncingBall
        lidScale={lidScale}
        mouthRadius={mouthRadius}
        mouthHeight={mouthHeight}
        mouthWidth={mouthWidth}
        bounceAmp={bounceAmp}
      />
    </div>
  );
}

type BallProps = {
  lidScale: MotionValue<number>;
  mouthRadius: MotionValue<string>;
  mouthHeight: MotionValue<string>;
  mouthWidth: MotionValue<string>;
  bounceAmp: MotionValue<number>;
};

function BouncingBall({ lidScale, mouthRadius, mouthHeight, mouthWidth, bounceAmp }: BallProps) {
  // Outer wrapper: scroll-driven amplitude as a CSS var.
  const ampPx = useTransform(bounceAmp, (v) => `${v}px`);
  return (
    <motion.div
      className="h-full w-full animate-[novaBounce_2.8s_ease-in-out_infinite]"
      style={{ ["--nova-amp" as string]: ampPx }}
    >
      <div
        className="relative h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, oklch(0.72 0.18 275) 0%, oklch(0.48 0.26 275) 55%, oklch(0.32 0.22 275) 100%)",
          boxShadow:
            "inset -40px -50px 80px oklch(0 0 0 / 0.35), 0 40px 80px oklch(0 0 0 / 0.25)",
        }}
      >
        <Eye side="left" lidScale={lidScale} />
        <Eye side="right" lidScale={lidScale} />
        <motion.div
          className="absolute left-1/2 top-[64%] -translate-x-1/2 bg-black"
          style={{ width: mouthWidth, height: mouthHeight, borderRadius: mouthRadius }}
        />
      </div>
    </motion.div>
  );
}

function Eye({ side, lidScale }: { side: "left" | "right"; lidScale: MotionValue<number> }) {
  const posClass = side === "left" ? "left-[26%]" : "right-[26%]";
  return (
    <div className={`absolute ${posClass} top-[38%] h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] lg:h-[100px] lg:w-[100px]`}>
      {/* open eye */}
      <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-none text-black sm:text-[80px] lg:text-[100px]">✻</div>
      {/* lid that scales down to reveal eye */}
      <motion.div
        className="absolute inset-0 origin-center rounded-full"
        style={{
          scaleY: lidScale,
          background:
            "radial-gradient(circle at 32% 28%, oklch(0.72 0.18 275) 0%, oklch(0.48 0.26 275) 55%, oklch(0.32 0.22 275) 100%)",
        }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <SolupairLogo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <a
            href="#work"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-wider text-foreground transition hover:border-primary hover:text-primary sm:px-5 sm:text-sm"
          >
            OUR WORK
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-wider text-foreground transition hover:border-primary hover:text-primary sm:px-5 sm:text-sm"
          >
            GET IN TOUCH
          </a>
        </nav>
      </header>

      <div className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-2">
        <div className="relative z-0 mb-4 text-center text-xs font-medium tracking-[0.3em] text-primary sm:text-sm">
          WEB DESIGN AGENCY
        </div>

        <div className="relative w-full">
          <FaceBall />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-0 w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter text-foreground"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            WE DESIGN
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative z-0 w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter text-primary"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            THE FUTURE
          </motion.h1>
        </div>

        <p className="mt-10 max-w-2xl text-center text-xs tracking-[0.2em] text-foreground/70 sm:text-sm">
          WEB APPLICATIONS, DASHBOARDS, WHATSAPP BOOKING AGENTS — AND PLENTY MORE BUSINESS SOLUTIONS
        </p>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="work"
      className="relative px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      style={{ background: "var(--section-dark)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <h2
          className="font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground"
          style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
        >
          Projects
        </h2>
        <p className="max-w-sm text-right text-xs tracking-[0.2em] text-foreground/70 sm:text-sm">
          WE CRAFT IMMERSIVE DIGITAL EXPERIENCES THAT PUSH THE BOUNDARIES OF WEB DESIGN &amp; MOTION.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.a
            key={p.name}
            href="#"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="group relative block overflow-hidden rounded-2xl"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={p.img}
                alt={`${p.name} — ${p.tag}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
              <div className="flex justify-end">
                <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur sm:text-xs">
                  {p.tag}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <h3 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {p.name}
                </h3>
                <ArrowUpRight className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      style={{ background: "var(--section-dark)" }}
    >
      <div className="mx-auto max-w-7xl border-t border-white/10 pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2
              className="font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              Let's Talk
            </h2>
            <p className="mt-6 max-w-md text-xs uppercase tracking-[0.18em] text-foreground/70 sm:text-sm">
              Got a project in mind? We'd love to hear about it. Drop us a line and let's create something extraordinary.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 max-w-md space-y-6"
            >
              <input
                placeholder="YOUR NAME"
                className="w-full border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="w-full border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
              />
              <textarea
                rows={3}
                placeholder="Tell us about your project"
                className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm tracking-wider text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                Send Message <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="lg:pl-12">
            <div className="space-y-6">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Email</div>
                <div className="mt-1 text-base text-foreground">hello@nova.studio</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">Location</div>
                <div className="mt-1 text-base text-foreground">Paris, France</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-foreground/60">
          <div>© 2026 NØVA Studio. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function NovaHome() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Hero />
      <Projects />
      <Contact />
    </main>
  );
}