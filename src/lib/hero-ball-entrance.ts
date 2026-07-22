import {
  getSectionBallBounds,
  type BasketballConfig,
  type PhysicsBallState,
} from "@/lib/ball-physics";

/** Sized for clear edge travel without dominating the hero. */
export const HERO_BALL_SIZE_SCALE = 0.5;

/**
 * Interactive throw physics (drag / release).
 */
export const HERO_BALL_PHYSICS: BasketballConfig = {
  gravity: 1760,
  restitution: 0.76,
  wallRestitution: 0.78,
  airFriction: 0.9988,
  floorFriction: 0.93,
  maxSpeed: 4200,
  sleepSpeed: 9,
};

/** Kept for throw continuity — opening no longer uses a violent entrance rally. */
export const ENTRANCE_PHYSICS: BasketballConfig = {
  ...HERO_BALL_PHYSICS,
  restitution: 0.62,
  wallRestitution: 0.6,
  gravity: 1680,
  maxSpeed: 2800,
  sleepSpeed: 14,
};

export function getEntranceMaxDurationMs(isPhone: boolean) {
  return isPhone ? 2_400 : 2_800;
}

export function getHeroBallDiameter(width: number, height: number, preferred: number) {
  const minAxis = Math.max(1, Math.min(width, height));
  const maxByRoom = Math.round(minAxis * 0.38);
  const minByRoom = Math.round(minAxis * 0.2);
  return Math.min(preferred, Math.max(minByRoom, Math.min(maxByRoom, preferred)));
}

/** Soft mid-air open — still; gravity starts the first drop after blur-in. */
export function getEntranceInitialState(
  width: number,
  height: number,
  radius: number,
): PhysicsBallState {
  const bounds = getSectionBallBounds(width, height, radius);
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  return {
    x: bounds.minX + spanX * (0.28 + Math.random() * 0.44),
    y: bounds.minY + spanY * (0.12 + Math.random() * 0.28),
    vx: 0,
    vy: 0,
  };
}

export function rollDeltaFromMotion(dx: number, dy: number, radius: number) {
  if (radius <= 0) return 0;
  return Math.hypot(dx, dy) / radius;
}

export function faceHintFromRoll(rollAngle: number, settled: boolean) {
  if (settled) return 0;
  const facing = Math.max(0, Math.cos(rollAngle * 0.9));
  return Math.min(0.18, (1 - facing) * 0.22);
}
