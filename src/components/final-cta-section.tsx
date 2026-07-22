import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useDeviceProfile } from "@/hooks/use-device-profile";
import { useSectionInView } from "@/hooks/use-section-in-view";
import { CONTACT_EMAIL } from "@/lib/site";
import { navigateToSection } from "@/lib/section-nav";

const QUESTION = "HAVE A MESSY BUSINESS PROCESS?";
const SOLUTION_LEAD = ["WE", "CAN", "TURN", "IT", "INTO", "A"] as const;
const SOLUTION_HERO = ["CLEAN", "DIGITAL", "SYSTEM."] as const;
const BODY_PHRASES = [
  "From missed messages to manual spreadsheets,",
  "Solupair helps turn everyday operational friction",
  "into smooth digital workflows.",
] as const;

/** Cinematic blockbuster ease — slow attack, soft settle */
const EASE = [0.16, 1, 0.3, 1] as const;
const WORD_MS = 0.92;
const WORD_STAGGER = 0.2;
const HERO_WORD_MS = 1.05;
const HERO_STAGGER = 0.28;
const PHRASE_MS = 0.85;
const PHRASE_STAGGER = 0.32;
const TYPE_MS = 78;
const BEAT_MS = 920;
const SOLUTION_HOLD_MS = 2600;

const leadWordVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)", scale: 0.94 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      delay: i * WORD_STAGGER,
      duration: WORD_MS,
      ease: EASE,
    },
  }),
};

const heroWordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(14px)",
    scale: 0.9,
    letterSpacing: "0.08em",
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    letterSpacing: "-0.02em",
    transition: {
      delay: SOLUTION_LEAD.length * WORD_STAGGER + 0.18 + i * HERO_STAGGER,
      duration: HERO_WORD_MS,
      ease: EASE,
    },
  }),
};

const phraseVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * PHRASE_STAGGER,
      duration: PHRASE_MS,
      ease: EASE,
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
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [active, text, reduceMotion]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCursor && active ? <span className="final-cta-cursor" aria-hidden /> : null}
    </span>
  );
}

type PitchPhase = "idle" | "question" | "beat" | "solution" | "rest";

export function FinalCtaSection() {
  const { sectionRef, sectionInView } = useSectionInView();
  const { prefersReducedMotion } = useDeviceProfile();
  const reduceMotion = useReducedMotion() || prefersReducedMotion;
  const [phase, setPhase] = useState<PitchPhase>("idle");

  useEffect(() => {
    if (!sectionInView || phase !== "idle") return;
    setPhase(reduceMotion ? "rest" : "question");
  }, [sectionInView, phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "beat") return;
    const t = window.setTimeout(() => setPhase("solution"), reduceMotion ? 0 : BEAT_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "solution") return;
    const t = window.setTimeout(() => setPhase("rest"), reduceMotion ? 0 : SOLUTION_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  const showSolution = phase === "solution" || phase === "rest";
  const showRest = phase === "rest";
  const questionActive = phase === "question" || phase === "beat" || showSolution;

  const goToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSection("contact", prefersReducedMotion);
  };

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      data-scroll-snap="cta"
      aria-labelledby="final-cta-heading"
      className={`final-cta safe-area-x section-surface snap-section-anchor relative isolate flex flex-col items-center justify-center overflow-x-clip px-4 py-20 sm:px-10 sm:py-28 lg:px-14 lg:py-32${sectionInView ? " final-cta-in-view" : ""}`}
    >
      <div className="final-cta-glow final-cta-glow--cyan" aria-hidden />
      <div className="final-cta-glow final-cta-glow--magenta" aria-hidden />
      <div className="final-cta-glow final-cta-glow--purple" aria-hidden />
      <div className="final-cta-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="final-cta-content relative z-10 mx-auto w-full max-w-4xl text-center">
        <motion.p
          className="final-cta-kicker"
          initial={{ opacity: 0, letterSpacing: "0.42em", y: 10 }}
          animate={
            sectionInView
              ? { opacity: 0.55, letterSpacing: "0.22em", y: 0 }
              : { opacity: 0, letterSpacing: "0.42em", y: 10 }
          }
          transition={{ duration: 1.15, ease: EASE }}
        >
          Solupair · Digital systems
        </motion.p>

        <h2 id="final-cta-heading" className="final-cta-question font-display font-black uppercase tracking-tighter text-foreground">
          <span className="sr-only">{QUESTION}</span>
          <span aria-hidden className="block">
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
                {phase === "beat" ? <span className="final-cta-cursor" aria-hidden /> : null}
              </>
            )}
          </span>
        </h2>

        <p className="final-cta-answer font-display font-black uppercase tracking-tighter">
          <span className="sr-only">
            We can turn it into a clean digital system.
          </span>
          <span aria-hidden className="block">
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
                      key={`lead-${word}`}
                      custom={reduceMotion ? 0 : i}
                      variants={leadWordVariants}
                      className="inline-block text-foreground"
                    >
                      {word}
                    </motion.span>
                  ))}
                  {SOLUTION_HERO.map((word, i) => (
                    <motion.span
                      key={`hero-${word}`}
                      custom={reduceMotion ? 0 : i}
                      variants={heroWordVariants}
                      className="final-cta-answer__accent final-cta-answer__accent--blockbuster inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              ) : (
                <span className="invisible inline-block">
                  WE CAN TURN IT INTO A CLEAN DIGITAL SYSTEM.
                </span>
              )}
            </AnimatePresence>
          </span>
        </p>

        <motion.p
          className="final-cta-support"
          initial="hidden"
          animate={showRest || reduceMotion ? "show" : "hidden"}
        >
          <span className="sr-only">{BODY_PHRASES.join(" ")}</span>
          <span aria-hidden className="inline-flex flex-col items-center gap-1 sm:gap-1.5">
            {BODY_PHRASES.map((phrase, i) => (
              <motion.span
                key={phrase}
                custom={reduceMotion ? 0 : i}
                variants={phraseVariants}
                className="block"
              >
                {phrase}
              </motion.span>
            ))}
          </span>
        </motion.p>

        <motion.div
          className="final-cta-actions"
          initial={false}
          animate={
            showRest || reduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.9, ease: EASE, delay: reduceMotion ? 0 : 0.35 }}
        >
          <a
            href="#contact"
            onClick={goToContact}
            className="final-cta-btn hero-btn hero-btn--primary touch-target"
          >
            <span>Start with a quick message</span>
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="final-cta-email">
            Or email {CONTACT_EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
