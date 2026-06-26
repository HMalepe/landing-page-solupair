import { useReducedMotion } from "framer-motion";
import { BallSphere } from "@/components/nova/ball-sphere";

/** Fixed viewport ball — CSS-only drift; never tied to scroll or carousel. */
export function ViewportDriftBall() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div aria-hidden className="nova-viewport-ball">
      <div className="nova-viewport-ball-rider">
        <BallSphere />
      </div>
    </div>
  );
}
