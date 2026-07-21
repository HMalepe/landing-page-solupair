import {
  getSectionBallBounds,
  type BasketballConfig,
  type PhysicsBallState,
} from "@/lib/ball-physics";

/** Sized for clear edge travel without dominating the hero. */
export const HERO_BALL_SIZE_SCALE = 0.5;

/**
 * Senior-tuned rubber orb:
 * floaty parabolic arcs, soft wall kisses, elegant energy bleed.
 */
export const HERO_BALL_PHYSICS: BasketballConfig = {
  gravity: 1760,
  restitution: 0.76,
  wallRestitution: 0.78,
  airFriction: 0.9988,
  floorFriction: 0.93,
  maxSpeed: 2200,
  sleepSpeed: 9,
};

export const ENTRANCE_PHYSICS: BasketballConfig = {
  ...HERO_BALL_PHYSICS,
  restitution: 0.8,
  wallRestitution: 0.82,
  gravity: 1680,
  maxSpeed: 2100,
  sleepSpeed: 8,
};

export function getEntranceMaxDurationMs(isPhone: boolean) {
  return isPhone ? 8_500 : 10_500;
}

export function getHeroBallDiameter(width: number, height: number, preferred: number) {
  const minAxis = Math.max(1, Math.min(width, height));
  const maxByRoom = Math.round(minAxis * 0.38);
  const minByRoom = Math.round(minAxis * 0.2);
  return Math.min(preferred, Math.max(minByRoom, Math.min(maxByRoom, preferred)));
}

/** Opening loft — deliberate, not frantic; first wall kiss lands mid-hero. */
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
    y: bounds.minY + spanY * 0.32,
    vx: Math.max(760, spanX * 1.35),
    vy: -Math.max(320, spanY * 0.36),
  };
}

export function rollDeltaFromMotion(dx: number, dy: number, radius: number) {
  if (radius <= 0) return 0;
  return Math.hypot(dx, dy) / radius;
}

export function faceHintFromRoll(rollAngle: number, settled: boolean) {
  if (settled) return 0;
  const facing = Math.max(0, Math.cos(rollAngle * 0.9));
  return Math.min(0.24, (1 - facing) * 0.3);
}
