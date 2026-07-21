import { motion, type MotionValue } from "framer-motion";

export function BallSphere({
  lidScale,
  mouthRadius,
  mouthHeight,
  mouthWidth,
}: {
  lidScale?: MotionValue<number>;
  mouthRadius?: MotionValue<string>;
  mouthHeight?: MotionValue<string>;
  mouthWidth?: MotionValue<string>;
}) {
  const hasFace = lidScale && mouthWidth && mouthHeight && mouthRadius;

  return (
    <div
      className="relative h-full w-full rounded-full"
      style={{
        background: "var(--nova-ball-surface)",
        boxShadow:
          "inset -40px -50px 80px oklch(0 0 0 / 0.4), var(--solupair-glow), var(--solupair-glow-strong)",
      }}
    >
      <Eye side="left" lidScale={lidScale} />
      <Eye side="right" lidScale={lidScale} />
      {hasFace ? (
        <motion.div
          className="absolute left-1/2 top-[64%] -translate-x-1/2 bg-black"
          style={{ width: mouthWidth, height: mouthHeight, borderRadius: mouthRadius }}
        />
      ) : (
        <div
          className="absolute left-1/2 top-[64%] -translate-x-1/2 bg-black/90"
          style={{ width: 28, height: 36, borderRadius: "50%" }}
        />
      )}
    </div>
  );
}

function Eye({ side, lidScale }: { side: "left" | "right"; lidScale?: MotionValue<number> }) {
  const posClass = side === "left" ? "left-[26%]" : "right-[26%]";
  return (
    <div
      className={`absolute ${posClass} top-[38%] h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] lg:h-[100px] lg:w-[100px]`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-none text-black sm:text-[80px] lg:text-[100px]">
        ✻
      </div>
      {lidScale ? (
        <motion.div
          className="absolute inset-0 origin-center rounded-full"
          style={{
            scaleY: lidScale,
            background: "var(--nova-ball-surface)",
          }}
        />
      ) : null}
    </div>
  );
}
