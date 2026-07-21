import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient rallies — still full-edge travel, settles, then re-launches. */
export const AMBIENT_PHYSICS: BasketballConfig = {
  gravity: 1950,
  restitution: 0.78,
  wallRestitution: 0.8,
  airFriction: 0.9978,
  floorFriction: 0.88,
  maxSpeed: 2200,
  sleepSpeed: 10,
};

export const AMBIENT_CYCLE = {
  restBeforeFadeMs: 900,
  fadeOutMs: 2200,
  dormantMs: 1200,
  fadeInMs: 2400,
} as const;

export function pickAmbientSpawn(bounds: PhysicsBounds, width: number): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = bounds.maxX - bounds.minX;
  const spanY = bounds.maxY - bounds.minY;
  const fromLeft = Math.random() > 0.5;

  return {
    x: fromLeft
      ? bounds.minX + spanX * (0.02 + Math.random() * 0.12)
      : bounds.maxX - spanX * (0.02 + Math.random() * 0.12),
    y: bounds.minY + spanY * (0.12 + Math.random() * 0.28),
  };
}

export function ambientRespawnImpulse(width: number): Pick<PhysicsBallState, "vx" | "vy"> {
  const lateral = width < 640 ? 720 : width < 1024 ? 980 : 1240;
  const sign = Math.random() > 0.5 ? 1 : -1;

  return {
    vx: sign * lateral * (0.7 + Math.random() * 0.35),
    vy: -(320 + Math.random() * 280),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
/** Near-direct tracking so physics reads as real bounce, not springy lag. */
export const BALL_POSITION_SPRING = { stiffness: 1200, damping: 48, mass: 0.35 } as const;
