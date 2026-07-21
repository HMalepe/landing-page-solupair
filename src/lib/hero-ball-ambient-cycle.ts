import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient: silk arcs, settle, then loft again from where it rests. */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 1920,
  restitution: 0.77,
  wallRestitution: 0.8,
  airFriction: 0.9984,
  floorFriction: 0.91,
  maxSpeed: 2300,
  sleepSpeed: 10,
};

export const AMBIENT_CYCLE = {
  restBeforeKickMs: 720,
  fadeOutMs: 1100,
  dormantMs: 500,
  fadeInMs: 900,
} as const;

export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.18 + Math.random() * 0.64),
    y: bounds.minY + spanY * (0.12 + Math.random() * 0.3),
  };
}

/**
 * Loft from the current floor contact — never teleport.
 * Direction aims toward the farther side wall for a full-court feel.
 */
export function ambientRespawnImpulse(
  bounds: PhysicsBounds,
  fromX: number,
): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const mid = (bounds.minX + bounds.maxX) * 0.5;
  const towardRight = fromX <= mid;
  const sign = towardRight ? 1 : -1;
  const loft = 0.88 + Math.random() * 0.22;

  return {
    vx: sign * Math.max(820, spanX * 1.55) * loft,
    vy: -Math.max(420, spanY * 0.58) * loft,
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
