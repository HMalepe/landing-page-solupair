import { useEffect, useState, type RefObject } from "react";

/**
 * Bidirectional viewport-intersection signal — toggles both ways as the
 * element scrolls in and out, unlike useSectionInView's one-shot reveal
 * latch. Used to pause background work (rAF loops, physics) when an
 * element scrolls off-screen, and resume it when it scrolls back.
 */
export function useInViewport<T extends Element>(ref: RefObject<T | null>, rootMargin = "20% 0px") {
  // Assume visible until observed — correct for the hero, which is always
  // the first thing on screen at mount.
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry?.isIntersecting ?? true),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inViewport;
}
