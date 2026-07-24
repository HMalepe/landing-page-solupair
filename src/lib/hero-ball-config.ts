/**
 * Tuning constants for the hero face-ball — extracted verbatim from
 * hero-face-ball.tsx so the orchestrator/hooks read config, never inline it.
 * NONE of these values were changed during extraction.
 */

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** How hard a wall impact compresses the ball at full speed. */
export const IMPACT_SQUASH = 0.78;

/** Expensive rubber — soft attack, gentle overshoot, quick settle. */
export const SQUASH_SPRING = { stiffness: 320, damping: 18, mass: 0.85 } as const;
export const SHADOW_SPRING = { stiffness: 120, damping: 28, mass: 0.9 } as const;
export const TRAIL_SPRING = { stiffness: 90, damping: 22, mass: 0.95 } as const;

/** Contact shadow follows the ball with a touch of lag. */
export const SHADOW_LAG_SPRING = { stiffness: 160, damping: 30, mass: 0.85 } as const;
/** Gentle settle breathing after the ball comes to rest. */
export const SETTLE_BREATH_SPRING = { stiffness: 90, damping: 14, mass: 1 } as const;
/** Composed scale (squash × air-stretch × breath) smoothing. */
export const COMPOSED_SCALE_SPRING = { stiffness: 220, damping: 26, mass: 0.65 } as const;
/** Smile easing. */
export const SMILE_SPRING = { stiffness: 140, damping: 22 } as const;
/** Eye-lid retract easing. */
export const SCROLL_LID_SPRING = { stiffness: 140, damping: 22 } as const;
/** Scroll-driven presence fade easing. */
export const SCROLL_PRESENCE_SPRING = { stiffness: 70, damping: 24 } as const;
