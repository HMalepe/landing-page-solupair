import { useCallback, useEffect, type PointerEvent } from "react";
import {
  getPreferredDiameter,
  HERO_BALL_PHYSICS,
  MAX_DIAMETER,
  MIN_DIAMETER,
  rollDeltaFromMotion,
} from "@/lib/hero-ball-entrance";
import { computeThrowVelocity } from "@/lib/ball-physics";
import { clamp } from "@/lib/hero-ball-config";
import type { HeroBallCore } from "@/hooks/use-hero-ball-core";
import type { AmbientCycle } from "@/hooks/use-ambient-cycle";

/**
 * Phase-machine glue: ending the entrance, activating from ambient on grab,
 * the drag/throw pointer handlers, and the wheel/resize/clamp side effects
 * that keep the ball sized and inside its walls.
 */
export function useHeroChoreography(core: HeroBallCore, cycle: AmbientCycle) {
  const {
    ballRef,
    groundRef,
    prefersReducedMotion,
    phase,
    diameter,
    setDiameter,
    setFaceReveal,
    posX,
    posY,
    rollAngle,
    squashValue,
    phaseRef,
    cycleRef,
    stateRef,
    pointerRef,
    pointerSamplesRef,
    draggingRef,
    isHoveringRef,
    restSinceRef,
    smileOnRestRef,
    radiusRef,
    rollAngleRef,
    readSectionBounds,
    fitDiameter,
    setPhaseSafe,
  } = core;
  const { interruptCycle } = cycle;

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
      // The opening flight earns its smile when it comes to rest.
      smileOnRestRef.current = true;
      setPhaseSafe("ambient");
      cycleRef.current = "live";
    },
    [
      fitDiameter,
      setPhaseSafe,
      squashValue,
      setDiameter,
      radiusRef,
      stateRef,
      restSinceRef,
      smileOnRestRef,
      cycleRef,
    ],
  );

  const recordPointerSample = useCallback(
    (localX: number, localY: number) => {
      const now = performance.now();
      pointerSamplesRef.current.push({ x: localX, y: localY, t: now });
      if (pointerSamplesRef.current.length > 28) {
        pointerSamplesRef.current = pointerSamplesRef.current.slice(-28);
      }
    },
    [pointerSamplesRef],
  );

  const applyDragPosition = useCallback(
    (localX: number, localY: number) => {
      const { bounds } = readSectionBounds();
      const px = clamp(localX, bounds.minX, bounds.maxX);
      const py = clamp(localY, bounds.minY, bounds.maxY);
      const prev = stateRef.current;
      const dx = px - prev.x;
      const dy = py - prev.y;
      rollAngleRef.current += rollDeltaFromMotion(dx, dy, radiusRef.current);
      rollAngle.set(rollAngleRef.current);

      pointerRef.current = { x: px, y: py };
      recordPointerSample(px, py);
      stateRef.current = { ...prev, x: px, y: py };
      posX.set(px);
      posY.set(py);
    },
    [
      posX,
      posY,
      readSectionBounds,
      recordPointerSample,
      rollAngle,
      stateRef,
      rollAngleRef,
      radiusRef,
      pointerRef,
    ],
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
    interruptCycle();
    setPhaseSafe("simulating");
  }, [
    interruptCycle,
    posX,
    posY,
    setPhaseSafe,
    ballRef,
    phaseRef,
    cycleRef,
    setDiameter,
    radiusRef,
    stateRef,
    setFaceReveal,
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
  }, [diameter, phase, readSectionBounds, posX, posY, stateRef]);

  useEffect(() => {
    const el = ballRef.current;
    if (!el || prefersReducedMotion) return;

    const onWheel = (event: WheelEvent) => {
      if (!isHoveringRef.current) return;
      event.preventDefault();

      const { width, height } = readSectionBounds();
      const max = fitDiameter(
        Math.min(MAX_DIAMETER, Math.min(width, height) * 0.5 || MAX_DIAMETER),
      );

      setDiameter((prev) => {
        const next = clamp(prev + -event.deltaY * 0.35, MIN_DIAMETER, max);
        radiusRef.current = next / 2;
        return next;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [
    fitDiameter,
    phase,
    prefersReducedMotion,
    readSectionBounds,
    ballRef,
    isHoveringRef,
    setDiameter,
    radiusRef,
  ]);

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
  }, [fitDiameter, groundRef, posX, posY, readSectionBounds, setDiameter, radiusRef, stateRef]);

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

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };

  return { finishEntrance, pointerHandlers };
}

export type HeroChoreography = ReturnType<typeof useHeroChoreography>;
