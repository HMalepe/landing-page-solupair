import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, LEGAL_NAME, LOCATION_LABEL } from "@/lib/site";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";
import project4 from "@/assets/project4.jpg";
import "@/styles-nova.css";

const projects = [
  { name: "Lumina", tag: "Interactive Dashboard", img: project1 },
  { name: "Chroma", tag: "3D Brand Identity", img: project2 },
  { name: "Forma", tag: "Product Showcase", img: project3 },
  { name: "Flux", tag: "Motion Platform", img: project4 },
];

function NovaLogo() {
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

/** Hero ball — scroll-reactive face, gentle in-place bounce (original). */
function FaceBall() {
  const { scrollY } = useScroll();
  const lidRaw = useTransform(scrollY, [0, 220], [1, 0]);
  const lidScale = useSpring(lidRaw, { stiffness: 140, damping: 22 });
  const smileRaw = useTransform(scrollY, [180, 520], [0, 1]);
  const smile = useSpring(smileRaw, { stiffness: 140, damping: 22 });
  const mouthWidth = useTransform(smile, (v: number) => `${22 + v * 70}px`);
  const mouthHeight = useTransform(smile, (v: number) => `${36 + v * 12}px`);
  const mouthRadius = useTransform(
    smile,
    (v: number) =>
      `${50 - v * 40}% ${50 - v * 40}% ${50 + v * 45}% ${50 + v * 45}% / ${50 - v * 35}% ${50 - v * 35}% ${50 + v * 55}% ${50 + v * 55}%`,
  );
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
  const ampPx = useTransform(bounceAmp, (v) => `${v}px`);
  return (
    <motion.div
      className="h-full w-full animate-[novaBounce_2.8s_ease-in-out_infinite]"
      style={{ ["--nova-amp" as string]: ampPx }}
    >
      <BallSphere
        lidScale={lidScale}
        mouthRadius={mouthRadius}
        mouthHeight={mouthHeight}
        mouthWidth={mouthWidth}
      />
    </motion.div>
  );
}

function BallSphere({
  lidScale,
  mouthRadius,
  mouthHeight,
  mouthWidth,
}: {
  lidScale?: MotionValue<number>;
  mouthRadius?: MotionValue<string>;
  mouthHeight?: MotionValue<string>;
  mouthWidth?: MotionValue<string>;
}) {
  const hasFace = lidScale && mouthWidth && mouthHeight && mouthRadius;

  return (
    <div
      className="relative h-full w-full rounded-full"
      style={{
        background: "var(--nova-ball-surface)",
        boxShadow:
          "inset -40px -50px 80px oklch(0 0 0 / 0.4), var(--solupair-glow), var(--solupair-glow-strong)",
      }}
    >
      <Eye side="left" lidScale={lidScale} />
      <Eye side="right" lidScale={lidScale} />
      {hasFace ? (
        <motion.div
          className="absolute left-1/2 top-[64%] -translate-x-1/2 bg-black"
          style={{ width: mouthWidth, height: mouthHeight, borderRadius: mouthRadius }}
        />
      ) : (
        <div
          className="absolute left-1/2 top-[64%] -translate-x-1/2 bg-black/90"
          style={{ width: 28, height: 36, borderRadius: "50%" }}
        />
      )}
    </div>
  );
}

function Eye({ side, lidScale }: { side: "left" | "right"; lidScale?: MotionValue<number> }) {
  const posClass = side === "left" ? "left-[26%]" : "right-[26%]";
  return (
    <div
      className={`absolute ${posClass} top-[38%] h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] lg:h-[100px] lg:w-[100px]`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-none text-black sm:text-[80px] lg:text-[100px]">
        ✻
      </div>
      {lidScale ? (
        <motion.div
          className="absolute inset-0 origin-center rounded-full"
          style={{
            scaleY: lidScale,
            background: "var(--nova-ball-surface)",
          }}
        />
      ) : null}
    </div>
  );
}

/** Duplicate ball — blurred, drifts behind Projects → Contact only. */
function BackgroundDriftBall() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div aria-hidden className="nova-bg-ball-layer">
      <div className="nova-bg-ball-pin">
        <motion.div
          className="nova-ball-rider nova-ball-rider--bg"
          animate={{
            y: ["-44vh", "42vh", "36vh", "42vh", "-42vh", "-44vh"],
            scaleX: [1, 1, 1.08, 0.96, 1.06, 1],
            scaleY: [1, 1, 0.86, 1.05, 0.88, 1],
            opacity: [0.48, 0.32, 0.4, 0.34, 0.44, 0.48],
            filter: [
              "blur(10px)",
              "blur(16px)",
              "blur(12px)",
              "blur(14px)",
              "blur(11px)",
              "blur(10px)",
            ],
          }}
          transition={{
            duration: 20,
            times: [0, 0.46, 0.5, 0.55, 0.95, 1],
            ease: [
              [0.65, 0.04, 0.9, 0.45],
              [0.3, 0.05, 0.45, 0.95],
              [0.34, 0.01, 0.25, 1],
              [0.22, 0.61, 0.36, 1],
              [0.65, 0.04, 0.9, 0.45],
              [0.45, 0, 0.55, 1],
            ],
            repeat: Infinity,
          }}
        >
          <BallSphere />
        </motion.div>
      </div>
    </div>
  );
}

function LowerPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="nova-lower-shell">
      <BackgroundDriftBall />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className="nova-hero-bg relative min-h-screen overflow-hidden text-foreground">
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
        <div className="nova-gradient-text relative z-0 mb-4 text-center text-xs font-medium tracking-[0.3em] sm:text-sm">
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
            className="nova-gradient-text relative z-0 w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            THE FUTURE
          </motion.h1>
        </div>

        <p className="mt-10 max-w-md text-center text-xs tracking-[0.2em] text-foreground/70 sm:text-sm">
          DIGITAL EXPERIENCES CRAFTED WITH PRECISION, MOTION &amp; PURPOSE.
        </p>
      </div>
    </section>
  );
}

const PROJECT_SCROLL_VH = projects.length;

const easeOut = (t: number) => 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;

type CardMotion = {
  x: number;
  scale: number;
  opacity: number;
  zIndex: number;
  blur: number;
};

function projectCardMotion(index: number, slideProgress: number): CardMotion {
  const lastIndex = projects.length - 1;
  const incomingStart = index - 1;
  const outgoingEnd = index + 1;

  if (index > 0 && slideProgress >= incomingStart && slideProgress < index) {
    const t = easeOut(slideProgress - incomingStart);
    return {
      x: 72 * (1 - t),
      scale: 0.88 + 0.12 * t,
      opacity: t <= 0 ? 0 : 0.4 + 0.6 * t,
      zIndex: Math.round(20 + 30 * t),
      blur: 8 * (1 - t),
    };
  }

  if (slideProgress >= index && slideProgress < outgoingEnd) {
    if (index === lastIndex) {
      return { x: 0, scale: 1, opacity: 1, zIndex: 50, blur: 0 };
    }
    const t = easeOut(slideProgress - index);
    return {
      x: -32 * t,
      scale: 1 - 0.14 * t,
      opacity: 1 - 0.75 * t,
      zIndex: Math.round(50 - 40 * t),
      blur: 6 * t,
    };
  }

  if (slideProgress < index) {
    return { x: 115, scale: 0.88, opacity: 0, zIndex: 0, blur: 0 };
  }

  const depth = slideProgress - outgoingEnd;
  return {
    x: -26 - depth * 14,
    scale: Math.max(0.68, 0.82 - depth * 0.05),
    opacity: Math.max(0.04, 0.3 - depth * 0.07),
    zIndex: Math.max(1, 10 - index - Math.floor(depth)),
    blur: 10 + depth * 4,
  };
}

