import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BallSphere } from "@/components/ball-sphere";
import { useDeviceProfile } from "@/hooks/use-device-profile";
import {
  AMBIENT_CYCLE,
  AMBIENT_PHYSICS,
  ambientNextLoftImpulse,
  nextDormantMs,
  pickAmbientSpawn,
} from "@/lib/hero-ball-ambient-cycle";
import {
  ENTRANCE_PHYSICS,
  getEntranceInitialState,
  getEntranceMaxDurationMs,
  getHeroBallDiameter,
  HERO_BALL_PHYSICS,
  HERO_BALL_SIZE_SCALE,
  rollDeltaFromMotion,
} from "@/lib/hero-ball-entrance";
import {
  BALL_SHADOW,
  BALL_SURFACE,
  computeThrowVelocity,
  getSectionBallBounds,
  stepBasketballPhysics,
  type PhysicsBallState,
  type PointerSample,
} from "@/lib/ball-physics";

type Phase = "entering" | "ambient" | "simulating";
type CyclePhase = "live" | "fading-out" | "dormant" | "fading-in";

const MIN_DIAMETER = Math.round(100 * HERO_BALL_SIZE_SCALE);
const MAX_DIAMETER = Math.round(480 * HERO_BALL_SIZE_SCALE);
const IMPACT_SQUASH = 0.78;
/** Expensive rubber — soft attack, gentle overshoot, quick settle. */
const SQUASH_SPRING = { stiffness: 320, damping: 18, mass: 0.85 } as const;
const SHADOW_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
const TRAIL_SPRING = { stiffness: 90, damping: 22, mass: 0.95 } as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isMobileHeroLayout() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function getPreferredDiameter() {
  if (typeof window === "undefined") return Math.round(220 * HERO_BALL_SIZE_SCALE);
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return Math.round(320 * HERO_BALL_SIZE_SCALE);
  }
  if (window.matchMedia("(min-width: 768px)").matches) {
    return Math.round(280 * HERO_BALL_SIZE_SCALE);
  }
  if (isMobileHeroLayout()) {
    return Math.round(180 * HERO_BALL_SIZE_SCALE);
  }
  return Math.round(200 * HERO_BALL_SIZE_SCALE);
}

