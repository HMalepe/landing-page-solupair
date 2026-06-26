export type HeroBallState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  squashX: number;
  squashY: number;
};

export type HeroDragBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const GRAVITY = 0.38;
const AIR_DRAG = 0.989;
const WALL_RESTITUTION = 0.72;
const SETTLE_SPEED = 0.12;
const SETTLE_DIST = 0.35;

function applyHomePull(state: HeroBallState) {
  const dist = Math.hypot(state.x, state.y);
  if (dist < 0.001) return;

  const speed = Math.hypot(state.vx, state.vy);
  const distFactor = Math.min(dist / 320, 1);
  const slowFactor = speed < 2.2 ? 1 + (2.2 - speed) * 0.35 : 1;
  const pull = (0.0028 + distFactor * 0.0055) * slowFactor;

  state.vx -= state.x * pull;
  state.vy -= state.y * pull;
}

function applySquash(state: HeroBallState, nx: number, ny: number, intensity: number) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  if (ax > ay) {
    state.squashX = Math.min(state.squashX, 1 - 0.24 * intensity);
    state.squashY = Math.max(state.squashY, 1 + 0.13 * intensity);
  } else {
    state.squashX = Math.max(state.squashX, 1 + 0.13 * intensity);
    state.squashY = Math.min(state.squashY, 1 - 0.24 * intensity);
  }
}

function decaySquash(state: HeroBallState) {
  state.squashX += (1 - state.squashX) * 0.22;
  state.squashY += (1 - state.squashY) * 0.22;
}

export function createHeroBallState(x: number, y: number, vx: number, vy: number): HeroBallState {
  return { x, y, vx, vy, squashX: 1, squashY: 1 };
}

export function measureHeroDragBounds(
  playArea: HTMLElement,
  ballEl: HTMLElement,
  offsetX: number,
  offsetY: number,
): HeroDragBounds {
  const areaRect = playArea.getBoundingClientRect();
  const ballRect = ballEl.getBoundingClientRect();
  const radius = ballRect.width / 2;
  const centerX = ballRect.left + radius - offsetX;
  const centerY = ballRect.top + radius - offsetY;

  return {
    left: areaRect.left + radius - centerX,
    right: areaRect.right - radius - centerX,
    top: areaRect.top + radius - centerY,
    bottom: areaRect.bottom - radius - centerY,
  };
}

export function stepHeroBallPhysics(state: HeroBallState, bounds: HeroDragBounds): boolean {
  applyHomePull(state);

  state.vy += GRAVITY;
  state.x += state.vx;
  state.y += state.vy;
  state.vx *= AIR_DRAG;
  state.vy *= AIR_DRAG;

  if (state.x < bounds.left) {
    state.x = bounds.left;
    state.vx = Math.abs(state.vx) * WALL_RESTITUTION;
    applySquash(state, 1, 0, 0.9);
  } else if (state.x > bounds.right) {
    state.x = bounds.right;
    state.vx = -Math.abs(state.vx) * WALL_RESTITUTION;
    applySquash(state, -1, 0, 0.9);
  }

  if (state.y < bounds.top) {
    state.y = bounds.top;
    state.vy = Math.abs(state.vy) * WALL_RESTITUTION;
    applySquash(state, 0, 1, 0.9);
  } else if (state.y > bounds.bottom) {
    state.y = bounds.bottom;
    state.vy = -Math.abs(state.vy) * WALL_RESTITUTION;
    applySquash(state, 0, -1, 0.95);
  }

  decaySquash(state);

  const speed = Math.hypot(state.vx, state.vy);
  const dist = Math.hypot(state.x, state.y);

  if (dist < 24 && speed < 0.55) {
    const creep = 0.018 + (24 - dist) * 0.0012;
    state.vx -= state.x * creep;
    state.vy -= state.y * creep;
  }

  if (speed < SETTLE_SPEED && dist < SETTLE_DIST) {
    state.x = 0;
    state.y = 0;
    state.vx = 0;
    state.vy = 0;
    state.squashX = 1;
    state.squashY = 1;
    return true;
  }

  return false;
}

/** Framer drag velocity (px/s) → simulation velocity (px/frame). */
export function dragVelocityToSim(vx: number, vy: number) {
  return { vx: vx * 0.014, vy: vy * 0.014 };
}
