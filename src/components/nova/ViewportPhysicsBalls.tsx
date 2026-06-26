import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";
import {
  ballDiameterPx,
  createPhysicsBall,
  stepPhysics,
  type PhysicsBall,
} from "@/lib/viewport-ball-physics";

function applyBallTransform(el: HTMLDivElement | null, ball: PhysicsBall) {
  if (!el) return;
  const d = ball.radius * 2;
  const tx = Math.round((ball.x - ball.radius) * 2) / 2;
  const ty = Math.round((ball.y - ball.radius) * 2) / 2;
  el.style.width = `${d}px`;
  el.style.height = `${d}px`;
  el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale3d(${ball.squashX}, ${ball.squashY}, 1)`;
}

function StaticPair() {
  return (
    <>
      <div
        className="nova-viewport-physics-ball"
        style={{ transform: "translate3d(12vw, 18vh, 0)" }}
      >
        <BallSphere />
      </div>
      <div
        className="nova-viewport-physics-ball"
        style={{ transform: "translate3d(58vw, 52vh, 0)" }}
      >
        <BallSphere />
      </div>
    </>
  );
}

function PhysicsPair() {
  const ballARef = useRef<HTMLDivElement>(null);
  const ballBRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<PhysicsBall[]>([]);
  const boundsRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      boundsRef.current = { width: window.innerWidth, height: window.innerHeight };
      const radius = ballDiameterPx(window.innerWidth) / 2;
      if (ballsRef.current.length === 0) {
        ballsRef.current = [
          createPhysicsBall(boundsRef.current, radius, {
            speedScale: 1.18,
            minSpeed: 0.22,
            maxSpeed: 7.8,
            driftStrength: 0.42,
          }),
          createPhysicsBall(boundsRef.current, radius, {
            speedScale: 0.92,
            minSpeed: 0.16,
            maxSpeed: 6.4,
            driftStrength: 0.68,
          }),
        ];
      } else {
        for (const ball of ballsRef.current) {
          ball.radius = radius;
        }
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      const dt = Math.min((now - last) / 1000, 1 / 45);
      lastFrameRef.current = now;

      const balls = ballsRef.current;
      if (balls.length === 2) {
        stepPhysics(balls, boundsRef.current, dt);
        applyBallTransform(ballARef.current, balls[0]);
        applyBallTransform(ballBRef.current, balls[1]);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={ballARef} className="nova-viewport-physics-ball">
        <BallSphere />
      </div>
      <div ref={ballBRef} className="nova-viewport-physics-ball">
        <BallSphere />
      </div>
    </>
  );
}

/** Two blurred balls in the lower sections — physics-driven, scroll-independent. */
export function ViewportPhysicsBalls() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const target = document.querySelector(".nova-lower-shell");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.02, rootMargin: "0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden className="nova-viewport-physics-stage">
      {reduceMotion ? <StaticPair /> : <PhysicsPair />}
    </div>
  );
}
