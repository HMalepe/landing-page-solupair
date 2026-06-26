export type ProjectCardMotion = {
  xPercent: number;
  yPx: number;
  scale: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
};

/** Hold most of each scroll segment on one card; zip transition in the tail. */
const HOLD_RATIO = 0.82;
const OFF_SCREEN_X = 132;

const easeOutQuint = (t: number) => 1 - (1 - Math.max(0, Math.min(1, t))) ** 5;

const FRONT: ProjectCardMotion = {
  xPercent: 0,
  yPx: 0,
  scale: 1,
  opacity: 1,
  zIndex: 50,
  visible: true,
};

const HIDDEN_LEFT: ProjectCardMotion = {
  xPercent: -OFF_SCREEN_X,
  yPx: 0,
  scale: 0.9,
  opacity: 0,
  zIndex: 0,
  visible: false,
};

const HIDDEN_RIGHT: ProjectCardMotion = {
  xPercent: OFF_SCREEN_X,
  yPx: 0,
  scale: 0.9,
  opacity: 0,
  zIndex: 0,
  visible: false,
};

/**
 * One card on stage at a time. Outgoing flies left; incoming pops in from the right.
 * xPercent is relative to stage width.
 */
export function computeProjectCardMotion(
  index: number,
  slideProgress: number,
  total: number,
): ProjectCardMotion {
  const sp = Math.max(0, Math.min(slideProgress, total - 1e-4));
  const active = Math.floor(sp);
  const frac = sp - active;
  const onLastSlide = active >= total - 1;

  if (onLastSlide) {
    return index === total - 1 ? FRONT : HIDDEN_LEFT;
  }

  if (frac < HOLD_RATIO) {
    if (index === active) return FRONT;
    if (index < active) return HIDDEN_LEFT;
    return HIDDEN_RIGHT;
  }

  const t = easeOutQuint((frac - HOLD_RATIO) / (1 - HOLD_RATIO));

  if (index === active) {
    const opacity = t <= 0.4 ? 1 - t / 0.4 : 0;
    return {
      xPercent: -OFF_SCREEN_X * t,
      yPx: -36 * t,
      scale: 1 - 0.12 * t,
      opacity,
      zIndex: 30,
      visible: opacity > 0.02,
    };
  }

  if (index === active + 1) {
    const opacity = t < 0.06 ? 0 : easeOutQuint(Math.min(1, (t - 0.06) / 0.45));
    return {
      xPercent: OFF_SCREEN_X * (1 - t),
      yPx: 40 * (1 - t),
      scale: 0.86 + 0.14 * t,
      opacity,
      zIndex: 50,
      visible: opacity > 0.02,
    };
  }

  if (index < active) return HIDDEN_LEFT;
  return HIDDEN_RIGHT;
}

export const PROJECT_SCROLL_SEGMENTS = 4;
export const PROJECT_SCROLL_HEIGHT_VH = PROJECT_SCROLL_SEGMENTS * 100;
