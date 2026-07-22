import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/**
 * Ambient loop: blur in mid-air → fall → settle → slow dissolve → wait → repeat.
 * No loft kicks — gravity alone carries each drop.
 */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 1680,
  restitution: 0.58,
  wallRestitution: 0.55,
  airFriction: 0.998,
  floorFriction: 0.88,
  maxSpeed: 3200,
  sleepSpeed: 16,
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

/** Random spot in the upper air of the playfield (never on the floor). */
export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.12 + Math.random() * 0.76),
    y: bounds.minY + spanY * (0.08 + Math.random() * 0.38),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
