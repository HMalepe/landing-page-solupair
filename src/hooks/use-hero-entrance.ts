import { useEffect, useRef } from "react";
import {
  ENTRANCE_PHYSICS,
  getEntranceInitialState,
  getEntranceMaxDurationMs,
  getPreferredDiameter,
  rollDeltaFromMotion,
} from "@/lib/hero-ball-entrance";
import { stepBasketballPhysics } from "@/lib/ball-physics";
import type { HeroBallCore } from "@/hooks/use-hero-ball-core";
import type { HeroChoreography } from "@/hooks/use-hero-choreography";

/**
 * The opening throw-in: flies the ball in from off-screen, bounces it off the
 * walls, and hands off to the ambient loop once it comes to rest (or the max
 * duration elapses). A single rAF loop, exactly as it ran inline.
 */
export function useHeroEntrance(core: HeroBallCore, choreography: HeroChoreography) {
  const {
    prefersReducedMotion,
    isPhone,
    entranceStartedRef,
    phaseRef,
    stateRef,
    rollAngleRef,
    posX,
    posY,
    rollAngle,
    contactPinX,
    contactPinY,
    floorProximity,
    radiusRef,
    readSectionBounds,
    fitDiameter,
    setDiameter,
    setPhaseSafe,
    applyImpactSquash,
    syncFlightDeform,
  } = core;
  const { finishEntrance } = choreography;

  // `isPhone` starts `false` (the SSR-safe default from useDeviceProfile) and
  // flips to its real value in an effect shortly after mount on phones —
  // read the latest value via this ref rather than the effect's own
  // dependency array below, so that transition can't tear the entrance rAF
  // loop down. The `entranceStartedRef` guard below is a run-once-ever
  // latch: if `isPhone` were a dependency, the teardown from that one
  // post-mount change would never be allowed to restart, silently freezing
  // the ball's opening flight on every phone.
  const isPhoneRef = useRef(isPhone);
  isPhoneRef.current = isPhone;

  useEffect(() => {
    if (prefersReducedMotion || entranceStartedRef.current) return;
    entranceStartedRef.current = true;

    let raf = 0;
    let cancelled = false;
    let last = performance.now();
    let startTime = performance.now();
    const maxDuration = getEntranceMaxDurationMs(isPhoneRef.current);
    const preferred = getPreferredDiameter();

    const boot = () => {
      if (cancelled) return;
      const { width, height } = readSectionBounds();
      if (width <= 0 || height <= 0) {
        raf = requestAnimationFrame(boot);
        return;
      }

      // Fly in at final size — growing width/height every frame forced a layout
      // reflow mid-flight (the entrance jank). Size is fixed; only transforms move.
      const baseDiameter = fitDiameter(preferred);
      setDiameter(baseDiameter);
      radiusRef.current = baseDiameter / 2;

      const initial = getEntranceInitialState(width, height, radiusRef.current);
      stateRef.current = initial;
      posX.set(initial.x);
      posY.set(initial.y);
      rollAngleRef.current = 0;
      rollAngle.set(0);
      setPhaseSafe("entering");

      // Start the clock at the first real motion frame so a slow boot/layout
      // wait can't produce a jumbo first-frame delta or clip the flight short.
      last = performance.now();
      startTime = performance.now();

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
        rollAngle.set(rollAngleRef.current);

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
    posX,
    posY,
    prefersReducedMotion,
    readSectionBounds,
    rollAngle,
    setPhaseSafe,
    syncFlightDeform,
    entranceStartedRef,
    phaseRef,
    stateRef,
    rollAngleRef,
    radiusRef,
    setDiameter,
  ]);
}
