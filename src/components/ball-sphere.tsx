import { motion, useTransform, type MotionValue } from "framer-motion";
import { getSphereLighting } from "@/lib/ball-physics";

/** Glossy almond eye with catchlights + a lid that scales down to blink/open. */
function Eye({ side, lidScale }: { side: "left" | "right"; lidScale: MotionValue<number> }) {
  const posClass = side === "left" ? "left-[29%]" : "right-[29%]";
  return (
    <div className={`absolute ${posClass} top-[37%] h-[15cqmin] w-[12cqmin]`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 38% 30%, #3a3f57 0%, #14161f 46%, #05060a 100%)",
          boxShadow:
            "inset 0 1.2cqmin 1.8cqmin oklch(1 0 0 / 0.18), inset 0 -1cqmin 1.4cqmin oklch(0 0 0 / 0.5)",
        }}
      >
        <div
          className="absolute left-[26%] top-[20%] h-[34%] w-[34%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.75) 55%, transparent 72%)",
          }}
        />
        <div className="absolute bottom-[24%] right-[22%] h-[14%] w-[14%] rounded-full bg-white/50" />
      </div>
      <motion.div
        className="absolute inset-0 origin-top rounded-full"
        style={{ scaleY: lidScale, background: getSphereLighting(0).background }}
      />
    </div>
  );
}

/** Curved-line smile that deepens from a soft rest curve to a full grin. */
function Mouth({ smile }: { smile: MotionValue<number> }) {
  const d = useTransform(smile, (raw) => {
    const v = Math.min(1, Math.max(0, Number(raw)));
    const corner = (18 - v * 5).toFixed(1); // corners lift as it smiles
    const control = (24 + v * 34).toFixed(1); // curve deepens
    return `M 15 ${corner} Q 50 ${control} 85 ${corner}`;
  });

  return (
    <div className="pointer-events-none absolute left-1/2 top-[55%] h-[28cqmin] w-[46cqmin] -translate-x-1/2">
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        <motion.path
          d={d}
          fill="none"
          stroke="#0b0c12"
          strokeWidth={6.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0.5px 0.5px oklch(1 0 0 / 0.14))" }}
        />
      </svg>
    </div>
  );
}

type BallSphereProps = {
  showFace?: boolean;
  faceReveal?: number;
  rollAngle?: number;
  lidScale?: MotionValue<number>;
  smile?: MotionValue<number>;
  compact?: boolean;
};

export function BallSphere({
  showFace = false,
  faceReveal = 1,
  rollAngle = 0,
  lidScale,
  smile,
  compact = false,
}: BallSphereProps) {
  const reveal = showFace ? faceReveal : 0;
  const lighting = getSphereLighting(rollAngle, compact);

  return (
    <div
      className="@container relative h-full w-full overflow-hidden rounded-full"
      style={{
        background: lighting.background,
        boxShadow: lighting.boxShadow,
      }}
    >
      <div
        className="pointer-events-none absolute rounded-full bg-white/30 blur-[2px]"
        style={{
          width: lighting.specular.w,
          height: lighting.specular.h,
          left: lighting.specular.x,
          top: lighting.specular.y,
          transform: "translate(-50%, -50%)",
          opacity: lighting.specular.opacity,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: lighting.rimGradient,
          opacity: 0.85,
        }}
        aria-hidden
      />

      {showFace && lidScale && smile && (
        <div
          className="absolute inset-0 rounded-full"
          style={{ opacity: reveal, transition: "opacity 0.4s ease" }}
        >
          <Eye side="left" lidScale={lidScale} />
          <Eye side="right" lidScale={lidScale} />
          <Mouth smile={smile} />
        </div>
      )}
    </div>
  );
}
