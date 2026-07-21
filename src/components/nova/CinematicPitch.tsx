import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence, type Variants } from "framer-motion";
import { CONTACT_EMAIL } from "@/lib/site";

const QUESTION = "HAVE A MESSY BUSINESS PROCESS?";
const SOLUTION_LEAD = ["WE", "CAN", "TURN", "IT", "INTO", "A"];
const SOLUTION_HERO = ["CLEAN", "DIGITAL", "SYSTEM."];
const BODY =
  "From missed messages to manual spreadsheets, Solupair helps turn everyday operational friction into smooth digital workflows.";

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)", scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      delay: i * 0.09,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function TypeLine({
  text,
  active,
  showCursor,
  className,
  onDone,
}: {
  text: string;
  active: boolean;
  showCursor: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setCount(text.length);
      onDoneRef.current?.();
      return;
    }
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, 38);
    return () => window.clearInterval(id);
  }, [active, text, reduceMotion]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCursor && active ? <span className="nova-cinema-cursor" aria-hidden /> : null}
    </span>
  );
}

/** Blockbuster question → solution reveal before the contact form. */
export function CinematicPitch() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "question" | "beat" | "solution" | "rest">("idle");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    setPhase(reduceMotion ? "rest" : "question");
  }, [inView, phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "beat") return;
    const t = window.setTimeout(() => setPhase("solution"), reduceMotion ? 0 : 480);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "solution") return;
    const t = window.setTimeout(() => setPhase("rest"), reduceMotion ? 0 : 1500);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  const showSolution = phase === "solution" || phase === "rest";
  const showRest = phase === "rest";
  const questionActive = phase === "question" || phase === "beat" || showSolution;

  return (
    <section
      aria-label="Solupair pitch"
      className="nova-cinema relative z-[1] flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24 sm:px-10 lg:px-14"
    >
      <div aria-hidden className="nova-cinema-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="nova-cinema-grain pointer-events-none absolute inset-0" />
      <div aria-hidden className="nova-cinema-flare pointer-events-none absolute inset-0" />

      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center"
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.55em" }}
          animate={inView ? { opacity: 0.5, letterSpacing: "0.3em" } : undefined}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-[10px] font-semibold uppercase text-foreground/50 sm:text-[11px]"
        >
          Solupair · Digital systems
        </motion.p>

        <h2 className="font-display font-black uppercase leading-[0.95] tracking-tighter text-foreground">
          <span className="block" style={{ fontSize: "clamp(1.45rem, 4.8vw, 3.35rem)" }}>
            {reduceMotion ? (
              QUESTION
            ) : (
              <>
                <TypeLine
                  text={QUESTION}
                  active={questionActive}
                  showCursor={phase === "question"}
                  onDone={() => {
                    setPhase((p) => (p === "question" ? "beat" : p));
                  }}
                />
                {phase === "beat" ? <span className="nova-cinema-cursor" aria-hidden /> : null}
              </>
            )}
          </span>

          <span className="mt-3 block sm:mt-5" style={{ fontSize: "clamp(1.45rem, 4.8vw, 3.35rem)" }}>
            <AnimatePresence>
              {showSolution || reduceMotion ? (
                <motion.span
                  key="solution"
                  className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1"
                  initial="hidden"
                  animate="show"
                >
                  {SOLUTION_LEAD.map((word, i) => (
                    <motion.span
                      key={`lead-${word}-${i}`}
                      custom={reduceMotion ? 0 : i}
                      variants={wordVariants}
                      className="inline-block text-foreground"
                    >
                      {word}
                    </motion.span>
                  ))}
                  {SOLUTION_HERO.map((word, i) => (
                    <motion.span
                      key={`hero-${word}-${i}`}
                      custom={reduceMotion ? 0 : SOLUTION_LEAD.length + i}
                      variants={wordVariants}
                      className="nova-cinema-hero-word inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              ) : (
                <span className="invisible inline-block" aria-hidden>
                  WE CAN TURN IT INTO A CLEAN DIGITAL SYSTEM.
                </span>
              )}
            </AnimatePresence>
          </span>
        </h2>

        <motion.p
          initial={false}
          animate={
            showRest || reduceMotion
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(10px)" }
          }
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.12 }}
          className="mt-8 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base"
        >
          {BODY}
        </motion.p>

        <motion.div
          initial={false}
          animate={
            showRest || reduceMotion
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.28 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <a href="#contact-form" className="nova-cinema-cta group relative inline-flex">
            <span className="nova-cinema-cta-glow" aria-hidden />
            <span className="relative z-[1] inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--primary-foreground)] sm:px-10 sm:text-xs">
              Start with a quick message
            </span>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs text-foreground/55 transition hover:text-[var(--solupair-cyan)] sm:text-sm"
          >
            Or email {CONTACT_EMAIL}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
