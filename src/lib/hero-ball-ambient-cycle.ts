import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient rallies — full-edge travel, settle, then hard re-kick (no long idle). */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 2050,
  restitution: 0.78,
  wallRestitution: 0.8,
  airFriction: 0.9974,
  floorFriction: 0.86,
  maxSpeed: 2800,
  sleepSpeed: 12,
};

export const AMBIENT_CYCLE = {
  /** Brief pause on the floor before the next wall-to-wall launch. */
  restBeforeKickMs: 480,
  fadeOutMs: 900,
  dormantMs: 400,
  fadeInMs: 700,
} as const;

export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const fromLeft = Math.random() > 0.5;

  return {
    x: fromLeft ? bounds.minX : bounds.maxX,
    y: bounds.minY + spanY * (0.08 + Math.random() * 0.35),
  };
}

/** Impulse sized to cross the full hero width/height before energy drains. */
export function ambientRespawnImpulse(
  bounds: PhysicsBounds,
  fromLeft: boolean,
): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const sign = fromLeft ? 1 : -1;

  return {
    vx: sign * Math.max(1100, spanX * 2.1) * (0.85 + Math.random() * 0.3),
    vy: -Math.max(480, spanY * 0.65) * (0.8 + Math.random() * 0.35),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
