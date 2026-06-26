export type SpherePhase = "floating" | "dragging" | "airborne" | "resting" | "rolling" | "lifting";

export type SphereBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type SphereRenderState = {
  x: number;
  y: number;
  rotation: number;
  squashX: number;
  squashY: number;
  breathScale: number;
  shadowScaleX: number;
  shadowScaleY: number;
  shadowOpacity: number;
  motionBlur: number;
  speed: number;
};

const GRAVITY = 1680;
const AIR_DRAG = 0.12;
const MASS = 1.35;
const DRAG_STIFFNESS = 148;
const DRAG_DAMPING = 20;
const REST_PAUSE_S = 3;
const MAX_DT = 1 / 45;

export class HeroSphereSimulator {
  phase: SpherePhase = "floating";
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  rotation = 0;
  angularVelocity = 0;
  squashX = 1;
  squashY = 1;
  breathScale = 1;
  clock = 0;
  restElapsed = 0;
  radius = 180;
  bounds: SphereBounds = { left: -280, right: 280, top: -180, bottom: 320 };

  private grabOffsetX = 0;
  private grabOffsetY = 0;
  private targetX = 0;
  private targetY = 0;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastPointerT = 0;
  private bounceEnergy = 1;

  setBounds(bounds: SphereBounds, radius: number) {
    this.bounds = bounds;
    this.radius = radius;
  }

  pointerDown(offsetX: number, offsetY: number, pointerX: number, pointerY: number) {
    this.phase = "dragging";
    this.grabOffsetX = offsetX - pointerX;
    this.grabOffsetY = offsetY - pointerY;
    this.targetX = pointerX + this.grabOffsetX;
    this.targetY = pointerY + this.grabOffsetY;
    this.lastPointerX = pointerX;
    this.lastPointerY = pointerY;
    this.lastPointerT = performance.now();
    this.bounceEnergy = 1;
  }

  pointerMove(pointerX: number, pointerY: number) {
    if (this.phase !== "dragging") return;
    const now = performance.now();
    const dt = Math.min((now - this.lastPointerT) / 1000, MAX_DT);
    if (dt > 0) {
      const instVx = (pointerX - this.lastPointerX) / dt;
      const instVy = (pointerY - this.lastPointerY) / dt;
      this.vx = this.vx * 0.55 + instVx * 0.45;
      this.vy = this.vy * 0.55 + instVy * 0.45;
    }
    this.lastPointerX = pointerX;
    this.lastPointerY = pointerY;
    this.lastPointerT = now;
    this.targetX = pointerX + this.grabOffsetX;
    this.targetY = pointerY + this.grabOffsetY;
  }

  pointerUp() {
    if (this.phase !== "dragging") return;
    this.phase = "airborne";
    this.bounceEnergy = 0.85 + Math.random() * 0.12;
  }

  step(dt: number) {
    const stepDt = Math.min(Math.max(dt, 0), MAX_DT);
    this.clock += stepDt;

    switch (this.phase) {
      case "floating":
        this.stepFloating(stepDt);
        break;
      case "dragging":
        this.stepDragging(stepDt);
        break;
      case "airborne":
        this.stepAirborne(stepDt);
        break;
      case "resting":
        this.stepResting(stepDt);
        break;
      case "rolling":
        this.stepRolling(stepDt);
        break;
      case "lifting":
        this.stepLifting(stepDt);
        break;
    }

    this.decaySquash(stepDt);
  }

