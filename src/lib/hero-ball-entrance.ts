import {
  getSectionBallBounds,
  type BasketballConfig,
  type PhysicsBallState,
} from "@/lib/ball-physics";

/** Keep the ball small enough that edge-to-edge travel is obvious. */
export const HERO_BALL_SIZE_SCALE = 0.55;

/** Bounce physics — gravity + ~0.8 restitution, energy loss until settle. */
export const HERO_BALL_PHYSICS: BasketballConfig = {
  gravity: 2200,
  restitution: 0.8,
  wallRestitution: 0.82,
  airFriction: 0.997,
  floorFriction: 0.88,
  maxSpeed: 3200,
  sleepSpeed: 14,
};

export const ENTRANCE_PHYSICS: BasketballConfig = {
  ...HERO_BALL_PHYSICS,
  restitution: 0.82,
  wallRestitution: 0.85,
  gravity: 2100,
  maxSpeed: 3000,
  sleepSpeed: 12,
};

export function getEntranceMaxDurationMs(isPhone: boolean) {
  return isPhone ? 10_000 : 12_000;
}

/** Diameter capped so radius ≤ ~22% of the shorter hero axis (visible roam corridor). */
export function getHeroBallDiameter(width: number, height: number, preferred: number) {
  const minAxis = Math.max(1, Math.min(width, height));
  const maxByRoom = Math.round(minAxis * 0.44); // diameter; radius = 22% of min axis
  const minByRoom = Math.round(minAxis * 0.22);
  return Math.min(preferred, Math.max(minByRoom, Math.min(maxByRoom, preferred)));
}

/** Launch from a true left-edge contact so the first frame already kisses the wall. */
export function getEntranceInitialState(
  width: number,
  height: number,
  radius: number,
): PhysicsBallState {
  const bounds = getSectionBallBounds(width, height, radius);
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanY = Math.max(1, bounds.maxY - bounds.minY);

  const vx = Math.max(1400, spanX * 2.4);
  const vy = -Math.max(520, spanY * 0.55);

  return {
    x: bounds.minX,
    y: bounds.minY + spanY * 0.2,
    vx,
    vy,
  };
}

export function rollDeltaFromMotion(dx: number, dy: number, radius: number) {
  if (radius <= 0) return 0;
  return Math.hypot(dx, dy) / radius;
}

export function faceHintFromRoll(rollAngle: number, settled: boolean) {
  if (settled) return 0;
  const facing = Math.max(0, Math.cos(rollAngle * 0.9));
  return Math.min(0.32, (1 - facing) * 0.38);
}
