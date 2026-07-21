import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectsHeader } from "@/components/nova/ProjectsHeader";
import type { ProjectItem } from "@/components/nova/ProjectsStaticGrid";

const ACCENT: Record<ProjectItem["accent"], string> = {
  teal: "var(--solupair-cyan)",
  violet: "var(--solupair-violet)",
  magenta: "var(--solupair-magenta)",
};

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="nova-project-chrome flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a12] shadow-[0_28px_90px_oklch(0_0_0_/_0.55)]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 truncate rounded-full bg-white/[0.06] px-3 py-1 text-center text-[10px] tracking-wide text-white/35 sm:text-[11px]">
          solupair.co.za / builds
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function PreviewSlide({ project, index, total }: { project: ProjectItem; index: number; total: number }) {
  return (
    <BrowserChrome>
      <img
        src={project.img}
        alt={`${project.name} — ${project.tag}`}
        className="h-full w-full object-cover object-top"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:p-10">
        <div className="max-w-xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold tracking-[0.28em] text-white/55">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm"
              style={{ borderColor: `${ACCENT[project.accent]}66`, background: `${ACCENT[project.accent]}22` }}
            >
              {project.tag}
            </span>
          </div>
          <h3 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15"
            >
              Open live build
            </a>
          ) : null}
          <a
            href="#contact"
            className="nova-cta-btn inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em]"
          >
            Discuss this build <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </BrowserChrome>
  );
}

export function ProjectCarousel({ projects }: { projects: ProjectItem[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const total = projects.length;
  const project = projects[active] ?? projects[0];

  const go = useCallback(
    (next: number) => {
      if (!total) return;
      setActive(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  if (!project) return null;

  return (
    <section id="work" className="relative z-[1] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <ProjectsHeader />
            <p className="mt-4 max-w-xl text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/45">
              Swipe, use the arrows, dots or cards below to browse builds.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/60 lg:text-right">
            Live dashboards, booking flows and automation tools built to reduce admin, missed bookings and messy
            operations.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="nova-projects-stage relative mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.name}
                initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <PreviewSlide project={project} index={active} total={total} />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Previous project"
            onClick={() => go(active - 1)}
            className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-black/70 sm:left-4 sm:flex lg:-left-5"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => go(active + 1)}
            className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-black/70 sm:right-4 sm:flex lg:-right-5"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
          {projects.map((p, i) => (
            <button
              key={p.name}
              type="button"
              aria-label={`Show ${p.name}`}
              onClick={() => setActive(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === active ? 32 : 8,
                opacity: i === active ? 1 : 0.32,
                background: ACCENT[p.accent],
              }}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setActive(i)}
                className="rounded-2xl border p-5 text-left transition"
                style={{
                  borderColor: selected ? `${ACCENT[p.accent]}88` : "rgba(255,255,255,0.1)",
                  background: selected ? `${ACCENT[p.accent]}14` : "rgba(255,255,255,0.02)",
                  boxShadow: selected ? `0 0 0 1px ${ACCENT[p.accent]}33` : undefined,
                }}
              >
                <span
                  className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: ACCENT[p.accent], background: `${ACCENT[p.accent]}22` }}
                >
                  {p.tag}
                </span>
                <h4 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">{p.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">{p.summary}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
