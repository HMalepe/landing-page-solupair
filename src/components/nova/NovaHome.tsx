import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";
import { ProjectCarousel } from "@/components/nova/ProjectCarousel";
import { ProjectsStaticGrid } from "@/components/nova/ProjectsStaticGrid";
import { ViewportPhysicsBalls } from "@/components/nova/ViewportPhysicsBalls";
import { Contact, NovaLogo, projects } from "@/components/nova/nova-home-shared";
import "@/styles-nova.css";

/** Hero only — scroll drives eyes, smile, fade-back, and bounce amplitude. */
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
  const ampPx = useTransform(bounceAmp, (v) => `${v}px`);
  const fadeRaw = useTransform(scrollY, [140, 520], [0, 1]);
  const fade = useSpring(fadeRaw, { stiffness: 110, damping: 26 });
  const ballOpacity = useTransform(fade, [0, 1], [1, 0.42]);
  const ballBlur = useTransform(fade, (v) => `blur(${v * 14}px)`);
  const ballZ = useTransform(fade, [0, 1], [10, 0]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
      style={{ opacity: ballOpacity, filter: ballBlur, zIndex: ballZ }}
    >
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
    </motion.div>
  );
}

function Hero() {
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
          <FaceBall />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-[1] w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter text-foreground"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            WE DESIGN
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="nova-gradient-text relative z-[1] w-full whitespace-nowrap text-center font-display font-black leading-[0.85] tracking-tighter"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)" }}
          >
            THE FUTURE
          </motion.h1>
        </div>

        <p className="mt-10 max-w-xl px-4 text-center text-[11px] leading-relaxed tracking-[0.16em] text-foreground/70 sm:text-xs sm:tracking-[0.18em]">
          WE BUILD WEB APPLICATIONS WITH ADMIN DASHBOARDS, WHATSAPP BOOKING AGENTS — AND PLENTY MORE ON THE WAY.
        </p>
      </div>
    </section>
  );
}

function Projects() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <ProjectsStaticGrid projects={projects} />;
  }
  return <ProjectCarousel projects={projects} />;
}

export function NovaHome() {
  return (
    <div className="nova-theme min-h-screen bg-background font-sans text-foreground">
      <ViewportPhysicsBalls />
      <main className="relative z-[1]">
        <Hero />
        <div className="nova-lower-shell relative">
          <Projects />
          <Contact />
        </div>
      </main>
    </div>
  );
}
