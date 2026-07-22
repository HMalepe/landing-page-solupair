import type { BasketballConfig, PhysicsBallState, PhysicsBounds } from "@/lib/ball-physics";

/** Ambient: silk arcs, hard stop, dissolve in place, still blur-in. */
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
  /** Hold fully still before dissolving. */
  restBeforeFadeMs: 900,
  fadeOutMs: 1600,
  dormantMs: 480,
  fadeInMs: 1300,
  /** Smile bloom while still after blur-in. */
  smileMs: 1100,
  /** Pause smiling before the next gentle loft. */
  holdBeforeLoftMs: 700,
} as const;

export function pickAmbientSpawn(bounds: PhysicsBounds): Pick<PhysicsBallState, "x" | "y"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.22 + Math.random() * 0.56),
    // Slightly above the floor so the still reappear reads clearly, then a soft loft continues the loop later.
    y: bounds.minY + spanY * (0.28 + Math.random() * 0.22),
  };
}

/** Gentle next-rally loft — only after a full still reappear + smile, never right after settle. */
export function ambientNextLoftImpulse(
  bounds: PhysicsBounds,
): Pick<PhysicsBallState, "vx" | "vy"> {
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);
  const sign = Math.random() < 0.5 ? -1 : 1;

  return {
    vx: sign * (220 + Math.random() * 160) * (0.5 + spanX / 2800),
    vy: -(380 + Math.random() * 140) * (0.55 + spanY / 1800),
  };
}

export const BALL_PRESENCE_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
