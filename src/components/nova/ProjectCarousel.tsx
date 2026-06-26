import { memo, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  computeProjectCardMotion,
  PROJECT_SCROLL_HEIGHT_VH,
  PROJECT_SCROLL_SEGMENTS,
} from "@/lib/project-carousel-motion";
import { ProjectsHeader } from "@/components/nova/ProjectsHeader";
import type { ProjectItem } from "@/components/nova/ProjectsStaticGrid";

export type { ProjectItem } from "@/components/nova/ProjectsStaticGrid";

const ScrollProjectCard = memo(function ScrollProjectCard({
  project,
  index,
  slideProgress,
  stageWidth,
  total,
}: {
  project: ProjectItem;
  index: number;
  slideProgress: MotionValue<number>;
  stageWidth: number;
  total: number;
}) {
  const width = Math.max(stageWidth, 1);

  const x = useTransform(slideProgress, (sp) => {
    const m = computeProjectCardMotion(index, sp, total);
    return (m.xPercent / 100) * width;
  });
  const y = useTransform(slideProgress, (sp) => computeProjectCardMotion(index, sp, total).yPx);
  const scale = useTransform(slideProgress, (sp) => computeProjectCardMotion(index, sp, total).scale);
  const opacity = useTransform(slideProgress, (sp) => computeProjectCardMotion(index, sp, total).opacity);
  const zIndex = useTransform(slideProgress, (sp) => computeProjectCardMotion(index, sp, total).zIndex);
  const visibility = useTransform(slideProgress, (sp) =>
    computeProjectCardMotion(index, sp, total).visible ? "visible" : "hidden",
  );

  return (
    <motion.article
      style={{ x, y, scale, opacity, zIndex, visibility }}
      className="nova-project-card group absolute inset-0 overflow-hidden rounded-2xl border border-white/10"
    >
      <img
        src={project.img}
        alt={`${project.name} — ${project.tag}`}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        width={1024}
        height={1024}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="nova-gradient-text font-mono text-xs font-semibold tracking-[0.3em]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm sm:text-xs">
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
});

function ProjectScrollIndicator({
  slideProgress,
  total,
}: {
  slideProgress: MotionValue<number>;
  total: number;
}) {
  const active = useTransform(slideProgress, (sp) => Math.min(total - 1, Math.max(0, Math.round(sp))));

  return (
    <div className="mt-8 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <ProjectDot key={i} index={i} active={active} />
      ))}
    </div>
  );
}

function ProjectDot({ index, active }: { index: number; active: MotionValue<number> }) {
  const width = useTransform(active, (a) => (a === index ? 32 : 8));
  const opacity = useTransform(active, (a) => (a === index ? 1 : 0.32));

  return <motion.div style={{ width, opacity }} className="h-1.5 rounded-full bg-[var(--solupair-cyan)]" />;
}

export function ProjectCarousel({ projects }: { projects: ProjectItem[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const slideProgress = useTransform(scrollYProgress, [0, 1], [0, PROJECT_SCROLL_SEGMENTS]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => setStageWidth(el.clientWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="work"
      ref={containerRef}
      className="nova-projects-scroll relative z-[1]"
      style={{ height: `${PROJECT_SCROLL_HEIGHT_VH}vh` }}
    >
      <div className="nova-projects-pin">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-6 pb-10 pt-16 sm:px-10 lg:px-14 lg:pt-20">
          <ProjectsHeader />
          <p className="mt-4 max-w-2xl text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
            Scroll to explore digital experiences that push the boundaries of web design &amp; automation.
          </p>

          <div ref={stageRef} className="nova-projects-stage relative mx-auto mt-10 w-full max-w-5xl flex-1">
            {projects.map((p, i) => (
              <ScrollProjectCard
                key={p.name}
                project={p}
                index={i}
                slideProgress={slideProgress}
                stageWidth={stageWidth}
                total={projects.length}
              />
            ))}
          </div>

          <ProjectScrollIndicator slideProgress={slideProgress} total={projects.length} />
        </div>
      </div>
    </section>
  );
}

