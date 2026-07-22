import { useEffect, useRef, useState } from "react";

/**
 * Bumps when the user scrolls back to the top after leaving the hero —
 * so home sections can remount and replay entrance motion from scratch.
 */
export function useHomeMotionEpoch() {
  const [epoch, setEpoch] = useState(0);
  const leftHero = useRef(false);

  useEffect(() => {
    const markProgress = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (vh <= 0) return;

      // Past most of the first viewport — treat as having left page one.
      if (y > vh * 0.55) {
        leftHero.current = true;
        return;
      }

      // Back near the top after leaving — fresh motion cycle.
      if (leftHero.current && y < vh * 0.12) {
        leftHero.current = false;
        setEpoch((n) => n + 1);
      }
    };

    markProgress();
    window.addEventListener("scroll", markProgress, { passive: true });
    return () => window.removeEventListener("scroll", markProgress);
  }, []);

  return epoch;
}
