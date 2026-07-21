import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaceBall } from "@/components/nova/FaceBall";
import { ProjectCarousel } from "@/components/nova/ProjectCarousel";
import { ProjectsStaticGrid } from "@/components/nova/ProjectsStaticGrid";
import { ViewportPhysicsBalls } from "@/components/nova/ViewportPhysicsBalls";
import { Contact, NovaLogo, projects } from "@/components/nova/nova-home-shared";
import { CinematicPitch } from "@/components/nova/CinematicPitch";
import "@/styles-nova.css";

function Hero() {
  const playAreaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

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

      <div
        ref={playAreaRef}
        className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-0"
      >
        <div className="nova-gradient-text relative z-0 mb-4 text-center text-xs font-medium tracking-[0.28em] sm:text-sm">
          AUTOMATION &amp; WEB DESIGN
        </div>

        <div ref={headlineRef} className="relative w-full">
          <FaceBall playAreaRef={playAreaRef} headlineRef={headlineRef} />
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
          <CinematicPitch />
          <Contact />
        </div>
      </main>
    </div>
  );
}
