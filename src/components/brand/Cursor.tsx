import { useEffect, useRef, useState } from "react";

type TrailPoint = { x: number; y: number; opacity: number };

const TRAIL_LIFETIME_MS = 90;
const TRAIL_MIN_GAP_PX = 5;
const TRAIL_MAX_POINTS = 12;

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [enabled, setEnabled] = useState(false);
  const lastTrailRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const points: { x: number; y: number; at: number }[] = [];

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      const last = lastTrailRef.current;
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy >= TRAIL_MIN_GAP_PX * TRAIL_MIN_GAP_PX) {
        lastTrailRef.current = { x, y };
        points.push({ x, y, at: performance.now() });
        if (points.length > TRAIL_MAX_POINTS) points.shift();
      }
    };

    const tick = () => {
      const now = performance.now();
      const visible = points
        .filter((p) => now - p.at <= TRAIL_LIFETIME_MS)
        .map((p) => {
          const t = 1 - (now - p.at) / TRAIL_LIFETIME_MS;
          return { x: p.x, y: p.y, opacity: t * 0.28 };
        });
      while (points.length > 0 && now - points[0].at > TRAIL_LIFETIME_MS) {
        points.shift();
      }
      setTrail(visible);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      setTrail([]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {trail.map((p, i) => (
        <div
          key={`${p.x}-${p.y}-${i}`}
          className="absolute rounded-full bg-cyan"
          style={{
            left: p.x - 1.5,
            top: p.y - 1.5,
            width: 3,
            height: 3,
            opacity: p.opacity,
          }}
        />
      ))}
      <div
        className="absolute h-2 w-2 rounded-full bg-cyan"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          boxShadow: "0 0 10px color-mix(in oklab, var(--color-cyan) 70%, transparent)",
        }}
      />
    </div>
  );
}
