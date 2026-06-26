export type ProjectCardMotion = {
  xPercent: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const easeOutCubic = (t: number) => 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;

const HIDDEN_RIGHT: ProjectCardMotion = {
  xPercent: 108,
  scale: 0.94,
  opacity: 0,
  zIndex: 0,
};

const FRONT: ProjectCardMotion = {
  xPercent: 0,
  scale: 1,
  opacity: 1,
  zIndex: 50,
};

/** Maps continuous slide index (0…n) to per-card transform. xPercent is relative to stage width. */
export function computeProjectCardMotion(index: number, slideProgress: number, total: number): ProjectCardMotion {
  const local = slideProgress - index;

  if (local <= -1) {
    return HIDDEN_RIGHT;
  }

  if (local < 0) {
    const t = easeOutCubic(1 + local);
    return {
      xPercent: 100 * (1 - t),
      scale: 0.93 + 0.07 * t,
      opacity: t,
      zIndex: 25 + Math.round(25 * t),
    };
  }

  if (local < 1) {
    if (index === total - 1) {
      return FRONT;
    }
    const t = easeOutCubic(local);
    return {
      xPercent: -36 * t,
      scale: 1 - 0.07 * t,
      opacity: 1 - 0.88 * t,
      zIndex: 50 - Math.round(38 * t),
    };
  }

  return {
    xPercent: -44,
    scale: 0.86,
    opacity: 0,
    zIndex: 4,
  };
}

export const PROJECT_SCROLL_SEGMENTS = 4;
export const PROJECT_SCROLL_HEIGHT_VH = PROJECT_SCROLL_SEGMENTS * 100;
