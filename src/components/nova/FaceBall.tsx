import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";
import {
  createHeroBallState,
  dragVelocityToSim,
  measureHeroDragBounds,
  stepHeroBallPhysics,
  type HeroBallState,
} from "@/lib/hero-ball-physics";

/** Hero only — scroll + pointer face; draggable with gravity bounce-back. */
export function FaceBall({ playAreaRef }: { playAreaRef: React.RefObject<HTMLDivElement | null> }) {
  const reduceMotion = useReducedMotion();
  const ballRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<HeroBallState | null>(null);
  const simulatingRef = useRef(false);
  const rafRef = useRef<number>(0);

  const [dragging, setDragging] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const simSquashX = useMotionValue(1);
  const simSquashY = useMotionValue(1);

  const { scrollY } = useScroll();
  const lidRaw = useTransform(scrollY, [0, 220], [1, 0]);
  const lidScale = useSpring(lidRaw, { stiffness: 140, damping: 22 });
  const smileRaw = useTransform(scrollY, [180, 520], [0, 1]);
  const smile = useSpring(smileRaw, { stiffness: 140, damping: 22 });

  const faceEngage = useMotionValue(0);
  const faceEngageSpring = useSpring(faceEngage, { stiffness: 220, damping: 22 });

  const combinedLid = useTransform([lidScale, faceEngageSpring], ([lid, engage]) =>
    Math.min(lid as number, 1 - (engage as number)),
  );
  const combinedSmile = useTransform([smile, faceEngageSpring], ([s, engage]) =>
    Math.max(s as number, engage as number),
  );
  const mouthWidth = useTransform(combinedSmile, (n: number) => `${22 + n * 70}px`);
  const mouthHeight = useTransform(combinedSmile, (n: number) => `${36 + n * 12}px`);
  const mouthRadius = useTransform(
    combinedSmile,
    (n: number) =>
      `${50 - n * 40}% ${50 - n * 40}% ${50 + n * 45}% ${50 + n * 45}% / ${50 - n * 35}% ${50 - n * 35}% ${50 + n * 55}% ${50 + n * 55}%`,
  );

  const bounceAmp = useTransform(scrollY, [0, 600], [8, 34]);
  const ampPx = useTransform(bounceAmp, (v) => `${v}px`);
  const fadeRaw = useTransform(scrollY, [140, 520], [0, 1]);
  const fade = useSpring(fadeRaw, { stiffness: 110, damping: 26 });
  const ballOpacity = useTransform(fade, [0, 1], [1, 0.42]);
  const ballBlur = useTransform(fade, (v) => `blur(${v * 14}px)`);
  const ballZ = useTransform(fade, [0, 1], [30, 12]);

  const setFaceEngaged = (on: boolean) => {
    animate(faceEngage, on ? 1 : 0, { duration: on ? 0.28 : 0.4, ease: "easeOut" });
  };

  const stopSimulation = () => {
    cancelAnimationFrame(rafRef.current);
    simRef.current = null;
    simulatingRef.current = false;
    setSimulating(false);
    simSquashX.set(1);
    simSquashY.set(1);
    dragX.stop();
    dragY.stop();
  };

  const startSimulation = (vx: number, vy: number) => {
    const playArea = playAreaRef.current;
    const ball = ballRef.current;
    if (!playArea || !ball) return;

    const bounds = measureHeroDragBounds(playArea, ball, dragX.get(), dragY.get());
    simRef.current = createHeroBallState(dragX.get(), dragY.get(), vx, vy);
    simulatingRef.current = true;
    setSimulating(true);

    const tick = () => {
      const state = simRef.current;
      const area = playAreaRef.current;
      const el = ballRef.current;
      if (!state || !area || !el) return;

      const done = stepHeroBallPhysics(state, bounds);
      dragX.set(state.x);
      dragY.set(state.y);
      simSquashX.set(state.squashX);
      simSquashY.set(state.squashY);

      if (done) {
        stopSimulation();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handlePointerDown = () => {
    stopSimulation();
    setFaceEngaged(true);
  };

  const onDragEnd = (_: unknown, info: { velocity: { x: number; y: number } }) => {
    setDragging(false);
    if (reduceMotion) {
      animate(dragX, 0, { type: "spring", stiffness: 320, damping: 28 });
      animate(dragY, 0, { type: "spring", stiffness: 320, damping: 28 });
      return;
    }
    const { vx, vy } = dragVelocityToSim(info.velocity.x, info.velocity.y);
    startSimulation(vx, vy);
  };

  const idleBounce = !dragging && !simulating;

  return (
    <motion.div
      ref={ballRef}
      drag={!reduceMotion}
      dragConstraints={playAreaRef}
      dragElastic={0.1}
      dragMomentum={false}
      onPointerDownCapture={handlePointerDown}
      onDragStart={() => {
        stopSimulation();
        dragX.stop();
        dragY.stop();
        setDragging(true);
        setFaceEngaged(true);
      }}
      onDragEnd={onDragEnd}
      onHoverStart={() => setFaceEngaged(true)}
      onHoverEnd={() => {
        if (!dragging) setFaceEngaged(false);
      }}
      onPointerUp={() => {
        if (!dragging) setFaceEngaged(false);
      }}
      whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      role="img"
      aria-label="Drag the face ball"
      className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
      style={{ x: dragX, y: dragY, opacity: ballOpacity, filter: ballBlur, zIndex: ballZ }}
    >
      <motion.div
        className={idleBounce ? "h-full w-full animate-[novaBounce_2.8s_ease-in-out_infinite]" : "h-full w-full"}
        style={{
          ["--nova-amp" as string]: ampPx,
          scaleX: simulating ? simSquashX : 1,
          scaleY: simulating ? simSquashY : 1,
        }}
      >
        <BallSphere
          lidScale={combinedLid}
          mouthRadius={mouthRadius}
          mouthHeight={mouthHeight}
          mouthWidth={mouthWidth}
        />
      </motion.div>
    </motion.div>
  );
}
