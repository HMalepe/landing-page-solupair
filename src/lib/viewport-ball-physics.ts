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
  wanderPhase: number;
  contactLeft: boolean;
  contactRight: boolean;
  contactTop: boolean;
  contactBottom: boolean;
};

export type PhysicsBounds = {
  width: number;
  height: number;
};

/** Gentle coast — high drag made balls hit min-speed and snap direction. */
const AIR_DRAG_PER_S = 0.55;
const WALL_RESTITUTION = 0.88;
const BALL_RESTITUTION = 0.82;
const MIN_SPEED = 0.55;
const MAX_SPEED = 2.8;
const MAX_DT = 1 / 30;
/** Simulation units roughly map to CSS px when multiplied by this. */
const PX_PER_UNIT = 60;
const FIXED_STEP = 1 / 60;
const MAX_SUBSTEPS = 4;

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
    const s = maxSpeed / speed;
    ball.vx *= s;
    ball.vy *= s;
    return;
  }
  if (speed < 1e-5) {
    // Cold start only — keep heading from drift, never pick a random snap.
    ball.vx = Math.cos(ball.driftAngle) * minSpeed;
    ball.vy = Math.sin(ball.driftAngle) * minSpeed;
    return;
  }
  if (speed < minSpeed) {
    const s = minSpeed / speed;
    ball.vx *= s;
    ball.vy *= s;
  }
}

function applySquash(ball: PhysicsBall, nx: number, ny: number, intensity: number) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const soften = Math.min(1.35, Math.max(0, intensity));
  if (ax > ay) {
    ball.squashX = Math.min(ball.squashX, 1 - 0.34 * soften);
    ball.squashY = Math.max(ball.squashY, 1 + 0.2 * soften);
  } else {
    ball.squashX = Math.max(ball.squashX, 1 + 0.2 * soften);
    ball.squashY = Math.min(ball.squashY, 1 - 0.34 * soften);
  }
}

function decaySquash(ball: PhysicsBall, dt: number) {
  const pressed = ball.contactLeft || ball.contactRight || ball.contactTop || ball.contactBottom;
  const rate = 1 - Math.exp(-(pressed ? 5 : 9) * dt);
  ball.squashX += (1 - ball.squashX) * rate;
  ball.squashY += (1 - ball.squashY) * rate;
}

function resolveWallCollision(ball: PhysicsBall, bounds: PhysicsBounds) {
  const { width, height } = bounds;
  const r = ball.radius;
  let hit = false;

  ball.contactLeft = false;
  ball.contactRight = false;
  ball.contactTop = false;
  ball.contactBottom = false;

  if (ball.x - r < 0) {
    ball.x = r;
    ball.contactLeft = true;
    if (ball.vx < 0) {
      ball.vx = -ball.vx * WALL_RESTITUTION;
      ball.vy *= 0.98;
      applySquash(ball, 1, 0, 0.7 + Math.min(0.55, Math.abs(ball.vx) / ball.maxSpeed));
      hit = true;
    } else {
      applySquash(ball, 1, 0, 0.42);
    }
  } else if (ball.x + r > width) {
    ball.x = width - r;
    ball.contactRight = true;
    if (ball.vx > 0) {
      ball.vx = -ball.vx * WALL_RESTITUTION;
      ball.vy *= 0.98;
      applySquash(ball, -1, 0, 0.7 + Math.min(0.55, Math.abs(ball.vx) / ball.maxSpeed));
      hit = true;
    } else {
      applySquash(ball, -1, 0, 0.42);
    }
  }

  if (ball.y - r < 0) {
    ball.y = r;
    ball.contactTop = true;
    if (ball.vy < 0) {
      ball.vy = -ball.vy * WALL_RESTITUTION;
      ball.vx *= 0.98;
      applySquash(ball, 0, 1, 0.7 + Math.min(0.55, Math.abs(ball.vy) / ball.maxSpeed));
      hit = true;
    } else {
      applySquash(ball, 0, 1, 0.42);
    }
  } else if (ball.y + r > height) {
    ball.y = height - r;
    ball.contactBottom = true;
    if (ball.vy > 0) {
      ball.vy = -ball.vy * WALL_RESTITUTION;
      ball.vx *= 0.98;
      applySquash(ball, 0, -1, 0.7 + Math.min(0.55, Math.abs(ball.vy) / ball.maxSpeed));
      hit = true;
    } else {
      applySquash(ball, 0, -1, 0.42);
    }
  }

  // Nudge heading after a wall so drift doesn't fight the bounce.
  if (hit) {
    ball.driftAngle = Math.atan2(ball.vy, ball.vx);
  }
}