function ScrollProjectCard({
  project,
  index,
  slideProgress,
}: {
  project: (typeof projects)[number];
  index: number;
  slideProgress: MotionValue<number>;
}) {
  const x = useTransform(slideProgress, (sp) => `${projectCardMotion(index, sp).x}%`);
  const scale = useTransform(slideProgress, (sp) => projectCardMotion(index, sp).scale);
  const opacity = useTransform(slideProgress, (sp) => projectCardMotion(index, sp).opacity);
  const zIndex = useTransform(slideProgress, (sp) => projectCardMotion(index, sp).zIndex);
  const filter = useTransform(slideProgress, (sp) => {
    const blur = projectCardMotion(index, sp).blur;
    return blur > 0.1 ? `blur(${blur}px)` : "none";
  });

  return (
    <motion.article
      style={{ x, scale, opacity, zIndex, filter }}
      className="nova-project-card group absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
    >
      <img
        src={project.img}
        alt={`${project.name} — ${project.tag}`}
        loading={index === 0 ? "eager" : "lazy"}
        width={1024}
        height={1024}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="nova-gradient-text font-mono text-xs font-semibold tracking-[0.3em]">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur sm:text-xs">
            {project.tag}
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.name}
          </h3>
          <ArrowUpRight className="h-8 w-8 shrink-0 text-white/80 transition group-hover:text-[var(--solupair-cyan)]" />
        </div>
      </div>
    </motion.article>
  );
}

function ProjectScrollIndicator({ slideProgress }: { slideProgress: MotionValue<number> }) {
  const active = useTransform(slideProgress, (sp) =>
    Math.min(projects.length - 1, Math.max(0, Math.floor(sp))),
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {projects.map((p, i) => (
        <ProjectDot key={p.name} index={i} active={active} />
      ))}
    </div>
  );
}

function ProjectDot({ index, active }: { index: number; active: MotionValue<number> }) {
  const width = useTransform(active, (a) => (a === index ? 28 : 8));
  const opacity = useTransform(active, (a) => (a === index ? 1 : 0.35));

  return (
    <motion.div
      style={{ width, opacity }}
      className="h-2 rounded-full bg-[var(--solupair-cyan)]"
    />
  );
}

function ProjectsStaticGrid() {
  return (
    <section
      id="work"
      className="relative px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      style={{ background: "var(--section-dark)" }}
    >
      <div className="mx-auto max-w-7xl">
        <ProjectsHeader />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.name} className="relative overflow-hidden rounded-2xl border border-white/10">
              <img src={p.img} alt={`${p.name} — ${p.tag}`} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent p-6">
                <span className="self-end rounded-full bg-black/40 px-3 py-1 text-xs uppercase tracking-wider text-white/90">
                  {p.tag}
                </span>
                <h3 className="font-display text-4xl font-black text-white">{p.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsHeader() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <h2
        className="font-display font-black uppercase leading-[0.9] tracking-tighter text-foreground"
        style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
      >
        Projects
      </h2>
      <p className="max-w-sm text-left text-xs tracking-[0.2em] text-foreground/70 sm:text-right sm:text-sm">
        WE CRAFT IMMERSIVE DIGITAL EXPERIENCES THAT PUSH THE BOUNDARIES OF WEB DESIGN &amp; MOTION.
      </p>
    </div>
  );
}

function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const slideProgress = useTransform(scrollYProgress, [0, 1], [0, PROJECT_SCROLL_VH]);

  if (reduceMotion) {
    return <ProjectsStaticGrid />;
  }

  return (
    <section
      id="work"
      ref={containerRef}
      className="nova-projects-scroll relative z-[1]"
      style={{
        height: `${PROJECT_SCROLL_VH * 100}vh`,
        background: "transparent",
      }}
    >
      <div className="nova-projects-pin">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-6 pb-10 pt-16 sm:px-10 lg:px-14 lg:pt-20">
          <ProjectsHeader />
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Scroll to explore
          </p>

          <div className="nova-projects-stage relative mx-auto mt-10 w-full max-w-5xl flex-1">
            {projects.map((p, i) => (
              <ScrollProjectCard key={p.name} project={p} index={i} slideProgress={slideProgress} />
            ))}
          </div>

          <ProjectScrollIndicator slideProgress={slideProgress} />
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative z-[1] px-6 py-24 sm:px-10 lg:px-14 lg:py-32"
      style={{ background: "transparent" }}
    >
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
                <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block text-base text-foreground hover:text-[var(--solupair-cyan)]">
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
          <div>© {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.</div>
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

export function NovaHome() {
  return (
    <div className="nova-theme min-h-screen bg-background font-sans text-foreground">
      <main>
        <Hero />
        <LowerPageShell>
          <Projects />
          <Contact />
        </LowerPageShell>
      </main>
    </div>
  );
}
