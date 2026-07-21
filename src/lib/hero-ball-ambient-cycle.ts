import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient: long silk arcs, calm settle, then a prepared loft. */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 1720,
  restitution: 0.74,
  wallRestitution: 0.77,
  airFriction: 0.999,
  floorFriction: 0.94,
  maxSpeed: 4200,
  sleepSpeed: 8,
};

export const AMBIENT_CYCLE = {
  /** Hold on the floor long enough to read the settle. */
  restBeforeKickMs: 980,
  /** Wind-up squash before loft. */
  anticipationMs: 160,
  fadeOutMs: 1680,
  dormantMs: 640,
  fadeInMs: 1100,
} as const;

export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.22 + Math.random() * 0.56),
    y: bounds.minY + spanY * (0.14 + Math.random() * 0.28),
  };
}

/**
 * Loft from the current floor contact — never teleport.
 * Horizontal speed is tuned to reach the far wall before the next settle.
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
  const loft = 0.96 + Math.random() * 0.12;
  // Cover well over a full span in one flight so walls get kissed every rally.
  const wallSeek = Math.max(1100, spanX * 2.15);

  return {
    vx: sign * wallSeek * loft,
    vy: -Math.max(560, spanY * 0.78) * loft,
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
