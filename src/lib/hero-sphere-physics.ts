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

const GRAVITY = 1580;
const AIR_DRAG = 0.18;
const MASS = 1.35;
const DRAG_STIFFNESS = 128;
const DRAG_DAMPING = 22;
const REST_PAUSE_S = 2.6;
const MAX_DT = 1 / 50;
const MAX_ANGULAR_VELOCITY = 0.42;
const MAX_THROW_SPEED = 1180;
const MAX_AIR_SPEED = 1450;
const SETTLE_SPEED = 78;

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
  /** Which edges the sphere is currently pressed against (for pin + sustained mush). */
  private contactLeft = false;
  private contactRight = false;
  private contactTop = false;
  private contactBottom = false;

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
    const rawDt = (now - this.lastPointerT) / 1000;
    // Ignore micro-frames — they explode throw velocity (classic fling glitch).
    const dt = Math.min(Math.max(rawDt, 1 / 120), MAX_DT);
    if (rawDt > 0) {
      let instVx = (pointerX - this.lastPointerX) / dt;
      let instVy = (pointerY - this.lastPointerY) / dt;
      const throwSpeed = Math.hypot(instVx, instVy);
      if (throwSpeed > MAX_THROW_SPEED) {
        const s = MAX_THROW_SPEED / throwSpeed;
        instVx *= s;
        instVy *= s;
      }
      this.vx = this.vx * 0.62 + instVx * 0.38;
      this.vy = this.vy * 0.62 + instVy * 0.38;
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
    this.bounceEnergy = 0.9;
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > MAX_THROW_SPEED) {
      const s = MAX_THROW_SPEED / speed;
      this.vx *= s;
      this.vy *= s;
    }
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
    // Pin the contact edge to the wall so scale-from-center doesn't open a gap.
    const r = this.radius;
    let x = this.x;
    let y = this.y;
    if (this.contactLeft) x -= r * (1 - this.squashX);
    else if (this.contactRight) x += r * (1 - this.squashX);
    if (this.contactTop) y -= r * (1 - this.squashY);
    else if (this.contactBottom) y += r * (1 - this.squashY);

    return {
      x,
      y,
      rotation: this.rotation,
      squashX: this.squashX,
      squashY: this.squashY,
      breathScale: this.breathScale,
      shadowScaleX: shadowScale * (1 + (1 - this.squashX) * 0.35),
      shadowScaleY: shadowScale * (1 + (1 - this.squashY) * 0.2),
      shadowOpacity,
      motionBlur: 0,
      speed,
    };
  }

  private clampAirSpeed() {
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > MAX_AIR_SPEED) {
      const s = MAX_AIR_SPEED / speed;
      this.vx *= s;
      this.vy *= s;
    }
  }

  private updateRotation(dt: number) {
    this.angularVelocity = Math.max(
      -MAX_ANGULAR_VELOCITY,
      Math.min(MAX_ANGULAR_VELOCITY, this.angularVelocity),
    );
    this.angularVelocity *= Math.exp(-4.5 * dt);
    this.rotation += this.angularVelocity * dt;
    if (Math.abs(this.rotation) > Math.PI * 2) {
      this.rotation %= Math.PI * 2;
    }
  }

  private addSpinFromMotion(dt: number) {
    const targetOmega = (this.vx / Math.max(this.radius, 1)) * 0.2;
    this.angularVelocity += (targetOmega - this.angularVelocity) * Math.min(1, 1.6 * dt);
  }

  private stepFloating(dt: number) {
    const t = this.clock;
    const bobX = Math.sin(t * 0.72) * 3 + Math.sin(t * 1.35) * 1.4;
    const bobY = Math.sin(t * 0.58) * 4.5 + Math.cos(t * 0.93) * 2;
    // Ease into the bob path so phase handoff never teleports.
    const ease = 1 - Math.exp(-5.5 * dt);
    this.x += (bobX - this.x) * ease;
    this.y += (bobY - this.y) * ease;
    this.vx = 0;
    this.vy = 0;
    this.contactLeft = false;
    this.contactRight = false;
    this.contactTop = false;
    this.contactBottom = false;
    this.breathScale = 1 + Math.sin(t * 0.85) * 0.014;
    this.angularVelocity = 0.035 * Math.sin(t * 0.41);
    this.updateRotation(dt);
  }

  private stepDragging(dt: number) {
    const ax = ((this.targetX - this.x) * DRAG_STIFFNESS - this.vx * DRAG_DAMPING) / MASS;
    const ay = ((this.targetY - this.y) * DRAG_STIFFNESS - this.vy * DRAG_DAMPING) / MASS;
    this.vx += ax * dt;
    this.vy += ay * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.addSpinFromMotion(dt);
    this.updateRotation(dt);
    this.breathScale = 1 + Math.sin(this.clock * 1.4) * 0.006;
    // Use the pointer target past the wall as press depth so mush holds while dragging.
    this.clampWalls(false, this.targetX, this.targetY);
  }

  private stepAirborne(dt: number) {
    this.vy += GRAVITY * dt;
    const dragFactor = Math.exp(-AIR_DRAG * dt);
    this.vx *= dragFactor;
    this.vy *= dragFactor;
    this.clampAirSpeed();
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.addSpinFromMotion(dt);
    this.updateRotation(dt);

    this.clampWalls(true);

    if (this.y >= this.bounds.bottom && this.vy >= 0) {
      this.y = this.bounds.bottom;
      this.contactBottom = true;
      const impactSpeed = Math.abs(this.vy);
      const impact = Math.min(1, impactSpeed / 920);

      // Soft landing — no tiny rubber-band bounces near rest.
      if (impactSpeed < SETTLE_SPEED || this.bounceEnergy < 0.22) {
        this.applySquash(0, -1, 0.4 + impact * 0.45);
        this.enterResting();
        return;
      }

      const restitution = 0.58 * this.bounceEnergy;
      this.vy = -impactSpeed * restitution;
      this.vx *= 0.96;
      this.applySquash(0, -1, 0.65 + impact * 0.5);
      this.bounceEnergy *= 0.7;
      this.angularVelocity = Math.max(
        -MAX_ANGULAR_VELOCITY,
        Math.min(MAX_ANGULAR_VELOCITY, (this.vx / Math.max(this.radius, 1)) * 0.5),
      );

      if (Math.hypot(this.vx, this.vy) < SETTLE_SPEED * 1.15) {
        this.enterResting();
      }
    }
  }

  private stepResting(dt: number) {
    this.y = this.bounds.bottom;
    this.contactBottom = true;
    this.vx *= Math.exp(-5.2 * dt);
    this.vy = 0;
    this.x += this.vx * dt;
    this.contactLeft = false;
    this.contactRight = false;
    if (this.x < this.bounds.left) {
      this.x = this.bounds.left;
      this.contactLeft = true;
      this.applySquash(1, 0, 0.45);
    } else if (this.x > this.bounds.right) {
      this.x = this.bounds.right;
      this.contactRight = true;
      this.applySquash(-1, 0, 0.45);
    }
    this.applySquash(0, -1, 0.22);
    this.restElapsed += dt;
    this.updateRotation(dt);
    this.breathScale = 1 + Math.sin(this.clock * 0.6) * 0.004;

    if (this.restElapsed >= REST_PAUSE_S) {
      this.phase = "rolling";
      const toward = this.x > 0 ? -1 : 1;
      // Gentle roll-home — no random kick.
      this.vx = toward * Math.min(48, 22 + Math.abs(this.x) * 0.08);
      this.angularVelocity = Math.max(
        -MAX_ANGULAR_VELOCITY,
        Math.min(MAX_ANGULAR_VELOCITY, this.vx / Math.max(this.radius, 1)),
      );
    }
  }

  private stepRolling(dt: number) {
    this.y = this.bounds.bottom;
    this.contactBottom = true;
    this.contactTop = false;
    const toOrigin = -this.x;
    const desiredVx = Math.sign(toOrigin || 1) * Math.min(Math.abs(toOrigin) * 1.15, 64);
    this.vx += (desiredVx - this.vx) * Math.min(1, 2.1 * dt);
    this.vx *= Math.exp(-1.15 * dt);
    this.x += this.vx * dt;
    this.contactLeft = false;
    this.contactRight = false;
    if (this.x < this.bounds.left) {
      this.x = this.bounds.left;
      this.vx = Math.abs(this.vx) * 0.4;
      this.contactLeft = true;
      this.applySquash(1, 0, 0.55);
    } else if (this.x > this.bounds.right) {
      this.x = this.bounds.right;
      this.vx = -Math.abs(this.vx) * 0.4;
      this.contactRight = true;
      this.applySquash(-1, 0, 0.55);
    }
    this.applySquash(0, -1, 0.18);
    this.angularVelocity = Math.max(
      -MAX_ANGULAR_VELOCITY,
      Math.min(MAX_ANGULAR_VELOCITY, this.vx / Math.max(this.radius, 1)),
    );
    this.updateRotation(dt);
    this.breathScale = 1;

    if (Math.abs(this.x) < 4 && Math.abs(this.vx) < 8) {
      this.phase = "lifting";
      this.vx = 0;
      this.angularVelocity *= 0.2;
    }
  }

  private stepLifting(dt: number) {
    this.contactLeft = false;
    this.contactRight = false;
    this.contactTop = false;
    this.contactBottom = false;
    const liftK = 36;
    const liftD = 10;
    const ax = (-this.x * liftK - this.vx * liftD) / MASS;
    const ay = ((0 - this.y) * liftK - this.vy * liftD) / MASS;
    this.vy += ay * dt;
    this.vx += ax * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angularVelocity *= Math.exp(-3.2 * dt);
    this.updateRotation(dt);
    this.breathScale = 1 + Math.sin(this.clock * 0.9) * 0.01;

    const dist = Math.hypot(this.x, this.y);
    const speed = Math.hypot(this.vx, this.vy);
    if (dist < 8 && speed < 32) {
      this.phase = "floating";
      this.vx = 0;
      this.vy = 0;
      this.angularVelocity = 0;
      this.restElapsed = 0;
      this.bounceEnergy = 1;
    }
  }

  private enterResting() {
    this.phase = "resting";
    this.restElapsed = 0;
    this.y = this.bounds.bottom;
    this.vy = 0;
    if (Math.abs(this.vx) < 18) this.vx = 0;
  }

  private clampWalls(bounce: boolean, pressX = this.x, pressY = this.y) {
    const r = Math.max(this.radius, 1);
    this.contactLeft = false;
    this.contactRight = false;
    this.contactTop = false;
    // Bottom is handled by floor bounce / resting — keep flag if already on floor.
    if (this.phase !== "resting" && this.phase !== "rolling") {
      this.contactBottom = false;
    }

    if (this.x < this.bounds.left) {
      const penetration = Math.max(this.bounds.left - this.x, this.bounds.left - pressX);
      this.x = this.bounds.left;
      this.contactLeft = true;
      if (bounce && this.vx < 0) {
        this.vx = -this.vx * 0.62;
        this.applySquash(1, 0, 0.75 + Math.min(0.45, Math.abs(this.vx) / 900));
      } else {
        this.applySquash(1, 0, Math.min(1.35, 0.55 + penetration / (r * 0.22)));
        if (!bounce) this.vx = Math.max(0, this.vx);
      }
    } else if (this.x > this.bounds.right) {
      const penetration = Math.max(this.x - this.bounds.right, pressX - this.bounds.right);
      this.x = this.bounds.right;
      this.contactRight = true;
      if (bounce && this.vx > 0) {
        this.vx = -this.vx * 0.62;
        this.applySquash(-1, 0, 0.75 + Math.min(0.45, Math.abs(this.vx) / 900));
      } else {
        this.applySquash(-1, 0, Math.min(1.35, 0.55 + penetration / (r * 0.22)));
        if (!bounce) this.vx = Math.min(0, this.vx);
      }
    }

    if (this.y < this.bounds.top) {
      const penetration = Math.max(this.bounds.top - this.y, this.bounds.top - pressY);
      this.y = this.bounds.top;
      this.contactTop = true;
      if (bounce && this.vy < 0) {
        this.vy = -this.vy * 0.58;
        this.applySquash(0, 1, 0.7 + Math.min(0.4, Math.abs(this.vy) / 900));
      } else {
        this.applySquash(0, 1, Math.min(1.35, 0.55 + penetration / (r * 0.22)));
        if (!bounce) this.vy = Math.max(0, this.vy);
      }
    } else if (this.y > this.bounds.bottom) {
      const penetration = Math.max(this.y - this.bounds.bottom, pressY - this.bounds.bottom);
      this.y = this.bounds.bottom;
      this.contactBottom = true;
      if (bounce && this.vy > 0) {
        // Floor bounce is handled in stepAirborne; still mush on contact.
        this.applySquash(0, -1, 0.7 + Math.min(0.4, Math.abs(this.vy) / 900));
      } else {
        this.applySquash(0, -1, Math.min(1.35, 0.55 + penetration / (r * 0.22)));
        if (!bounce) this.vy = Math.min(0, this.vy);
      }
    }
  }

  private applySquash(nx: number, ny: number, intensity: number) {
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    const soften = Math.min(1.4, Math.max(0, intensity));
    if (ax > ay) {
      this.squashX = Math.min(this.squashX, 1 - 0.38 * soften);
      this.squashY = Math.max(this.squashY, 1 + 0.22 * soften);
    } else {
      this.squashX = Math.max(this.squashX, 1 + 0.2 * soften);
      this.squashY = Math.min(this.squashY, 1 - 0.38 * soften);
    }
  }

  private decaySquash(dt: number) {
    // Hold deformation while pressed into a wall; rebound when free.
    const pressed = this.contactLeft || this.contactRight || this.contactTop || this.contactBottom;
    const rate = 1 - Math.exp(-(pressed ? 4.5 : 11) * dt);
    this.squashX += (1 - this.squashX) * rate;
    this.squashY += (1 - this.squashY) * rate;
  }
}

/** Bounds so the sphere edge can reach the true viewport edges. */
export function measureSphereBounds(
  _playArea: HTMLElement,
  anchorEl: HTMLElement,
  radius: number,
): SphereBounds {
  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorCX = anchorRect.left + anchorRect.width / 2;
  const anchorCY = anchorRect.top + anchorRect.height / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return {
    left: radius - anchorCX,
    right: vw - radius - anchorCX,
    top: radius - anchorCY,
    bottom: vh - radius - anchorCY,
  };
}

export function clientToSphereOffset(clientX: number, clientY: number, anchorEl: HTMLElement) {
  const anchorRect = anchorEl.getBoundingClientRect();
  const anchorCX = anchorRect.left + anchorRect.width / 2;
  const anchorCY = anchorRect.top + anchorRect.height / 2;
  return { x: clientX - anchorCX, y: clientY - anchorCY };
}
