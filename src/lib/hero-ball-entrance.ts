import {
  getSectionBallBounds,
  type BasketballConfig,
  type PhysicsBallState,
} from "@/lib/ball-physics";

/** Sized for clear edge travel without dominating the hero. */
export const HERO_BALL_SIZE_SCALE = 0.52;

/**
 * Tuned like a soft rubber orb in vacuum-ish air:
 * long parabolic arcs, crisp wall kisses, graceful energy loss.
 */
export const HERO_BALL_PHYSICS: BasketballConfig = {
  gravity: 1980,
  restitution: 0.79,
  wallRestitution: 0.81,
  airFriction: 0.9982,
  floorFriction: 0.9,
  maxSpeed: 2600,
  sleepSpeed: 11,
};

export const ENTRANCE_PHYSICS: BasketballConfig = {
  ...HERO_BALL_PHYSICS,
  restitution: 0.83,
  wallRestitution: 0.86,
  gravity: 1880,
  maxSpeed: 2400,
  sleepSpeed: 10,
};

export function getEntranceMaxDurationMs(isPhone: boolean) {
  return isPhone ? 9_000 : 11_000;
}

export function getHeroBallDiameter(width: number, height: number, preferred: number) {
  const minAxis = Math.max(1, Math.min(width, height));
  const maxByRoom = Math.round(minAxis * 0.4);
  const minByRoom = Math.round(minAxis * 0.2);
  return Math.min(preferred, Math.max(minByRoom, Math.min(maxByRoom, preferred)));
}

/** Soft loft from the left edge — first bounce should kiss the far wall. */
export function getEntranceInitialState(
  width: number,
  height: number,
  radius: number,
): PhysicsBallState {
  const bounds = getSectionBallBounds(width, height, radius);
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX,
    y: bounds.minY + spanY * 0.28,
    vx: Math.max(980, spanX * 1.65),
    vy: -Math.max(380, spanY * 0.42),
  };
}

export function rollDeltaFromMotion(dx: number, dy: number, radius: number) {
  if (radius <= 0) return 0;
  return Math.hypot(dx, dy) / radius;
}

export function faceHintFromRoll(rollAngle: number, settled: boolean) {
  if (settled) return 0;
  const facing = Math.max(0, Math.cos(rollAngle * 0.9));
  return Math.min(0.28, (1 - facing) * 0.34);
}
