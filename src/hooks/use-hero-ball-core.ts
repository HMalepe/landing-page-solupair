import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import {
  getHeroBallDiameter,
  getPreferredDiameter,
  MAX_DIAMETER,
  MIN_DIAMETER,
} from "@/lib/hero-ball-entrance";
import {
  getSectionBallBounds,
  type PhysicsBallState,
  type PhysicsBounds,
  type PointerSample,
} from "@/lib/ball-physics";
import { clamp, IMPACT_SQUASH } from "@/lib/hero-ball-config";

export type Phase = "entering" | "ambient" | "simulating";
export type CyclePhase = "live" | "fading-out" | "dormant" | "fading-in";

export type HeroBallCoreInput = {
  groundRef: RefObject<HTMLElement | null>;
  prefersReducedMotion: boolean;
  isPhone: boolean;
  scrollY: MotionValue<number>;
  heroProgress: MotionValue<number>;
  /** True while the hero section is scrolled into the viewport. */
  heroInView: boolean;
};

/**
 * Shared foundation for the hero face-ball: the 14 motion channels, every ref
 * the loops mutate, the phase/cycle state machine, and the low-level helpers
 * that more than one loop needs. The behaviour hooks (entrance, simulation,
 * ambient cycle, choreography, visuals) all read from this one object so the
 * mutable state stays single-sourced — exactly as it was inline.
 */
