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
 * Reappear at a random spot across the upper-middle air — never hugging the
 * edges. There's no sideways launch afterwards: the ball simply drops from
 * here under gravity and bounces straight up and down until it settles.
 */
export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.18 + Math.random() * 0.64),
    y: bounds.minY + spanY * (0.06 + Math.random() * 0.22),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
