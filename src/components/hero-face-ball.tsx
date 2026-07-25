import { motion, useScroll } from "framer-motion";
import type { RefObject } from "react";
import { BallSphere } from "@/components/ball-sphere";
import { useDeviceProfile } from "@/hooks/use-device-profile";
import { useHeroBallCore } from "@/hooks/use-hero-ball-core";
import { useInViewport } from "@/hooks/use-in-viewport";
import { useAmbientCycle } from "@/hooks/use-ambient-cycle";
import { useHeroChoreography } from "@/hooks/use-hero-choreography";
import { useHeroEntrance } from "@/hooks/use-hero-entrance";
import { useBallSimulation } from "@/hooks/use-ball-simulation";
import { useHeroBallVisuals } from "@/hooks/use-hero-ball-visuals";
import { BALL_SHADOW, BALL_SURFACE } from "@/lib/ball-physics";

export function HeroFaceBall({ groundRef }: { groundRef: RefObject<HTMLElement | null> }) {
  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: groundRef,
    offset: ["start start", "end start"],
  });
  const { prefersReducedMotion, isPhone, coarsePointer } = useDeviceProfile();
  const heroInView = useInViewport(groundRef);

  const core = useHeroBallCore({
    groundRef,
    prefersReducedMotion,
    isPhone,
    scrollY,
    heroProgress,
    heroInView,
  });
  const ambientCycle = useAmbientCycle(core);
  const choreography = useHeroChoreography(core, ambientCycle);
  useHeroEntrance(core, choreography);
  useBallSimulation(core, ambientCycle);
  const visuals = useHeroBallVisuals(core, { scrollY, heroProgress });

  const { diameter, faceReveal, rollAngle, phase, playfieldRef, ballRef } = core;
  const { pointerHandlers } = choreography;

  const ballStyle = { width: diameter, height: diameter };
  const showFullFace = faceReveal > 0.08;
  const face = (
    <BallSphere
      showFace={showFullFace}
      faceReveal={faceReveal}
      rollAngle={rollAngle}
      lidScale={visuals.lidScale}
      smile={visuals.smile}
    />
  );

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        className="hero-ball-reduced-motion pointer-events-none absolute left-1/2 z-[8] -translate-x-1/2 top-[18%] md:top-auto md:bottom-[12%]"
        style={ballStyle}
      >
        <div
          className="hero-ball-ambient-glow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: diameter * 1.35, height: diameter * 1.35, opacity: 0.45 }}
        />
        <div
          className="relative h-full w-full rounded-full"
          style={{ background: BALL_SURFACE, boxShadow: BALL_SHADOW }}
        />
      </div>
    );
  }

  const isInteractive = phase === "entering" || phase === "simulating";
  const ballLayerZ = isInteractive ? "z-[18]" : "z-[8]";
  // The glow layer is a large, heavily-blurred, separately-composited element —
  // skip it on phones/coarse pointers where GPU headroom is thinnest.
  const showAmbientGlow = !isPhone && !coarsePointer;

  return (
    <div
      ref={playfieldRef}
      className="hero-ball-playfield pointer-events-none fixed inset-0 z-[8] overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }}
    >
      {showAmbientGlow && (
        <motion.div
          aria-hidden
          className={`hero-ball-ambient-glow pointer-events-none absolute left-0 top-0 ${ballLayerZ}`}
          style={{
            width: diameter * 1.5,
            height: diameter * 1.5,
            x: visuals.glowRenderX,
            y: visuals.glowRenderY,
            opacity: visuals.glowOpacity,
            scale: visuals.glowScale,
            willChange: "transform, opacity",
          }}
        />
      )}

      <motion.div
        aria-hidden
        className={`hero-ball-contact-shadow pointer-events-none absolute left-0 top-0 ${ballLayerZ}`}
        style={{
          width: diameter * 0.84,
          height: diameter * 0.14,
          x: visuals.shadowRenderX,
          y: visuals.shadowRenderY,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, oklch(0 0 0 / 0.55) 0%, oklch(0 0 0 / 0.2) 40%, oklch(0 0 0 / 0) 72%)",
          filter: visuals.shadowFilter,
          opacity: visuals.shadowOpacity,
          scaleX: visuals.contactShadowScale,
          scaleY: visuals.contactShadowScaleY,
          willChange: "transform, opacity, filter",
        }}
      />

      <motion.div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 ${ballLayerZ} touch-none`}
        style={{
          x: visuals.ballRenderX,
          y: visuals.ballRenderY,
          width: diameter,
          height: diameter,
          opacity: visuals.cinematicOpacity,
          filter: visuals.cinematicFilter,
          willChange: "transform, opacity, filter",
        }}
      >
        <motion.div
          ref={ballRef}
          className={
            phase === "entering"
              ? "pointer-events-auto h-full w-full cursor-default"
              : "pointer-events-auto h-full w-full cursor-grab active:cursor-grabbing"
          }
          style={{
            scaleX: visuals.composedScaleX,
            scaleY: visuals.composedScaleY,
            willChange: "transform",
          }}
          {...pointerHandlers}
        >
          <div className="h-full w-full">{face}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
