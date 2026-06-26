import { useEffect, useRef } from "react";
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
  clientToSphereOffset,
  HeroSphereSimulator,
  measureSphereBounds,
} from "@/lib/hero-sphere-physics";

type FaceBallProps = {
  playAreaRef: React.RefObject<HTMLDivElement | null>;
  headlineRef: React.RefObject<HTMLDivElement | null>;
};

/** Premium physics sphere — float, weighted drag, bounce, roll home. */
export function FaceBall({ playAreaRef, headlineRef }: FaceBallProps) {
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<HeroSphereSimulator | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

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

  const fadeRaw = useTransform(scrollY, [140, 520], [0, 1]);
  const fade = useSpring(fadeRaw, { stiffness: 110, damping: 26 });
  const ballOpacity = useTransform(fade, [0, 1], [1, 0.42]);
  const scrollBlur = useTransform(fade, (v) => `blur(${v * 14}px)`);
  const ballZ = useTransform(fade, [0, 1], [30, 12]);

  const setFaceEngaged = (on: boolean) => {
    animate(faceEngage, on ? 1 : 0, { duration: on ? 0.28 : 0.4, ease: "easeOut" });
  };

  const measureAndApplyBounds = () => {
    const sim = simRef.current;
    const playArea = playAreaRef.current;
    const anchor = headlineRef.current;
    const ball = ballRef.current;
    if (!sim || !playArea || !anchor || !ball) return;
    sim.setBounds(measureSphereBounds(playArea, anchor, ball.offsetWidth / 2), ball.offsetWidth / 2);
  };

  const applyRender = () => {
    const sim = simRef.current;
    const shell = shellRef.current;
    const body = bodyRef.current;
    const shadow = shadowRef.current;
    if (!sim || !shell || !body || !shadow) return;

    const s = sim.getRenderState();
    const deg = Math.round(((s.rotation * 180) / Math.PI) * 10) / 10;
    shell.style.transform = `translate3d(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px), 0) rotate(${deg}deg)`;
    shell.style.cursor = draggingRef.current ? "grabbing" : "grab";
    body.style.transform = `scale3d(${s.squashX * s.breathScale}, ${s.squashY * s.breathScale}, 1)`;
    shadow.style.transform = `translate3d(-50%, 0, 0) scale(${s.shadowScaleX}, ${s.shadowScaleY})`;
    shadow.style.opacity = `${s.shadowOpacity}`;
  };

  useEffect(() => {
    simRef.current = new HeroSphereSimulator();
    measureAndApplyBounds();
    applyRender();

    const onResize = () => measureAndApplyBounds();
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      const sim = simRef.current;
      if (sim) {
        const last = lastFrameRef.current || now;
        const dt = Math.min((now - last) / 1000, 1 / 45);
        lastFrameRef.current = now;
        if (!reduceMotion) sim.step(dt);
        else sim.step(dt * 0.35);
        applyRender();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [headlineRef, playAreaRef, reduceMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const sim = simRef.current;
    const anchor = headlineRef.current;
    if (!sim || !anchor) return;

    measureAndApplyBounds();
    const offset = clientToSphereOffset(e.clientX, e.clientY, anchor);
    sim.pointerDown(sim.x, sim.y, offset.x, offset.y);
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFaceEngaged(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    const sim = simRef.current;
    const anchor = headlineRef.current;
    if (!sim || !anchor) return;
    const offset = clientToSphereOffset(e.clientX, e.clientY, anchor);
    sim.pointerMove(offset.x, offset.y);
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const sim = simRef.current;
    if (sim && draggingRef.current) sim.pointerUp();
    draggingRef.current = false;
    pointerIdRef.current = null;
    setFaceEngaged(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <motion.div
      className="nova-hero-sphere-wrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ opacity: ballOpacity, zIndex: ballZ }}
    >
      <div
        ref={shellRef}
        role="img"
        aria-label="Drag the face ball"
        className="nova-hero-sphere touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onMouseEnter={() => setFaceEngaged(true)}
        onMouseLeave={() => {
          if (!draggingRef.current) setFaceEngaged(false);
        }}
      >
        <div
          ref={shadowRef}
          aria-hidden
          className="nova-hero-sphere-shadow pointer-events-none absolute left-1/2 top-[88%]"
        />
        <div ref={ballRef} className="relative">
          <div
            ref={bodyRef}
            className="nova-hero-sphere-body relative h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
          >
            <motion.div className="h-full w-full" style={{ filter: scrollBlur }}>
              <BallSphere
                lidScale={combinedLid}
                mouthRadius={mouthRadius}
                mouthHeight={mouthHeight}
                mouthWidth={mouthWidth}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