export function HeroFaceBall({
  groundRef,
}: {
  groundRef: RefObject<HTMLElement | null>;
}) {
  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: groundRef,
    offset: ["start start", "end start"],
  });
  const { prefersReducedMotion, isPhone } = useDeviceProfile();
  const ballRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(prefersReducedMotion ? "ambient" : "entering");
  const phaseRef = useRef<Phase>(prefersReducedMotion ? "ambient" : "entering");
  const cycleRef = useRef<CyclePhase>("live");
  const [diameter, setDiameter] = useState(() => getPreferredDiameter());
  const [faceReveal, setFaceReveal] = useState(prefersReducedMotion ? 1 : 0);
  const [faceHint, setFaceHint] = useState(0);
  const [rollAngle, setRollAngle] = useState(0);
  const isHoveringRef = useRef(false);
  const entranceStartedRef = useRef(false);
  const restSinceRef = useRef<number | null>(null);
  const dormantTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  /** -1 left / 1 right / 0 none — keeps the contact edge pinned while squashed. */
  const contactPinX = useMotionValue(0);
  /** -1 top / 1 bottom / 0 none */
  const contactPinY = useMotionValue(0);
  const playfieldRef = useRef<HTMLDivElement>(null);
  const entranceSmile = useMotionValue(prefersReducedMotion ? 1 : 0);
  const ballPresence = useMotionValue(1);
  const squashValue = useMotionValue(1);
  const squashAxis = useMotionValue(0); // 0 = vertical impact, 1 = horizontal
  const squashX = useSpring(
    useTransform([squashValue, squashAxis], ([v, axis]) => {
      const amount = Number(v);
      const a = Number(axis);
      // Horizontal hit → compress X, stretch Y; vertical hit → opposite.
      return a > 0.5 ? amount : 2 - amount;
    }),
    SQUASH_SPRING,
  );
  const squashY = useSpring(
    useTransform([squashValue, squashAxis], ([v, axis]) => {
      const amount = Number(v);
      const a = Number(axis);
      return a > 0.5 ? 2 - amount : amount;
    }),
    SQUASH_SPRING,
  );
  const floorProximity = useMotionValue(0.55);
  const speedNorm = useMotionValue(0);
  const airStretchX = useMotionValue(1);
  const airStretchY = useMotionValue(1);
  const glowTrailX = useSpring(posX, TRAIL_SPRING);
  const glowTrailY = useSpring(posY, TRAIL_SPRING);
  const shadowLagX = useSpring(posX, { stiffness: 160, damping: 30, mass: 0.85 });
  const contactShadowScale = useSpring(
    useTransform(floorProximity, [0, 1], [0.42, 1.48]),
    SHADOW_SPRING,
  );
  const contactShadowOpacity = useSpring(
    useTransform(floorProximity, [0, 1], [0.06, 0.62]),
    SHADOW_SPRING,
  );
  const contactShadowScaleY = useTransform(contactShadowScale, (v) => 0.48 + Number(v) * 0.24);
  const contactShadowBlur = useTransform(floorProximity, [0, 1], [22, 8]);
  const settleBreath = useMotionValue(1);
  const settleBreathSpring = useSpring(settleBreath, { stiffness: 90, damping: 14, mass: 1 });

  const composedScaleX = useSpring(
    useTransform(
      [squashX, airStretchX, settleBreathSpring],
      ([sq, air, breath]) => Number(sq) * Number(air) * Number(breath),
    ),
    { stiffness: 220, damping: 26, mass: 0.65 },
  );
  const composedScaleY = useSpring(
    useTransform(
      [squashY, airStretchY, settleBreathSpring],
      ([sq, air, breath]) => Number(sq) * Number(air) * (2 - Number(breath)),
    ),
    { stiffness: 220, damping: 26, mass: 0.65 },
  );

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

  const fitDiameter = useCallback((preferred: number) => {
    const { width, height } = readSectionBounds();
    if (width <= 0 || height <= 0) return clamp(preferred, MIN_DIAMETER, MAX_DIAMETER);
    return clamp(getHeroBallDiameter(width, height, preferred), MIN_DIAMETER, MAX_DIAMETER);
  }, [readSectionBounds]);

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

  useEffect(() => {
    radiusRef.current = diameter / 2;
  }, [diameter]);

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

  const interruptCycle = useCallback(() => {
    stopFade();
    clearDormantTimer();
    cycleRef.current = "live";
    restSinceRef.current = null;
    ballPresence.set(1);
    settleBreath.set(1);
  }, [ballPresence, clearDormantTimer, settleBreath, stopFade]);

  const softRespawnAmbient = useCallback(() => {
    const { bounds } = readSectionBounds();
    if (bounds.maxX <= bounds.minX) return;

    const spawn = pickAmbientSpawn(bounds);

    // Still in the air — gravity starts the drop once the cycle goes live.
    settleBreath.set(1);
    squashAxis.set(0);
    squashValue.set(1);
    speedNorm.set(0);
    airStretchX.set(1);
    airStretchY.set(1);
    stateRef.current = { ...spawn, vx: 0, vy: 0 };
    posX.set(spawn.x);
    posY.set(spawn.y);
    restSinceRef.current = null;
    setPhaseSafe("ambient");
  }, [
    airStretchX,
    airStretchY,
    posX,
    posY,
    readSectionBounds,
    setPhaseSafe,
    settleBreath,
    speedNorm,
    squashAxis,
    squashValue,
  ]);

  const beginFadeOut = useCallback(() => {
    if (cycleRef.current !== "live") return;
    if (phaseRef.current === "entering") return;

    const parked = stateRef.current;
    stateRef.current = { x: parked.x, y: parked.y, vx: 0, vy: 0 };
    posX.set(parked.x);
    posY.set(parked.y);
    settleBreath.set(1);
    speedNorm.set(0);
    airStretchX.set(1);
    airStretchY.set(1);
    setPhaseSafe("ambient");

    cycleRef.current = "fading-out";
    restSinceRef.current = null;

    fadeControlsRef.current = animate(ballPresence, 0, {
      duration: AMBIENT_CYCLE.fadeOutMs / 1000,
      // Slow, even dissolve — no snap at the end.
      ease: [0.33, 0.0, 0.2, 1],
    });

    void fadeControlsRef.current.then(() => {
      if (cycleRef.current !== "fading-out") return;

      cycleRef.current = "dormant";
      clearDormantTimer();
      dormantTimerRef.current = setTimeout(() => {
        if (cycleRef.current !== "dormant") return;

        cycleRef.current = "fading-in";
        softRespawnAmbient();
        // Hidden until it settles again — no face while it's mid-flight.
        setFaceReveal(0);
        setFaceHint(0);
        entranceSmile.set(0);
        ballPresence.set(0);

        const { bounds: respawnBounds } = readSectionBounds();
        if (respawnBounds.maxX > respawnBounds.minX) {
          stateRef.current = {
            ...stateRef.current,
            ...ambientNextLoftImpulse(respawnBounds, stateRef.current.x),
          };
        }

        fadeControlsRef.current = animate(ballPresence, 1, {
          duration: AMBIENT_CYCLE.fadeInMs / 1000,
          ease: [0.22, 1, 0.36, 1],
        });

        void fadeControlsRef.current.then(() => {
          if (cycleRef.current !== "fading-in") return;
          restSinceRef.current = null;
          cycleRef.current = "live";
        });
      }, nextDormantMs());
    });
  }, [
    airStretchX,
    airStretchY,
    ballPresence,
    clearDormantTimer,
    entranceSmile,
    posX,
    posY,
    readSectionBounds,
    setPhaseSafe,
    settleBreath,
    softRespawnAmbient,
    speedNorm,
  ]);

  /**
   * Entrance flight ends wherever it naturally comes to rest — no teleport.
   * `keepMomentum` hands current velocity to the ambient loop when the
   * flight is cut off by the max-duration timer while still moving —
   * zeroing it there would kill horizontal motion and leave a vertical-only
   * bounce for the rest of the ambient loop.
   */
  const finishEntrance = useCallback(
    (keepMomentum = false) => {
      const nextDiameter = fitDiameter(getPreferredDiameter());
      setDiameter(nextDiameter);
      radiusRef.current = nextDiameter / 2;
      squashValue.set(1);
      if (!keepMomentum) {
        stateRef.current = { ...stateRef.current, vx: 0, vy: 0 };
      }
      restSinceRef.current = null;
      setPhaseSafe("ambient");
      cycleRef.current = "live";
    },
    [fitDiameter, setPhaseSafe, squashValue],
  );

  useEffect(() => {
    if (prefersReducedMotion || entranceStartedRef.current) return;
    entranceStartedRef.current = true;

    let raf = 0;
    let cancelled = false;
    let last = performance.now();
    const startTime = performance.now();
    const maxDuration = getEntranceMaxDurationMs(isPhone);
    const preferred = getPreferredDiameter();

    const boot = () => {
      if (cancelled) return;
      const { width, height } = readSectionBounds();
      if (width <= 0 || height <= 0) {
        raf = requestAnimationFrame(boot);
        return;
      }

      const baseDiameter = fitDiameter(preferred);
      const entranceDiameter = baseDiameter * 0.92;
      setDiameter(entranceDiameter);
      radiusRef.current = entranceDiameter / 2;

      const initial = getEntranceInitialState(width, height, radiusRef.current);
      stateRef.current = initial;
      posX.set(initial.x);
      posY.set(initial.y);
      rollAngleRef.current = 0;
      setRollAngle(0);
      setPhaseSafe("entering");

      const tick = (now: number) => {
        if (cancelled || phaseRef.current !== "entering") return;

        if (now - startTime > maxDuration) {
          finishEntrance(true);
          return;
        }

        const dt = Math.min(now - last, 24);
        last = now;

        const { bounds } = readSectionBounds();
        const prev = stateRef.current;
        const result = stepBasketballPhysics(prev, ENTRANCE_PHYSICS, bounds, dt, {
          isDragging: false,
        });

        const dx = result.x - prev.x;
        const dy = result.y - prev.y;
        rollAngleRef.current += rollDeltaFromMotion(dx, dy, radiusRef.current);
        setRollAngle(rollAngleRef.current);

        const hitHorizontal = result.hitLeft || result.hitRight;
        const hitVertical = result.hitTop || result.hitBottom;
        const hit = hitHorizontal || hitVertical;
        if (hit) {
          applyImpactSquash(hitHorizontal, hitVertical, Math.hypot(prev.vx, prev.vy));
        }
        syncFlightDeform(result.vx, result.vy, hit);

        if (result.hitLeft || result.x <= bounds.minX + 0.75) contactPinX.set(-1);
        else if (result.hitRight || result.x >= bounds.maxX - 0.75) contactPinX.set(1);
        else contactPinX.set(0);

        if (result.hitTop || result.y <= bounds.minY + 0.75) contactPinY.set(-1);
        else if (result.hitBottom || result.y >= bounds.maxY - 0.75) contactPinY.set(1);
        else contactPinY.set(0);

        floorProximity.set(result.floorProximity);

        const elapsed = (now - startTime) / maxDuration;
        const nextDiameter = baseDiameter * (0.92 + Math.min(1, elapsed) * 0.08);
        setDiameter(nextDiameter);
        radiusRef.current = nextDiameter / 2;

        stateRef.current = result;
        posX.set(result.x);
        posY.set(result.y);

        if (result.sleeping) {
          finishEntrance();
          return;
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(boot);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [
    applyImpactSquash,
    contactPinX,
    contactPinY,
    finishEntrance,
    fitDiameter,
    floorProximity,
    isPhone,
    posX,
    posY,
    prefersReducedMotion,
    readSectionBounds,
    setPhaseSafe,
    syncFlightDeform,
  ]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let raf = 0;
    let last = performance.now();
    let prevX = stateRef.current.x;
    let prevY = stateRef.current.y;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const phase = phaseRef.current;
      const cycle = cycleRef.current;

      if (phase !== "ambient" && phase !== "simulating") return;
      // Frozen during dissolve / still blur-in — never step physics then.
      if (phase === "ambient" && cycle !== "live") return;

      const dt = Math.min(now - last, 24);
      last = now;

      const { bounds } = readSectionBounds();
      const drag = phase === "simulating" && draggingRef.current ? pointerRef.current : null;
      const config = phase === "ambient" ? AMBIENT_PHYSICS : HERO_BALL_PHYSICS;

      // Already resting — keep pinned still until fade begins (no micro-bounce wakeups).
      if (
        phase === "ambient" &&
        restSinceRef.current !== null &&
        Math.hypot(stateRef.current.vx, stateRef.current.vy) < AMBIENT_PHYSICS.sleepSpeed
      ) {
        stateRef.current = {
          x: stateRef.current.x,
          y: stateRef.current.y,
          vx: 0,
          vy: 0,
        };
        posX.set(stateRef.current.x);
        posY.set(stateRef.current.y);
        speedNorm.set(0);
        if (now - restSinceRef.current >= AMBIENT_CYCLE.restBeforeFadeMs) {
          beginFadeOut();
        }
        return;
      }

      const result = stepBasketballPhysics(stateRef.current, config, bounds, dt, drag
        ? { isDragging: true, dragX: drag.x, dragY: drag.y }
        : { isDragging: false });

      const dx = result.x - prevX;
      const dy = result.y - prevY;
      if (!drag) {
        rollAngleRef.current += rollDeltaFromMotion(dx, dy, radiusRef.current);
        setRollAngle(rollAngleRef.current);
      }

      const hitHorizontal = result.hitLeft || result.hitRight;
      const hitVertical = result.hitTop || result.hitBottom;
      const hit = hitHorizontal || hitVertical;
      if (!drag && hit) {
        applyImpactSquash(hitHorizontal, hitVertical, Math.hypot(result.vx, result.vy));
      }
      if (!drag) syncFlightDeform(result.vx, result.vy, hit);
      else {
        airStretchX.set(1);
        airStretchY.set(1);
        speedNorm.set(0);
      }

      // Hold the pressed edge flush to the wall while squash is active.
      if (result.hitLeft || result.x <= bounds.minX + 0.75) contactPinX.set(-1);
      else if (result.hitRight || result.x >= bounds.maxX - 0.75) contactPinX.set(1);
      else contactPinX.set(0);

      if (result.hitTop || result.y <= bounds.minY + 0.75) contactPinY.set(-1);
      else if (result.hitBottom || result.y >= bounds.maxY - 0.75) contactPinY.set(1);
      else contactPinY.set(0);

      floorProximity.set(result.floorProximity);

      prevX = result.x;
      prevY = result.y;
      stateRef.current = result;
      posX.set(result.x);
      posY.set(result.y);

      if (phase === "simulating" && result.sleeping) {
        beginFadeOut();
        return;
      }

      if (phase === "ambient") {
        if (result.sleeping) {
          stateRef.current = { x: result.x, y: result.y, vx: 0, vy: 0 };
          settleBreath.set(1);
          speedNorm.set(0);
          if (restSinceRef.current === null) {
            restSinceRef.current = now;
            // Only now — settled and still — does the face appear and smile.
            setFaceReveal(1);
            setFaceHint(0);
            void animate(entranceSmile, 1, {
              duration: AMBIENT_CYCLE.smileMs / 1000,
              ease: [0.22, 1, 0.36, 1],
            });
          }
        } else {
          settleBreath.set(1);
          restSinceRef.current = null;
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    airStretchX,
    airStretchY,
    applyImpactSquash,
    beginFadeOut,
    contactPinX,
    contactPinY,
    entranceSmile,
    floorProximity,
    posX,
    posY,
    prefersReducedMotion,
    readSectionBounds,
    settleBreath,
    speedNorm,
    syncFlightDeform,
  ]);

  useEffect(() => {
    if (phase === "entering" || phase === "ambient") return;
    const { bounds } = readSectionBounds();
    const s = stateRef.current;
    const nx = clamp(s.x, bounds.minX, bounds.maxX);
    const ny = clamp(s.y, bounds.minY, bounds.maxY);
    if (nx !== s.x || ny !== s.y) {
      stateRef.current = { ...s, x: nx, y: ny };
      posX.set(nx);
      posY.set(ny);
    }
  }, [diameter, phase, readSectionBounds, posX, posY]);

  const scrollSmileRaw = useTransform(scrollY, [180, 520], [0, 1]);
  const combinedSmile = useTransform([entranceSmile, scrollSmileRaw], ([entrance, scroll]) =>
    Math.max(Number(entrance), Number(scroll)),
  );
  const smile = useSpring(combinedSmile, { stiffness: 140, damping: 22 });

  const lidRaw = useTransform(scrollY, [0, 220], [1, 0]);
  const lidScale = useSpring(lidRaw, { stiffness: 140, damping: 22 });

  const scrollPresenceRaw = useTransform(
    heroProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [1, 0.92, 0.7, 0.42, 0.12],
  );
  const scrollPresence = useSpring(scrollPresenceRaw, { stiffness: 70, damping: 24 });

  const presenceOpacity = useTransform(
    ballPresence,
    [0, 0.18, 0.42, 0.72, 1],
    [0, 0.22, 0.55, 0.86, 1],
  );
  // Light haze only — heavy blur+filter on open was janking first paint.
  const presenceBlur = useTransform(
    ballPresence,
    [0, 0.25, 0.55, 0.85, 1],
    [8, 4.5, 2, 0.6, 0],
  );
  const presenceBrightness = useTransform(
    ballPresence,
    [0, 0.35, 0.7, 1],
    [0.82, 0.9, 0.96, 1],
  );
  const presenceSaturate = useTransform(
    ballPresence,
    [0, 0.45, 1],
    [0.85, 0.93, 1],
  );

  const cinematicOpacity = useTransform(
    [scrollPresence, presenceOpacity],
    ([scroll, presence]) => Number(scroll) * Number(presence),
  );
  // Keep scale off the positioned layer — it opens false edge gaps. Fade only.
  const motionBlurPx = useTransform(speedNorm, [0, 1], [0, 0.6]);
  const cinematicBlurPx = useTransform(
    [presenceBlur, motionBlurPx],
    ([presence, motion]) => Math.min(10, Number(presence) + Number(motion)),
  );
  const cinematicFilter = useMotionTemplate`blur(${cinematicBlurPx}px) brightness(${presenceBrightness}) saturate(${presenceSaturate})`;
  const shadowOpacity = useTransform(
    [cinematicOpacity, contactShadowOpacity],
    ([presence, contact]) => Number(presence) * Number(contact),
  );
  const glowOpacity = useTransform(
    [cinematicOpacity, speedNorm, floorProximity],
    ([presence, speed, floor]) =>
      Number(presence) * (0.34 + Number(speed) * 0.18 + (1 - Number(floor)) * 0.14),
  );
  const glowScale = useTransform(speedNorm, (speed) => 1.02 + Number(speed) * 0.06);
  const shadowFilter = useMotionTemplate`blur(${contactShadowBlur}px)`;

  const half = diameter / 2;
  /** Top-left px with wall-pin — never use % translate (conflicts with motion `x`). */
  const ballRenderX = useTransform(
    [posX, composedScaleX, contactPinX],
    ([x, sx, pin]) => {
      const p = Number(pin);
      const s = Number(sx);
      let left = Number(x) - half;
      if (p < 0) left -= half * (1 - s);
      else if (p > 0) left += half * (1 - s);
      return left;
    },
  );
  const ballRenderY = useTransform(
    [posY, composedScaleY, contactPinY],
    ([y, sy, pin]) => {
      const p = Number(pin);
      const s = Number(sy);
      let top = Number(y) - half;
      if (p < 0) top -= half * (1 - s);
      else if (p > 0) top += half * (1 - s);
      return top;
    },
  );
  const glowRenderX = useTransform(glowTrailX, (x) => Number(x) - diameter * 0.75);
  const glowRenderY = useTransform(glowTrailY, (y) => Number(y) - diameter * 0.75);
  const shadowRenderX = useTransform(shadowLagX, (x) => Number(x) - diameter * 0.42);
  const shadowRenderY = useTransform(posY, (y) => Number(y) + half * 0.02);

  const mouthWidth = useTransform(smile, (v: number) => `${22 + v * 70}px`);
  const mouthHeight = useTransform(smile, (v: number) => `${36 + v * 12}px`);
  const mouthRadius = useTransform(
    smile,
    (v: number) =>
      `${50 - v * 40}% ${50 - v * 40}% ${50 + v * 45}% ${50 + v * 45}% / ${50 - v * 35}% ${50 - v * 35}% ${50 + v * 55}% ${50 + v * 55}%`,
  );

  const recordPointerSample = useCallback((localX: number, localY: number) => {
    const now = performance.now();
    pointerSamplesRef.current.push({ x: localX, y: localY, t: now });
    if (pointerSamplesRef.current.length > 28) {
      pointerSamplesRef.current = pointerSamplesRef.current.slice(-28);
    }
  }, []);

  const applyDragPosition = useCallback(
    (localX: number, localY: number) => {
      const { bounds } = readSectionBounds();
      const px = clamp(localX, bounds.minX, bounds.maxX);
      const py = clamp(localY, bounds.minY, bounds.maxY);
      const prev = stateRef.current;
      const dx = px - prev.x;
      const dy = py - prev.y;
      rollAngleRef.current += rollDeltaFromMotion(dx, dy, radiusRef.current);
      setRollAngle(rollAngleRef.current);

      pointerRef.current = { x: px, y: py };
      recordPointerSample(px, py);
      stateRef.current = { ...prev, x: px, y: py };
      posX.set(px);
      posY.set(py);
    },
    [posX, posY, readSectionBounds, recordPointerSample],
  );

  const applyClientDrag = useCallback(
    (clientX: number, clientY: number) => {
      // Playfield is viewport-locked — client coords map 1:1 to ball space.
      const vv = window.visualViewport;
      const offsetX = vv?.offsetLeft ?? 0;
      const offsetY = vv?.offsetTop ?? 0;
      applyDragPosition(clientX - offsetX, clientY - offsetY);
    },
    [applyDragPosition],
  );

  const activateFromAmbient = useCallback(() => {
    const el = ballRef.current;
    if (!el || phaseRef.current !== "ambient") return;
    if (cycleRef.current !== "live") return;

    const ballRect = el.getBoundingClientRect();
    const vv = window.visualViewport;
    const offsetX = vv?.offsetLeft ?? 0;
    const offsetY = vv?.offsetTop ?? 0;
    const local = {
      x: ballRect.left + ballRect.width / 2 - offsetX,
      y: ballRect.top + ballRect.height / 2 - offsetY,
    };

    const nextDiameter = ballRect.width;
    setDiameter(nextDiameter);
    radiusRef.current = nextDiameter / 2;

    stateRef.current = { x: local.x, y: local.y, vx: 0, vy: 0 };
    posX.set(local.x);
    posY.set(local.y);
    setFaceReveal(1);
    setFaceHint(0);
    interruptCycle();
    setPhaseSafe("simulating");
  }, [interruptCycle, posX, posY, setPhaseSafe]);

  useEffect(() => {
    const el = ballRef.current;
    if (!el || prefersReducedMotion) return;

    const onWheel = (event: WheelEvent) => {
      if (!isHoveringRef.current) return;
      event.preventDefault();

      const { width, height } = readSectionBounds();
      const max = fitDiameter(Math.min(MAX_DIAMETER, Math.min(width, height) * 0.5 || MAX_DIAMETER));

      setDiameter((prev) => {
        const next = clamp(prev + -event.deltaY * 0.35, MIN_DIAMETER, max);
        radiusRef.current = next / 2;
        return next;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [fitDiameter, phase, prefersReducedMotion, readSectionBounds]);

  useEffect(() => {
    const ground = groundRef.current;
    if (!ground) return;

    const syncBounds = () => {
      const preferred = getPreferredDiameter();
      const next = fitDiameter(preferred);
      setDiameter(next);
      radiusRef.current = next / 2;

      const { bounds } = readSectionBounds();
      const s = stateRef.current;
      const nx = clamp(s.x, bounds.minX, bounds.maxX);
      const ny = clamp(s.y, bounds.minY, bounds.maxY);
      if (nx !== s.x || ny !== s.y) {
        stateRef.current = { ...s, x: nx, y: ny };
        posX.set(nx);
        posY.set(ny);
      }
    };

    const ro = new ResizeObserver(() => syncBounds());
    ro.observe(ground);
    window.addEventListener("resize", syncBounds);
    window.visualViewport?.addEventListener("resize", syncBounds);
    syncBounds();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncBounds);
      window.visualViewport?.removeEventListener("resize", syncBounds);
    };
  }, [fitDiameter, groundRef, posX, posY, readSectionBounds]);

  useEffect(() => {
    return () => {
      stopFade();
      clearDormantTimer();
      if (squashTimerRef.current) clearTimeout(squashTimerRef.current);
    };
  }, [clearDormantTimer, stopFade]);

  const handlePointerEnter = () => {
    isHoveringRef.current = true;
  };

  const handlePointerLeave = () => {
    isHoveringRef.current = false;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    if (phaseRef.current === "entering") {
      finishEntrance();
      return;
    }

    if (phaseRef.current === "ambient") {
      if (cycleRef.current !== "live") return;
      activateFromAmbient();
    } else {
      interruptCycle();
      setPhaseSafe("simulating");
    }

    draggingRef.current = true;
    pointerSamplesRef.current = [];
    applyClientDrag(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || phaseRef.current === "ambient" || phaseRef.current === "entering") {
      return;
    }
    applyClientDrag(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const throwVel = computeThrowVelocity(
      pointerSamplesRef.current,
      HERO_BALL_PHYSICS.maxSpeed,
      1.05,
    );
    const current = stateRef.current;
    stateRef.current = {
      x: current.x,
      y: current.y,
      vx: throwVel.vx,
      vy: throwVel.vy,
    };

    draggingRef.current = false;
    pointerRef.current = null;
    pointerSamplesRef.current = [];
    interruptCycle();
    setPhaseSafe("simulating");

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const ballStyle = { width: diameter, height: diameter };

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };

  const showFullFace = faceReveal > 0.08;
  const face = (
    <BallSphere
      showFace={showFullFace}
      faceReveal={faceReveal}
      faceHint={faceHint}
      rollAngle={rollAngle}
      lidScale={lidScale}
      mouthRadius={mouthRadius}
      mouthHeight={mouthHeight}
      mouthWidth={mouthWidth}
    />
  );

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        className="hero-ball-reduced-motion pointer-events-none absolute left-1/2 z-[8] -translate-x-1/2 top-[18%] md:top-auto md:bottom-[12%]"
        style={ballStyle}
      >
        <div
          className="hero-ball-ambient-glow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: diameter * 1.35, height: diameter * 1.35, opacity: 0.45 }}
        />
        <div
          className="relative h-full w-full rounded-full"
          style={{ background: BALL_SURFACE, boxShadow: BALL_SHADOW }}
        />
      </div>
    );
  }

  const isInteractive = phase === "entering" || phase === "simulating";
  const ballLayerZ = isInteractive ? "z-[18]" : "z-[8]";

  return (
    <div
      ref={playfieldRef}
      className="hero-ball-playfield pointer-events-none fixed inset-0 z-[8] overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }}
    >
      <motion.div
        aria-hidden
        className={`hero-ball-ambient-glow pointer-events-none absolute left-0 top-0 ${ballLayerZ}`}
        style={{
          width: diameter * 1.5,
          height: diameter * 1.5,
          x: glowRenderX,
          y: glowRenderY,
          opacity: glowOpacity,
          scale: glowScale,
        }}
      />

      <motion.div
        aria-hidden
        className={`hero-ball-contact-shadow pointer-events-none absolute left-0 top-0 ${ballLayerZ}`}
        style={{
          width: diameter * 0.84,
          height: diameter * 0.14,
          x: shadowRenderX,
          y: shadowRenderY,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, oklch(0 0 0 / 0.55) 0%, oklch(0 0 0 / 0.2) 40%, oklch(0 0 0 / 0) 72%)",
          filter: shadowFilter,
          opacity: shadowOpacity,
          scaleX: contactShadowScale,
          scaleY: contactShadowScaleY,
        }}
      />

      <motion.div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 ${ballLayerZ} touch-none`}
        style={{
          x: ballRenderX,
          y: ballRenderY,
          width: diameter,
          height: diameter,
          opacity: cinematicOpacity,
          filter: cinematicFilter,
        }}
      >
        <motion.div
          ref={ballRef}
          className={
            phase === "entering"
              ? "pointer-events-auto h-full w-full cursor-default"
              : "pointer-events-auto h-full w-full cursor-grab active:cursor-grabbing"
          }
          style={{
            scaleX: composedScaleX,
            scaleY: composedScaleY,
          }}
          {...pointerHandlers}
        >
          <div className="h-full w-full">{face}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
