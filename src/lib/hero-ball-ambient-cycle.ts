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

/** Random spot in the upper air of the playfield (never on the floor). */
export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.12 + Math.random() * 0.76),
    y: bounds.minY + spanY * (0.08 + Math.random() * 0.38),
  };
}

/** Gentle relaunch once a reappear finishes blurring in — carries it into a real arc. */
export function ambientNextLoftImpulse(bounds: PhysicsBounds): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const sign = Math.random() < 0.5 ? -1 : 1;

  return {
    vx: sign * (220 + Math.random() * 160) * (0.5 + spanX / 2800),
    vy: -(380 + Math.random() * 140) * (0.55 + spanY / 1800),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
