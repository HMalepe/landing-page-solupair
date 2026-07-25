import { useEffect, useRef, useState, type RefObject } from "react";
import { computeWordmarkORect, type Rect } from "@/lib/logo-o-rect";

/**
 * Tracks the smiley "O"'s on-screen rect, relative to `wrapRef` (a
 * `position: relative` ancestor of the wordmark <img>), recomputing whenever
 * the image resizes (responsive max-width clamps, viewport resize, zoom).
 */
export function useWordmarkORect(
  wrapRef: RefObject<HTMLElement | null>,
  imgRef: RefObject<HTMLImageElement | null>,
  enabled: boolean,
) {
  const [rect, setRect] = useState<Rect | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const measure = () => {
      const wrapBox = wrap.getBoundingClientRect();
      const imgBox = img.getBoundingClientRect();
      setRect(
        computeWordmarkORect({
          left: imgBox.left - wrapBox.left,
          top: imgBox.top - wrapBox.top,
          width: imgBox.width,
          height: imgBox.height,
        }),
      );
    };

    const scheduleMeasure = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };

    scheduleMeasure();

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(img);
    ro.observe(wrap);

    window.addEventListener("resize", scheduleMeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, wrapRef, imgRef]);

  return rect;
}
