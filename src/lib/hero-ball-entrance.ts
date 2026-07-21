import {
  getSectionBallBounds,
  type BasketballConfig,
  type PhysicsBallState,
} from "@/lib/ball-physics";

/** Hero ball is 30% smaller than the original sizing for wider travel room. */
export const HERO_BALL_SIZE_SCALE = 0.7;

/** Bounce physics — gravity + 0.78–0.85 restitution, settles after energy loss. */
export const HERO_BALL_PHYSICS: BasketballConfig = {
  gravity: 2100,
  restitution: 0.8,
  wallRestitution: 0.82,
  airFriction: 0.9972,
  floorFriction: 0.9,
  maxSpeed: 2800,
  sleepSpeed: 11,
};

/** Entrance — lively first rally that still reaches every edge. */
export const ENTRANCE_PHYSICS: BasketballConfig = {
  ...HERO_BALL_PHYSICS,
  restitution: 0.82,
  wallRestitution: 0.84,
  gravity: 2050,
  maxSpeed: 2600,
  sleepSpeed: 10,
};

export function getEntranceMaxDurationMs(isPhone: boolean) {
  return isPhone ? 14_000 : 17_000;
}

/** Launch from the left — slow roll right, wall bounce, then settle on the floor. */
export function getEntranceInitialState(
  width: number,
  height: number,
  radius: number,
): PhysicsBallState {
  const bounds = getSectionBallBounds(width, height, radius);
  const spanY = bounds.maxY - bounds.minY;

  const vx =
    width < 400 ? 1180 : width < 640 ? 1420 : width < 1024 ? 1680 : 1980;
  const vy = -Math.min(420, spanY * 0.28);

  return {
    x: bounds.minX + radius * 0.02,
    y: bounds.minY + spanY * 0.18,
    vx,
    vy,
  };
}

/** Radians rolled from arc length — drives 360° sphere lighting. */
export function rollDeltaFromMotion(dx: number, dy: number, radius: number) {
  if (radius <= 0) return 0;
  return Math.hypot(dx, dy) / radius;
}

/** Subtle face peek while the ball is still rolling. */
export function faceHintFromRoll(rollAngle: number, settled: boolean) {
  if (settled) return 0;
  const facing = Math.max(0, Math.cos(rollAngle * 0.9));
  return Math.min(0.32, (1 - facing) * 0.38);
}