  getRenderState(): SphereRenderState {
    const speed = Math.hypot(this.vx, this.vy);
    const heightNorm = Math.max(0, Math.min(1, (this.bounds.bottom - this.y) / Math.max(1, this.bounds.bottom - this.bounds.top)));
    const shadowScale = 0.82 + heightNorm * 0.28;
    const shadowOpacity = 0.22 + heightNorm * 0.2;
    const motionBlur = Math.min(10, speed * 0.018);

    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      squashX: this.squashX,
      squashY: this.squashY,
      breathScale: this.breathScale,
      shadowScaleX: shadowScale * (1 + (1 - this.squashX) * 0.35),
      shadowScaleY: shadowScale * (1 + (1 - this.squashY) * 0.2),
      shadowOpacity,
      motionBlur,
      speed,
    };
  }

  private stepFloating(dt: number) {
    const t = this.clock;
    const bobX = Math.sin(t * 0.72) * 3 + Math.sin(t * 1.35) * 1.4;
    const bobY = Math.sin(t * 0.58) * 4.5 + Math.cos(t * 0.93) * 2;
    this.x = bobX;
    this.y = bobY;
    this.vx = 0;
    this.vy = 0;
    this.breathScale = 1 + Math.sin(t * 0.85) * 0.014;
    this.rotation += (0.018 + Math.sin(t * 0.41) * 0.012) * dt;
    this.angularVelocity = 0;
  }

  private stepDragging(dt: number) {
    const ax = ((this.targetX - this.x) * DRAG_STIFFNESS - this.vx * DRAG_DAMPING) / MASS;
    const ay = ((this.targetY - this.y) * DRAG_STIFFNESS - this.vy * DRAG_DAMPING) / MASS;
    this.vx += ax * dt;
    this.vy += ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.vx * 0.00035;
    this.breathScale = 1 + Math.sin(this.clock * 1.4) * 0.006;
    this.clampWalls(false);
  }

  private stepAirborne(dt: number) {
    this.vy += GRAVITY * dt;
    const dragFactor = Math.exp(-AIR_DRAG * dt);
    this.vx *= dragFactor;
    this.vy *= dragFactor;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.vx * 0.00045;

    this.clampWalls(true);

    if (this.y >= this.bounds.bottom && this.vy >= 0) {
      this.y = this.bounds.bottom;
      const impact = Math.min(1, Math.abs(this.vy) / 920);
      const restitution = 0.62 + Math.random() * 0.16 * this.bounceEnergy;
      this.vy = -Math.abs(this.vy) * restitution;
      this.vx *= 0.94 + Math.random() * 0.04;
      this.applySquash(0, -1, 0.55 + impact * 0.45);
      this.bounceEnergy *= 0.72 + Math.random() * 0.08;
      this.angularVelocity = this.vx / this.radius;

      const energy = Math.hypot(this.vx, this.vy);
      if (energy < 95 && impact < 0.35) {
        this.enterResting();
      }
    }
  }

  private stepResting(dt: number) {
    this.y = this.bounds.bottom;
    this.vx *= Math.exp(-6 * dt);
    this.vy = 0;
    this.x += this.vx * dt;
    this.restElapsed += dt;
    this.rotation += this.angularVelocity * dt;
    this.angularVelocity *= Math.exp(-4 * dt);
    this.breathScale = 1 + Math.sin(this.clock * 0.6) * 0.004;

    if (this.restElapsed >= REST_PAUSE_S) {
      this.phase = "rolling";
      const toward = -Math.sign(this.x) || -1;
      this.vx = toward * (55 + Math.random() * 35);
      this.angularVelocity = this.vx / this.radius;
    }
  }

  private stepRolling(dt: number) {
    this.y = this.bounds.bottom;
    const toOrigin = -this.x;
    const desiredVx = Math.sign(toOrigin) * Math.min(Math.abs(toOrigin) * 1.8, 110);
    this.vx += (desiredVx - this.vx) * Math.min(1, 3.2 * dt);
    this.vx *= Math.exp(-1.1 * dt);
    this.x += this.vx * dt;
    this.angularVelocity = this.vx / this.radius;
    this.rotation += this.angularVelocity * dt;
    this.breathScale = 1;

    if (Math.abs(this.x) < 5 && Math.abs(this.vx) < 12) {
      this.phase = "lifting";
      this.vx = 0;
      this.angularVelocity *= 0.4;
    }
  }

  private stepLifting(dt: number) {
    const liftK = 42;
    const liftD = 9;
    const ax = (-this.x * liftK - this.vx * liftD) / MASS;
    const ay = ((0 - this.y) * liftK - this.vy * liftD) / MASS;
    this.vy += ay * dt;
    this.vx += ax * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.angularVelocity * dt;
    this.angularVelocity *= Math.exp(-2.5 * dt);
    this.breathScale = 1 + Math.sin(this.clock * 0.9) * 0.01;

    const dist = Math.hypot(this.x, this.y);
    const speed = Math.hypot(this.vx, this.vy);
    if (dist < 6 && speed < 28) {
      this.phase = "floating";
      this.vx = 0;
      this.vy = 0;
      this.restElapsed = 0;
      this.bounceEnergy = 1;
    }
  }

  private enterResting() {
    this.phase = "resting";
    this.restElapsed = 0;
    this.y = this.bounds.bottom;
    this.vy = 0;
  }

  private clampWalls(bounce: boolean) {
    if (this.x < this.bounds.left) {
      this.x = this.bounds.left;
      if (bounce && this.vx < 0) {
        this.vx = -this.vx * (0.58 + Math.random() * 0.14);
        this.applySquash(1, 0, 0.75);
      }
    } else if (this.x > this.bounds.right) {
      this.x = this.bounds.right;
      if (bounce && this.vx > 0) {
        this.vx = -this.vx * (0.58 + Math.random() * 0.14);
        this.applySquash(-1, 0, 0.75);
      }
    }

    if (this.y < this.bounds.top) {
      this.y = this.bounds.top;
      if (bounce && this.vy < 0) {
        this.vy = -this.vy * (0.55 + Math.random() * 0.12);
        this.applySquash(0, 1, 0.7);
      }
    }
  }

  private applySquash(nx: number, ny: number, intensity: number) {
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    if (ax > ay) {
      this.squashX = Math.min(this.squashX, 1 - 0.28 * intensity);
      this.squashY = Math.max(this.squashY, 1 + 0.16 * intensity);
    } else {
      this.squashX = Math.max(this.squashX, 1 + 0.14 * intensity);
      this.squashY = Math.min(this.squashY, 1 - 0.28 * intensity);
    }
  }

  private decaySquash(dt: number) {
    const rate = 1 - Math.exp(-14 * dt);
    this.squashX += (1 - this.squashX) * rate;
    this.squashY += (1 - this.squashY) * rate;
  }
}

export function measureSphereBounds(
  playArea: HTMLElement,
  anchorEl: HTMLElement,
  radius: number,
): SphereBounds {
  const areaRect = playArea.getBoundingClientRect();
  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorCX = anchorRect.left + anchorRect.width / 2;
  const anchorCY = anchorRect.top + anchorRect.height / 2;

  return {
    left: areaRect.left + radius - anchorCX,
    right: areaRect.right - radius - anchorCX,
    top: areaRect.top + radius - anchorCY,
    bottom: areaRect.bottom - radius - anchorCY,
  };
}

export function clientToSphereOffset(clientX: number, clientY: number, anchorEl: HTMLElement) {
  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorCX = anchorRect.left + anchorRect.width / 2;
  const anchorCY = anchorRect.top + anchorRect.height / 2;
  return { x: clientX - anchorCX, y: clientY - anchorCY };
}
