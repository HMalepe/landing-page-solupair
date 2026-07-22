import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient: long silk arcs, calm settle, then dissolve in place. */
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
  /** Hold still long enough to read the settle before dissolving. */
  restBeforeFadeMs: 720,
  fadeOutMs: 1400,
  dormantMs: 520,
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
 * Soft re-entry drift after a dissolve — never a wall-seeking rush.
 * Applied only while the ball is still invisible / fading in.
 */
export function ambientSoftEntranceImpulse(
  bounds: PhysicsBounds,
): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const sign = Math.random() < 0.5 ? -1 : 1;

  return {
    vx: sign * (140 + Math.random() * 180) * (0.55 + spanX / 2400),
    vy: -(220 + Math.random() * 160) * (0.55 + spanY / 1600),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