function resolveBallCollision(a: PhysicsBall, b: PhysicsBall) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;
  if (dist >= minDist) return;

  const nx = dist > 1e-6 ? dx / dist : 1;
  const ny = dist > 1e-6 ? dy / dist : 0;
  const overlap = minDist - (dist > 1e-6 ? dist : 0);

  a.x -= nx * (overlap * 0.5);
  a.y -= ny * (overlap * 0.5);
  b.x += nx * (overlap * 0.5);
  b.y += ny * (overlap * 0.5);

  const dvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (dvn >= 0) return;

  const impulse = (-(1 + BALL_RESTITUTION) * dvn) / 2;
  a.vx -= impulse * nx;
  a.vy -= impulse * ny;
  b.vx += impulse * nx;
  b.vy += impulse * ny;

  const intensity = Math.min(1, Math.abs(dvn) / Math.max(a.maxSpeed, b.maxSpeed));
  applySquash(a, -nx, -ny, 0.55 + intensity * 0.35);
  applySquash(b, nx, ny, 0.55 + intensity * 0.35);
}

function integrateBall(ball: PhysicsBall, dt: number) {
  // Slow wander: angle meanders; force stays small so paths feel intentional.
  ball.wanderPhase += dt * (0.55 + ball.driftStrength * 0.35);
  ball.driftAngle +=
    Math.sin(ball.wanderPhase) * (0.55 + ball.driftStrength * 0.4) * dt +
    Math.sin(ball.wanderPhase * 0.37 + 1.7) * 0.22 * dt;

  const cruise = (ball.minSpeed + ball.maxSpeed) * 0.42;
  const speed = Math.hypot(ball.vx, ball.vy);
  const alongDrift = Math.cos(ball.driftAngle) * ball.vx + Math.sin(ball.driftAngle) * ball.vy;
  const targetAlong = cruise * (0.85 + ball.driftStrength * 0.25);
  const steer = (targetAlong - alongDrift) * (0.55 + ball.driftStrength * 0.35);
  const lateral = (cruise - speed) * 0.18;

  ball.vx += (Math.cos(ball.driftAngle) * steer + Math.cos(ball.driftAngle + Math.PI / 2) * lateral * 0.35) * dt;
  ball.vy += (Math.sin(ball.driftAngle) * steer + Math.sin(ball.driftAngle + Math.PI / 2) * lateral * 0.35) * dt;

  ball.x += ball.vx * dt * PX_PER_UNIT;
  ball.y += ball.vy * dt * PX_PER_UNIT;

  const dragFactor = Math.exp(-AIR_DRAG_PER_S * dt);
  ball.vx *= dragFactor;
  ball.vy *= dragFactor;

  decaySquash(ball, dt);
  clampSpeed(ball, ball.minSpeed, ball.maxSpeed);
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
    driftStrength = 0.45 + Math.random() * 0.35,
  } = config;

  const margin = radius + 8;
  const usableW = Math.max(1, bounds.width - margin * 2);
  const usableH = Math.max(1, bounds.height - margin * 2);
  const x = margin + Math.random() * usableW;
  const y = margin + Math.random() * usableH;
  const speed = (0.85 + Math.random() * 0.45) * speedScale;

  return {
    x,
    y,
    vx: Math.cos(driftAngle) * speed,
    vy: Math.sin(driftAngle) * speed,
    radius,
    squashX: 1,
    squashY: 1,
    minSpeed: minSpeed * speedScale,
    maxSpeed: maxSpeed * Math.max(0.85, speedScale),
    driftAngle,
    driftStrength,
    wanderPhase: Math.random() * Math.PI * 2,
    contactLeft: false,
    contactRight: false,
    contactTop: false,
    contactBottom: false,
  };
}

export function stepPhysics(balls: PhysicsBall[], bounds: PhysicsBounds, dt: number) {
  const clamped = Math.min(Math.max(dt, 0), MAX_DT);
  let remaining = clamped;
  let steps = 0;

  while (remaining > 0 && steps < MAX_SUBSTEPS) {
    const stepDt = Math.min(FIXED_STEP, remaining);
    remaining -= stepDt;
    steps += 1;

    for (const ball of balls) {
      integrateBall(ball, stepDt);
      resolveWallCollision(ball, bounds);
      clampSpeed(ball, ball.minSpeed, ball.maxSpeed);
    }

    if (balls.length >= 2) {
      resolveBallCollision(balls[0], balls[1]);
      resolveWallCollision(balls[0], bounds);
      resolveWallCollision(balls[1], bounds);
    }
  }
}

/** Top-left + scale, with contact edge pinned to the wall while squashed. */
export function ballRenderTransform(ball: PhysicsBall) {
  const d = ball.radius * 2;
  let tx = ball.x - ball.radius;
  let ty = ball.y - ball.radius;
  if (ball.contactLeft) tx -= ball.radius * (1 - ball.squashX);
  else if (ball.contactRight) tx += ball.radius * (1 - ball.squashX);
  if (ball.contactTop) ty -= ball.radius * (1 - ball.squashY);
  else if (ball.contactBottom) ty += ball.radius * (1 - ball.squashY);

  const sx = Math.round(ball.squashX * 1000) / 1000;
  const sy = Math.round(ball.squashY * 1000) / 1000;
  return { d, tx, ty, sx, sy };
}

export function ballDiameterPx(viewportWidth: number) {
  return Math.min(viewportWidth * 0.62, 400);
}
