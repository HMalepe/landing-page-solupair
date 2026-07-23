import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/**
 * Ambient loop: blur in mid-air → loft → real bounce/roll physics → settle →
 * slow dissolve → wait → reappear elsewhere → repeat.
 */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 1720,
  restitution: 0.74,
  wallRestitution: 0.77,
  airFriction: 0.999,
  floorFriction: 0.92,
  maxSpeed: 4200,
  sleepSpeed: 14,
};

export const AMBIENT_CYCLE = {
  /** Hold fully still on the floor before dissolving. */
  restBeforeFadeMs: 1000,
  /** Long premium dissolve into the background. */
  fadeOutMs: 3600,
  /** Fully gone before the next air spawn. */
  dormantMinMs: 2000,
  dormantMaxMs: 4000,
  /** Slow soft reappear from haze. */
  fadeInMs: 2800,
  /** Smile blooms through the blur-in. */
  smileMs: 2200,
} as const;

export function nextDormantMs() {
  const { dormantMinMs, dormantMaxMs } = AMBIENT_CYCLE;
  return dormantMinMs + Math.random() * (dormantMaxMs - dormantMinMs);
}

/**
 * Reappear near a top corner (alternating sides), hugging the edge so the next
 * launch has the full width of the screen to fly across. The recurring beat
 * mirrors the dramatic opening flight instead of a timid mid-screen drop.
 */
export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const fromLeft = Math.random() < 0.5;

  return {
    x: fromLeft
      ? bounds.minX + spanX * (0.03 + Math.random() * 0.12)
      : bounds.maxX - spanX * (0.03 + Math.random() * 0.12),
    y: bounds.minY + spanY * (0.06 + Math.random() * 0.2),
  };
}

/**
 * Strong cross-screen launch — the same energy as the opening flight, always
 * aimed toward the far wall from wherever the ball just reappeared, so it flies
 * corner-to-corner and bounces around until it bleeds off all momentum.
 */
export function ambientNextLoftImpulse(
  bounds: PhysicsBounds,
  spawnX: number,
): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const mid = (bounds.minX + bounds.maxX) / 2;
  // Fire toward the opposite side from the spawn edge.
  const sign = spawnX <= mid ? 1 : -1;

  return {
    vx: sign * Math.max(1200, spanX * 1.9) * (0.85 + Math.random() * 0.3),
    vy: -Math.max(360, spanY * 0.42) * (0.75 + Math.random() * 0.4),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
