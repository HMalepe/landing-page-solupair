import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
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
const SOLUTION_HERO = "CLEAN DIGITAL SYSTEM.";
const BODY_PHRASES = [
  "From missed messages to manual spreadsheets,",
  "Solupair helps turn everyday operational friction",
  "into smooth digital workflows.",
] as const;

/** Soft cinematic ease — story beats, not snaps */
const EASE = [0.16, 1, 0.3, 1] as const;
const TYPE_MS = 72;
const BEAT_MS = 780;
const LEAD_STAGGER = 0.16;
const LEAD_MS = 0.72;
const LETTER_STAGGER = 0.05;
const LETTER_MS = 0.82;
const WORD_STAGGER = 0.058;
const WORD_MS = 0.64;
const BODY_LINE_GAP = 0.28;
const HERO_LEAD_GAP = 0.28;

const leadWordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * LEAD_STAGGER,
      duration: LEAD_MS,
      ease: EASE,
    },
  }),
};

const accentLetterVariants: Variants = {
  hidden: { opacity: 0, y: "0.62em", scale: 0.86 },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    scale: 1,
    transition: {
      delay: i * LETTER_STAGGER,
      duration: LETTER_MS,
      ease: EASE,
    },
  }),
};

const supportWordVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * WORD_STAGGER,
      duration: WORD_MS,
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

