import { useEffect } from "react";
import { animate } from "framer-motion";
import { AMBIENT_CYCLE, AMBIENT_PHYSICS } from "@/lib/hero-ball-ambient-cycle";
import { HERO_BALL_PHYSICS, rollDeltaFromMotion } from "@/lib/hero-ball-entrance";
import { stepBasketballPhysics } from "@/lib/ball-physics";
import type { HeroBallCore } from "@/hooks/use-hero-ball-core";
import type { AmbientCycle } from "@/hooks/use-ambient-cycle";

/**
 * One rAF loop drives both the `ambient` and `simulating` phases (drag/throw
 * physics), exactly as it did inline — they share `last`/prev-position state
 * and switching config by phase, splitting them would introduce a one-frame
 * dt/roll-angle seam at the ambient↔simulating handoff.
 */
export function useBallSimulation(core: HeroBallCore, ambientCycle: AmbientCycle) {
  const {
    prefersReducedMotion,
    phaseRef,
    cycleRef,
    stateRef,
    draggingRef,
    pointerRef,
    rollAngleRef,
    radiusRef,
    restSinceRef,
    smileOnRestRef,
    posX,
    posY,
    rollAngle,
    contactPinX,
    contactPinY,
    floorProximity,
    speedNorm,
    airStretchX,
    airStretchY,
    settleBreath,
    entranceSmile,
    readSectionBounds,
    applyImpactSquash,
    syncFlightDeform,
    setFaceReveal,
  } = core;
  const { beginFadeOut } = ambientCycle;

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

      const result = stepBasketballPhysics(
        stateRef.current,
        config,
        bounds,
        dt,
        drag ? { isDragging: true, dragX: drag.x, dragY: drag.y } : { isDragging: false },
      );

      const dx = result.x - prevX;
      const dy = result.y - prevY;
      if (!drag) {
        rollAngleRef.current += rollDeltaFromMotion(dx, dy, radiusRef.current);
        rollAngle.set(rollAngleRef.current);
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
            // Only the opening flight smiles on settle; ambient reappears have
            // already smiled on blur-in, so their bounce settle stays faceless.
            if (smileOnRestRef.current) {
              smileOnRestRef.current = false;
              setFaceReveal(1);
              void animate(entranceSmile, 1, {
                duration: AMBIENT_CYCLE.smileMs / 1000,
                ease: [0.22, 1, 0.36, 1],
              });
            }
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
    rollAngle,
    settleBreath,
    speedNorm,
    syncFlightDeform,
    phaseRef,
    cycleRef,
    stateRef,
    draggingRef,
    pointerRef,
    rollAngleRef,
    radiusRef,
    restSinceRef,
    smileOnRestRef,
    setFaceReveal,
  ]);
}