export function useHeroBallCore({
  groundRef,
  prefersReducedMotion,
  isPhone,
  scrollY,
  heroProgress,
  heroInView,
}: HeroBallCoreInput) {
  const ballRef = useRef<HTMLDivElement>(null);
  const playfieldRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>(prefersReducedMotion ? "ambient" : "entering");
  const phaseRef = useRef<Phase>(prefersReducedMotion ? "ambient" : "entering");
  const cycleRef = useRef<CyclePhase>("live");
  const [diameter, setDiameter] = useState(() => getPreferredDiameter());
  const [faceReveal, setFaceReveal] = useState(prefersReducedMotion ? 1 : 0);

  // Roll angle drives the rolling highlight — a MotionValue so per-frame updates
  // never trigger a React re-render (that was a source of entrance-motion jank).
  const rollAngle = useMotionValue(0);
  const isHoveringRef = useRef(false);
  const entranceStartedRef = useRef(false);
  const restSinceRef = useRef<number | null>(null);
  // The opening flight smiles once it settles; ambient reappears smile on
  // blur-in instead, so their bounce settle must NOT re-trigger a rest smile.
  const smileOnRestRef = useRef(false);
  const dormantTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  /** -1 left / 1 right / 0 none — keeps the contact edge pinned while squashed. */
  const contactPinX = useMotionValue(0);
  /** -1 top / 1 bottom / 0 none */
  const contactPinY = useMotionValue(0);
  const entranceSmile = useMotionValue(prefersReducedMotion ? 1 : 0);
  const ballPresence = useMotionValue(1);
  const squashValue = useMotionValue(1);
  const squashAxis = useMotionValue(0); // 0 = vertical impact, 1 = horizontal
  const floorProximity = useMotionValue(0.55);
  const speedNorm = useMotionValue(0);
  const airStretchX = useMotionValue(1);
  const airStretchY = useMotionValue(1);
  const settleBreath = useMotionValue(1);

  const stateRef = useRef<PhysicsBallState>({ x: 0, y: 0, vx: 0, vy: 0 });
  const draggingRef = useRef(false);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerSamplesRef = useRef<PointerSample[]>([]);
  const radiusRef = useRef(diameter / 2);
  const rollAngleRef = useRef(0);
  const squashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHitAtRef = useRef(0);

  const readSectionBounds = useCallback(() => {
    // Walls = the browser chrome edges (user marks), never logo/nav inset.
    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    const width = Math.round(vv?.width ?? window?.innerWidth ?? 0);
    const height = Math.round(vv?.height ?? window?.innerHeight ?? 0);
    const bounds = getSectionBallBounds(width, height, radiusRef.current, 0);
    return { width, height, bounds };
  }, []);

  const fitDiameter = useCallback(
    (preferred: number) => {
      const { width, height } = readSectionBounds();
      if (width <= 0 || height <= 0) return clamp(preferred, MIN_DIAMETER, MAX_DIAMETER);
      return clamp(getHeroBallDiameter(width, height, preferred), MIN_DIAMETER, MAX_DIAMETER);
    },
    [readSectionBounds],
  );

  const applyImpactSquash = useCallback(
    (horizontal: boolean, alsoVertical: boolean, speed = 900) => {
      const now = performance.now();
      if (now - lastHitAtRef.current < 70) return;
      lastHitAtRef.current = now;

      const intensity = clamp(speed / 1800, 0.55, 1);
      const squash = 1 - (1 - IMPACT_SQUASH) * intensity;

      if (horizontal && alsoVertical) squashAxis.set(0.5);
      else squashAxis.set(horizontal ? 1 : 0);
      squashValue.set(squash);

      if (squashTimerRef.current) clearTimeout(squashTimerRef.current);
      squashTimerRef.current = setTimeout(() => {
        squashValue.set(1);
        squashTimerRef.current = null;
      }, 180);
    },
    [squashAxis, squashValue],
  );

  const syncFlightDeform = useCallback(
    (vx: number, vy: number, hitting: boolean) => {
      if (hitting) {
        airStretchX.set(1);
        airStretchY.set(1);
        return;
      }
      const speed = Math.hypot(vx, vy);
      const t = clamp(speed / 1400, 0, 1);
      // Whisper of flight stretch — expensive, not cartoon.
      const along = 1 + t * 0.045;
      const across = 1 - t * 0.032;
      if (Math.abs(vx) >= Math.abs(vy)) {
        airStretchX.set(along);
        airStretchY.set(across);
      } else {
        airStretchX.set(across);
        airStretchY.set(along);
      }
      speedNorm.set(t);
    },
    [airStretchX, airStretchY, speedNorm],
  );

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearDormantTimer = useCallback(() => {
    if (dormantTimerRef.current) {
      clearTimeout(dormantTimerRef.current);
      dormantTimerRef.current = null;
    }
  }, []);

  const stopFade = useCallback(() => {
    fadeControlsRef.current?.stop();
    fadeControlsRef.current = null;
  }, []);

  useEffect(() => {
    radiusRef.current = diameter / 2;
  }, [diameter]);

  useEffect(() => {
    return () => {
      if (squashTimerRef.current) clearTimeout(squashTimerRef.current);
    };
  }, []);

  return {
    // inputs
    groundRef,
    prefersReducedMotion,
    isPhone,
    scrollY,
    heroProgress,
    heroInView,
    // element refs
    ballRef,
    playfieldRef,
    // state + setters
    phase,
    setPhase,
    diameter,
    setDiameter,
    faceReveal,
    setFaceReveal,
    phaseRef,
    cycleRef,
    // motion channels
    rollAngle,
    posX,
    posY,
    contactPinX,
    contactPinY,
    entranceSmile,
    ballPresence,
    squashValue,
    squashAxis,
    floorProximity,
    speedNorm,
    airStretchX,
    airStretchY,
    settleBreath,
    // bookkeeping refs
    isHoveringRef,
    entranceStartedRef,
    restSinceRef,
    smileOnRestRef,
    dormantTimerRef,
    fadeControlsRef,
    stateRef,
    draggingRef,
    pointerRef,
    pointerSamplesRef,
    radiusRef,
    rollAngleRef,
    squashTimerRef,
    lastHitAtRef,
    // shared helpers
    readSectionBounds,
    fitDiameter,
    applyImpactSquash,
    syncFlightDeform,
    setPhaseSafe,
    clearDormantTimer,
    stopFade,
  };
}

export type HeroBallCore = ReturnType<typeof useHeroBallCore>;
export type SectionBoundsReader = () => { width: number; height: number; bounds: PhysicsBounds };
export type { Dispatch, SetStateAction };
