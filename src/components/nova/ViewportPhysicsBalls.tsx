import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";
import {
  ballDiameterPx,
  ballRenderTransform,
  createPhysicsBall,
  stepPhysics,
  type PhysicsBall,
} from "@/lib/viewport-ball-physics";

function applyBallTransform(el: HTMLDivElement | null, ball: PhysicsBall) {
  if (!el) return;
  const { d, tx, ty, sx, sy } = ballRenderTransform(ball);
  el.style.width = `${d}px`;
  el.style.height = `${d}px`;
  el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale3d(${sx}, ${sy}, 1)`;
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
      const prev = boundsRef.current;
      const next = { width: window.innerWidth, height: window.innerHeight };
      boundsRef.current = next;
      const radius = ballDiameterPx(window.innerWidth) / 2;
      if (ballsRef.current.length === 0) {
        ballsRef.current = [
          createPhysicsBall(next, radius, {
            speedScale: 1.05,
            minSpeed: 0.52,
            maxSpeed: 2.55,
            driftStrength: 0.48,
          }),
          createPhysicsBall(next, radius, {
            speedScale: 0.88,
            minSpeed: 0.42,
            maxSpeed: 2.15,
            driftStrength: 0.72,
          }),
        ];
        // Bias starting sides so they don't spawn stacked.
        ballsRef.current[0].x = next.width * 0.28;
        ballsRef.current[0].y = next.height * 0.38;
        ballsRef.current[1].x = next.width * 0.68;
        ballsRef.current[1].y = next.height * 0.62;
      } else {
        const sx = prev.width > 0 ? next.width / prev.width : 1;
        const sy = prev.height > 0 ? next.height / prev.height : 1;
        for (const ball of ballsRef.current) {
          ball.radius = radius;
          ball.x = Math.min(Math.max(ball.x * sx, radius), next.width - radius);
          ball.y = Math.min(Math.max(ball.y * sy, radius), next.height - radius);
        }
      }
    };

    measure();
    window.addEventListener("resize", measure);

    const tick = (now: number) => {
      const last = lastFrameRef.current || now;
      // Cap hitch spikes so a tab-return doesn't teleport the balls.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      lastFrameRef.current = now;

      const balls = ballsRef.current;
      if (balls.length === 2 && dt > 0) {
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
