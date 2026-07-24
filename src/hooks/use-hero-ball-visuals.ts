import { useMotionTemplate, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  COMPOSED_SCALE_SPRING,
  SCROLL_LID_SPRING,
  SCROLL_PRESENCE_SPRING,
  SETTLE_BREATH_SPRING,
  SHADOW_LAG_SPRING,
  SHADOW_SPRING,
  SMILE_SPRING,
  SQUASH_SPRING,
  TRAIL_SPRING,
} from "@/lib/hero-ball-config";
import type { HeroBallCore } from "@/hooks/use-hero-ball-core";

/**
 * Pure derivation: takes the base motion channels from the core and returns
 * the render-ready transforms/springs (composed scale, shadow, glow, smile,
 * lid, render-position). No state, no side effects — a move of the
 * useTransform/useSpring graph that used to sit inline in the component.
 */
export function useHeroBallVisuals(
  core: HeroBallCore,
  { scrollY, heroProgress }: { scrollY: MotionValue<number>; heroProgress: MotionValue<number> },
) {
  const {
    diameter,
    posX,
    posY,
    contactPinX,
    contactPinY,
    entranceSmile,
    ballPresence,
    squashValue,
    squashAxis,
    floorProximity,
    speedNorm,
    airStretchX,
    airStretchY,
    settleBreath,
  } = core;

  const squashX = useSpring(
    useTransform([squashValue, squashAxis], ([v, axis]) => {
      const amount = Number(v);
      const a = Number(axis);
      // Horizontal hit → compress X, stretch Y; vertical hit → opposite.
      return a > 0.5 ? amount : 2 - amount;
    }),
    SQUASH_SPRING,
  );
  const squashY = useSpring(
    useTransform([squashValue, squashAxis], ([v, axis]) => {
      const amount = Number(v);
      const a = Number(axis);
      return a > 0.5 ? 2 - amount : amount;
    }),
    SQUASH_SPRING,
  );
  const glowTrailX = useSpring(posX, TRAIL_SPRING);
  const glowTrailY = useSpring(posY, TRAIL_SPRING);
  const shadowLagX = useSpring(posX, SHADOW_LAG_SPRING);
  const contactShadowScale = useSpring(
    useTransform(floorProximity, [0, 1], [0.42, 1.48]),
    SHADOW_SPRING,
  );
  const contactShadowOpacity = useSpring(
    useTransform(floorProximity, [0, 1], [0.06, 0.62]),
    SHADOW_SPRING,
  );
  const contactShadowScaleY = useTransform(contactShadowScale, (v) => 0.48 + Number(v) * 0.24);
  const contactShadowBlur = useTransform(floorProximity, [0, 1], [22, 8]);
  const settleBreathSpring = useSpring(settleBreath, SETTLE_BREATH_SPRING);

  const composedScaleX = useSpring(
    useTransform(
      [squashX, airStretchX, settleBreathSpring],
      ([sq, air, breath]) => Number(sq) * Number(air) * Number(breath),
    ),
    COMPOSED_SCALE_SPRING,
  );
  const composedScaleY = useSpring(
    useTransform(
      [squashY, airStretchY, settleBreathSpring],
      ([sq, air, breath]) => Number(sq) * Number(air) * (2 - Number(breath)),
    ),
    COMPOSED_SCALE_SPRING,
  );

  const scrollSmileRaw = useTransform(scrollY, [180, 520], [0, 1]);
  const combinedSmile = useTransform([entranceSmile, scrollSmileRaw], ([entrance, scroll]) =>
    Math.max(Number(entrance), Number(scroll)),
  );
  const smile = useSpring(combinedSmile, SMILE_SPRING);

  const scrollLidRaw = useTransform(scrollY, [0, 220], [1, 0]);
  const scrollLid = useSpring(scrollLidRaw, SCROLL_LID_SPRING);
  // Eyes open (lid retracts) once the ball settles and starts smiling — the
  // face isn't shown until it's at rest, so this reveals the eyes there too.
  const lidScale = useTransform([scrollLid, entranceSmile], ([lid, sm]) =>
    Math.min(Number(lid), 1 - Number(sm)),
  );

  const scrollPresenceRaw = useTransform(
    heroProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [1, 0.92, 0.7, 0.42, 0.12],
  );
  const scrollPresence = useSpring(scrollPresenceRaw, SCROLL_PRESENCE_SPRING);

  const presenceOpacity = useTransform(
    ballPresence,
    [0, 0.18, 0.42, 0.72, 1],
    [0, 0.22, 0.55, 0.86, 1],
  );
  // Light haze only — heavy blur+filter on open was janking first paint.
  const presenceBlur = useTransform(ballPresence, [0, 0.25, 0.55, 0.85, 1], [8, 4.5, 2, 0.6, 0]);
  const presenceBrightness = useTransform(ballPresence, [0, 0.35, 0.7, 1], [0.82, 0.9, 0.96, 1]);
  const presenceSaturate = useTransform(ballPresence, [0, 0.45, 1], [0.85, 0.93, 1]);

  const cinematicOpacity = useTransform(
    [scrollPresence, presenceOpacity],
    ([scroll, presence]) => Number(scroll) * Number(presence),
  );
  // Keep scale off the positioned layer — it opens false edge gaps. Fade only.
  const motionBlurPx = useTransform(speedNorm, [0, 1], [0, 0.6]);
  const cinematicBlurPx = useTransform([presenceBlur, motionBlurPx], ([presence, motion]) =>
    Math.min(10, Number(presence) + Number(motion)),
  );
  const cinematicFilter = useMotionTemplate`blur(${cinematicBlurPx}px) brightness(${presenceBrightness}) saturate(${presenceSaturate})`;
  const shadowOpacity = useTransform(
    [cinematicOpacity, contactShadowOpacity],
    ([presence, contact]) => Number(presence) * Number(contact),
  );
  const glowOpacity = useTransform(
    [cinematicOpacity, speedNorm, floorProximity],
    ([presence, speed, floor]) =>
      Number(presence) * (0.34 + Number(speed) * 0.18 + (1 - Number(floor)) * 0.14),
  );
  const glowScale = useTransform(speedNorm, (speed) => 1.02 + Number(speed) * 0.06);
  const shadowFilter = useMotionTemplate`blur(${contactShadowBlur}px)`;

  const half = diameter / 2;
  /** Top-left px with wall-pin — never use % translate (conflicts with motion `x`). */
  const ballRenderX = useTransform([posX, composedScaleX, contactPinX], ([x, sx, pin]) => {
    const p = Number(pin);
    const s = Number(sx);
    let left = Number(x) - half;
    if (p < 0) left -= half * (1 - s);
    else if (p > 0) left += half * (1 - s);
    return left;
  });
  const ballRenderY = useTransform([posY, composedScaleY, contactPinY], ([y, sy, pin]) => {
    const p = Number(pin);
    const s = Number(sy);
    let top = Number(y) - half;
    if (p < 0) top -= half * (1 - s);
    else if (p > 0) top += half * (1 - s);
    return top;
  });
  const glowRenderX = useTransform(glowTrailX, (x) => Number(x) - diameter * 0.75);
  const glowRenderY = useTransform(glowTrailY, (y) => Number(y) - diameter * 0.75);
  const shadowRenderX = useTransform(shadowLagX, (x) => Number(x) - diameter * 0.42);
  const shadowRenderY = useTransform(posY, (y) => Number(y) + half * 0.02);

  return {
    composedScaleX,
    composedScaleY,
    smile,
    lidScale,
    cinematicOpacity,
    cinematicFilter,
    shadowOpacity,
    shadowFilter,
    contactShadowScale,
    contactShadowScaleY,
    glowOpacity,
    glowScale,
    ballRenderX,
    ballRenderY,
    glowRenderX,
    glowRenderY,
    shadowRenderX,
    shadowRenderY,
  };
}

export type HeroBallVisuals = ReturnType<typeof useHeroBallVisuals>;