function AccentLetterLine({
  text,
  play,
  reduceMotion,
  sheen,
  onDone,
}: {
  text: string;
  play: boolean;
  reduceMotion: boolean;
  sheen: boolean;
  onDone?: () => void;
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const durationMs = Math.round(((chars.length - 1) * LETTER_STAGGER + LETTER_MS) * 1000) + 60;

  useEffect(() => {
    doneRef.current = false;
  }, [play, text]);

  useEffect(() => {
    if (!play) return;
    if (reduceMotion) {
      onDoneRef.current?.();
      return;
    }
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDoneRef.current?.();
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [play, reduceMotion, durationMs]);

  if (!play && !reduceMotion) {
    return <span className="invisible">{text}</span>;
  }

  return (
    <span
      className={`final-cta-answer__accent final-cta-answer__accent--line inline-block${
        sheen ? " is-sheen" : ""
      }`}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={reduceMotion ? 0 : i}
          variants={accentLetterVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className={
            char === " "
              ? "final-cta-answer__accent-letter final-cta-answer__accent-letter--space inline-block"
              : "final-cta-answer__accent-letter inline-block"
          }
          aria-hidden
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function SupportStory({
  active,
  reduceMotion,
  onDone,
}: {
  active: boolean;
  reduceMotion: boolean;
  onDone?: () => void;
}) {
  const flat = useMemo(() => {
    const words: { word: string; line: number; index: number }[] = [];
    let index = 0;
    BODY_PHRASES.forEach((phrase, line) => {
      phrase.split(/\s+/).forEach((word) => {
        words.push({ word, line, index });
        index += 1;
      });
      index += Math.round(BODY_LINE_GAP / WORD_STAGGER);
    });
    return words;
  }, []);

  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const lastIndex = flat[flat.length - 1]?.index ?? 0;
  const totalMs = Math.round((lastIndex * WORD_STAGGER + WORD_MS) * 1000) + 200;

  useEffect(() => {
    doneRef.current = false;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      onDoneRef.current?.();
      return;
    }
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDoneRef.current?.();
    }, totalMs);
    return () => window.clearTimeout(t);
  }, [active, reduceMotion, totalMs]);

  return (
    <span aria-hidden className="inline-flex flex-col items-center gap-1 sm:gap-1.5">
      {BODY_PHRASES.map((phrase, line) => (
        <span key={phrase} className="final-cta-support-line block">
          {flat
            .filter((item) => item.line === line)
            .map(({ word, index }) => (
              <motion.span
                key={`${line}-${word}-${index}`}
                custom={reduceMotion ? 0 : index}
                variants={supportWordVariants}
                initial={reduceMotion ? false : "hidden"}
                animate={active || reduceMotion ? "show" : "hidden"}
                className="final-cta-support-word inline-block"
              >
                {word}
                {"\u00A0"}
              </motion.span>
            ))}
        </span>
      ))}
    </span>
  );
}

type PitchPhase = "idle" | "question" | "beat" | "solution" | "hero" | "body" | "rest";

export function FinalCtaSection() {
  const { sectionRef, sectionInView } = useSectionInView();
  const { prefersReducedMotion } = useDeviceProfile();
  const reduceMotion = !!(useReducedMotion() || prefersReducedMotion);
  const [phase, setPhase] = useState<PitchPhase>("idle");
  const [accentSheen, setAccentSheen] = useState(false);

  useEffect(() => {
    if (!sectionInView || phase !== "idle") return;
    setPhase(reduceMotion ? "rest" : "question");
  }, [sectionInView, phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "beat") return;
    const t = window.setTimeout(() => setPhase("solution"), reduceMotion ? 0 : BEAT_MS);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  // After lead words land, start the letter spectacle.
  useEffect(() => {
    if (phase !== "solution") return;
    if (reduceMotion) {
      setPhase("rest");
      setAccentSheen(true);
      return;
    }
    const leadMs = Math.round((SOLUTION_LEAD.length * LEAD_STAGGER + LEAD_MS + HERO_LEAD_GAP) * 1000);
    const t = window.setTimeout(() => setPhase("hero"), leadMs);
    return () => window.clearTimeout(t);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase === "idle") setAccentSheen(false);
    if (phase === "rest" && reduceMotion) setAccentSheen(true);
  }, [phase, reduceMotion]);

  const showSolution =
    phase === "solution" || phase === "hero" || phase === "body" || phase === "rest";
  const playHero = phase === "hero" || phase === "body" || phase === "rest";
  const showBody = phase === "body" || phase === "rest";
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

        <h2
          id="final-cta-heading"
          className="final-cta-question font-display font-black uppercase tracking-tighter text-foreground"
        >
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

        <div className="final-cta-answer font-display font-black uppercase tracking-tighter">
          <span className="sr-only">We can turn it into a clean digital system.</span>
          <span aria-hidden className="block">
            <AnimatePresence>
              {showSolution || reduceMotion ? (
                <motion.span
                  key="solution"
                  className="flex flex-col items-center gap-y-1 sm:gap-y-2"
                  initial="hidden"
                  animate="show"
                >
                  <span className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1 text-foreground">
                    {SOLUTION_LEAD.map((word, i) => (
                      <motion.span
                        key={`lead-${word}`}
                        custom={reduceMotion ? 0 : i}
                        variants={leadWordVariants}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>

                  <span className="relative inline-block">
                    <AccentLetterLine
                      text={SOLUTION_HERO}
                      play={playHero || reduceMotion}
                      reduceMotion={reduceMotion}
                      sheen={accentSheen}
                      onDone={() => {
                        setAccentSheen(true);
                        setPhase((p) => (p === "hero" ? "body" : p));
                      }}
                    />
                  </span>
                </motion.span>
              ) : (
                <span className="invisible inline-block">
                  WE CAN TURN IT INTO A CLEAN DIGITAL SYSTEM.
                </span>
              )}
            </AnimatePresence>
          </span>
        </div>

        <div className="final-cta-support relative min-h-[4.8em]">
          <span className="sr-only">{BODY_PHRASES.join(" ")}</span>
          {(showBody || reduceMotion) && (
            <SupportStory
              active={showBody || reduceMotion}
              reduceMotion={reduceMotion}
              onDone={() => {
                setPhase((p) => (p === "body" ? "rest" : p));
              }}
            />
          )}
        </div>

        <motion.div
          className="final-cta-actions"
          initial={false}
          animate={
            showRest || reduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 14 }
          }
          transition={{ duration: 0.85, ease: EASE, delay: reduceMotion ? 0 : 0.08 }}
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
