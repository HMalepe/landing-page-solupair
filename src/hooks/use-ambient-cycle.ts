import { useCallback, useEffect } from "react";
import { animate } from "framer-motion";
import { AMBIENT_CYCLE, nextDormantMs, pickAmbientSpawn } from "@/lib/hero-ball-ambient-cycle";
import type { HeroBallCore } from "@/hooks/use-hero-ball-core";

/**
 * The ambient CyclePhase machine: live → fade-out → dormant → fade-in →
 * respawn-at-random-top → live. Timer/promise driven (not a rAF loop); the
 * physics loop calls `beginFadeOut` once the ball has rested long enough.
 */
export function useAmbientCycle(core: HeroBallCore) {
  const {
    ballPresence,
    settleBreath,
    squashAxis,
    squashValue,
    speedNorm,
    airStretchX,
    airStretchY,
    entranceSmile,
    posX,
    posY,
    stateRef,
    cycleRef,
    phaseRef,
    restSinceRef,
    smileOnRestRef,
    dormantTimerRef,
    fadeControlsRef,
    readSectionBounds,
    setPhaseSafe,
    setFaceReveal,
    clearDormantTimer,
    stopFade,
  } = core;

  const interruptCycle = useCallback(() => {
    stopFade();
    clearDormantTimer();
    cycleRef.current = "live";
    restSinceRef.current = null;
    ballPresence.set(1);
    settleBreath.set(1);
  }, [ballPresence, clearDormantTimer, settleBreath, stopFade, cycleRef, restSinceRef]);

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
    stateRef,
    restSinceRef,
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
        // Reappears smiling — the face blooms while it blurs back in, still.
        // No sideways launch: it will simply drop under gravity once live.
        smileOnRestRef.current = false;
        setFaceReveal(1);
        entranceSmile.set(0);
        void animate(entranceSmile, 1, {
          duration: AMBIENT_CYCLE.smileMs / 1000,
          ease: [0.22, 1, 0.36, 1],
        });
        ballPresence.set(0);

        fadeControlsRef.current = animate(ballPresence, 1, {
          duration: AMBIENT_CYCLE.fadeInMs / 1000,
          ease: [0.22, 1, 0.36, 1],
        });

        void fadeControlsRef.current.then(() => {
          if (cycleRef.current !== "fading-in") return;
          restSinceRef.current = null;
          cycleRef.current = "live";
          // Let go — the smile relaxes and the face fades as it starts to drop.
          setFaceReveal(0);
          void animate(entranceSmile, 0, { duration: 0.5, ease: [0.4, 0, 0.2, 1] });
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
    setPhaseSafe,
    settleBreath,
    softRespawnAmbient,
    speedNorm,
    cycleRef,
    phaseRef,
    stateRef,
    restSinceRef,
    smileOnRestRef,
    dormantTimerRef,
    fadeControlsRef,
    setFaceReveal,
  ]);

  useEffect(() => {
    return () => {
      stopFade();
      clearDormantTimer();
    };
  }, [clearDormantTimer, stopFade]);

  return { interruptCycle, softRespawnAmbient, beginFadeOut };
}

export type AmbientCycle = ReturnType<typeof useAmbientCycle>;
