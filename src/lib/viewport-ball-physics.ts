export type PhysicsBall = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  squashX: number;
  squashY: number;
};

export type PhysicsBounds = {
  width: number;
  height: number;
};

const AIR_DRAG = 0.9988;
const WALL_RESTITUTION = 0.78;
const BALL_RESTITUTION = 0.82;
const MIN_SPEED = 0.28;
const MAX_SPEED = 9.5;

function clampSpeed(ball: PhysicsBall) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > MAX_SPEED) {
    ball.vx = (ball.vx / speed) * MAX_SPEED;
    ball.vy = (ball.vy / speed) * MAX_SPEED;
  } else if (speed < MIN_SPEED) {
    const angle = Math.random() * Math.PI * 2;
    ball.vx = Math.cos(angle) * MIN_SPEED;
    ball.vy = Math.sin(angle) * MIN_SPEED;
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

function decaySquash(ball: PhysicsBall) {
  ball.squashX += (1 - ball.squashX) * 0.2;
  ball.squashY += (1 - ball.squashY) * 0.2;
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

function resolveBallCollision(a: PhysicsBall, b: PhysicsBall) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;
  if (dist === 0 || dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;

  a.x -= nx * (overlap / 2);
  a.y -= ny * (overlap / 2);
  b.x += nx * (overlap / 2);
  b.y += ny * (overlap / 2);

  const dvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (dvn >= 0) return;

  const impulse = (-(1 + BALL_RESTITUTION) * dvn) / 2;
  a.vx -= impulse * nx;
  a.vy -= impulse * ny;
  b.vx += impulse * nx;
  b.vy += impulse * ny;

  const scatter = 1.6 + Math.random() * 2.6;
  const angleA = Math.random() * Math.PI * 2;
  const angleB = Math.random() * Math.PI * 2;
  a.vx += Math.cos(angleA) * scatter;
  a.vy += Math.sin(angleA) * scatter;
  b.vx += Math.cos(angleB) * scatter;
  b.vy += Math.sin(angleB) * scatter;

  const hitIntensity = 0.9 + Math.random() * 0.35;
  applySquash(a, -nx, -ny, hitIntensity);
  applySquash(b, nx, ny, hitIntensity);
}

export function createPhysicsBall(bounds: PhysicsBounds, radius: number): PhysicsBall {
  const margin = radius + 8;
  const x = margin + Math.random() * Math.max(1, bounds.width - margin * 2);
  const y = margin + Math.random() * Math.max(1, bounds.height - margin * 2);
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.7 + Math.random() * 2.2;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    squashX: 1,
    squashY: 1,
  };
}

/** Pull balls together so they collide, then physics sends them apart. */
export function convergeBalls(balls: PhysicsBall[]) {
  if (balls.length < 2) return;
  const [a, b] = balls;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;
  const rush = 4.8 + Math.random() * 2.8;

  a.vx += nx * rush;
  a.vy += ny * rush;
  b.vx -= nx * rush;
  b.vy -= ny * rush;
}

export function stepPhysics(balls: PhysicsBall[], bounds: PhysicsBounds) {
  for (const ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= AIR_DRAG;
    ball.vy *= AIR_DRAG;
    resolveWallCollision(ball, bounds);
    decaySquash(ball);
    clampSpeed(ball);
  }

  if (balls.length >= 2) {
    resolveBallCollision(balls[0], balls[1]);
  }
}

export function ballDiameterPx(viewportWidth: number) {
  return Math.min(viewportWidth * 0.62, 400);
}
