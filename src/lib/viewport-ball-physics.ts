export type PhysicsBall = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  squashX: number;
  squashY: number;
  minSpeed: number;
  maxSpeed: number;
  driftAngle: number;
  driftStrength: number;
};

export type PhysicsBounds = {
  width: number;
  height: number;
};

const AIR_DRAG_PER_S = 3.5;
const WALL_RESTITUTION = 0.76;
const MIN_SPEED = 0.18;
const MAX_SPEED = 7.2;
const MAX_DT = 1 / 45;

export type PhysicsBallConfig = {
  speedScale?: number;
  minSpeed?: number;
  maxSpeed?: number;
  driftAngle?: number;
  driftStrength?: number;
};

function clampSpeed(ball: PhysicsBall, minSpeed: number, maxSpeed: number) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > maxSpeed) {
    ball.vx = (ball.vx / speed) * maxSpeed;
    ball.vy = (ball.vy / speed) * maxSpeed;
  } else if (speed < minSpeed) {
    const angle = Math.random() * Math.PI * 2;
    ball.vx = Math.cos(angle) * minSpeed;
    ball.vy = Math.sin(angle) * minSpeed;
  }
}

function applySquash(ball: PhysicsBall, nx: number, ny: number, intensity: number) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  if (ax > ay) {
    ball.squashX = Math.min(ball.squashX, 1 - 0.26 * intensity);
    ball.squashY = Math.max(ball.squashY, 1 + 0.14 * intensity);
  } else {
    ball.squashX = Math.max(ball.squashX, 1 + 0.14 * intensity);
    ball.squashY = Math.min(ball.squashY, 1 - 0.26 * intensity);
  }
}

function decaySquash(ball: PhysicsBall, dt: number) {
  const rate = 1 - Math.exp(-12 * dt);
  ball.squashX += (1 - ball.squashX) * rate;
  ball.squashY += (1 - ball.squashY) * rate;
}

function resolveWallCollision(ball: PhysicsBall, bounds: PhysicsBounds) {
  const { width, height } = bounds;
  const r = ball.radius;

  if (ball.x - r < 0) {
    ball.x = r;
    ball.vx = Math.abs(ball.vx) * WALL_RESTITUTION;
    applySquash(ball, 1, 0, 0.85 + Math.random() * 0.15);
  } else if (ball.x + r > width) {
    ball.x = width - r;
    ball.vx = -Math.abs(ball.vx) * WALL_RESTITUTION;
    applySquash(ball, -1, 0, 0.85 + Math.random() * 0.15);
  }

  if (ball.y - r < 0) {
    ball.y = r;
    ball.vy = Math.abs(ball.vy) * WALL_RESTITUTION;
    applySquash(ball, 0, 1, 0.85 + Math.random() * 0.15);
  } else if (ball.y + r > height) {
    ball.y = height - r;
    ball.vy = -Math.abs(ball.vy) * WALL_RESTITUTION;
    applySquash(ball, 0, -1, 0.85 + Math.random() * 0.15);
  }
}

export function createPhysicsBall(
  bounds: PhysicsBounds,
  radius: number,
  config: PhysicsBallConfig = {},
): PhysicsBall {
  const {
    speedScale = 1,
    minSpeed = MIN_SPEED,
    maxSpeed = MAX_SPEED,
    driftAngle = Math.random() * Math.PI * 2,
    driftStrength = 0.35 + Math.random() * 0.55,
  } = config;

  const margin = radius + 8;
  const x = margin + Math.random() * Math.max(1, bounds.width - margin * 2);
  const y = margin + Math.random() * Math.max(1, bounds.height - margin * 2);
  const angle = Math.random() * Math.PI * 2;
  const speed = (1.05 + Math.random() * 1.15) * speedScale;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    squashX: 1,
    squashY: 1,
    minSpeed,
    maxSpeed,
    driftAngle,
    driftStrength,
  };
}

export function stepPhysics(balls: PhysicsBall[], bounds: PhysicsBounds, dt: number) {
  const stepDt = Math.min(Math.max(dt, 0), MAX_DT);
  const dragFactor = Math.exp(-AIR_DRAG_PER_S * stepDt);

  for (const ball of balls) {
    ball.driftAngle += stepDt * (0.35 + ball.driftStrength * 0.25);
    const drift = ball.driftStrength * 18 * stepDt;
    ball.vx += Math.cos(ball.driftAngle) * drift;
    ball.vy += Math.sin(ball.driftAngle) * drift;

    ball.x += ball.vx * stepDt * 60;
    ball.y += ball.vy * stepDt * 60;
    ball.vx *= dragFactor;
    ball.vy *= dragFactor;
    resolveWallCollision(ball, bounds);
    decaySquash(ball, stepDt);
    clampSpeed(ball, ball.minSpeed, ball.maxSpeed);
  }
}

export function ballDiameterPx(viewportWidth: number) {
  return Math.min(viewportWidth * 0.62, 400);
}
