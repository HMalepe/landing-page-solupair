import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";
import {
  ballDiameterPx,
  convergeBalls,
  createPhysicsBall,
  stepPhysics,
  type PhysicsBall,
} from "@/lib/viewport-ball-physics";

const MEET_INTERVAL_MS = 3000;

function applyBallTransform(el: HTMLDivElement | null, ball: PhysicsBall) {
  if (!el) return;
  const d = ball.radius * 2;
  el.style.width = `${d}px`;
  el.style.height = `${d}px`;
  el.style.transform = `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0) scale(${ball.squashX}, ${ball.squashY})`;
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

  useEffect(() => {
    const measure = () => {
      boundsRef.current = { width: window.innerWidth, height: window.innerHeight };
      const radius = ballDiameterPx(window.innerWidth) / 2;
      if (ballsRef.current.length === 0) {
        ballsRef.current = [
          createPhysicsBall(boundsRef.current, radius),
          createPhysicsBall(boundsRef.current, radius),
        ];
      } else {
        for (const ball of ballsRef.current) {
          ball.radius = radius;
        }
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const meetTimer = window.setInterval(() => {
      convergeBalls(ballsRef.current);
    }, MEET_INTERVAL_MS);

    const tick = () => {
      const balls = ballsRef.current;
      if (balls.length === 2) {
        stepPhysics(balls, boundsRef.current);
        applyBallTransform(ballARef.current, balls[0]);
        applyBallTransform(ballBRef.current, balls[1]);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", measure);
      window.clearInterval(meetTimer);
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
