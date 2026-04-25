import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

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
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY };
      setPos(target);
      const el = e.target as HTMLElement | null;
      const interactive =
        !!el?.closest("a, button, [role=button], input, textarea, summary, label");
      setActive(interactive);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      setRingPos({ x: current.x, y: current.y });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-teal"
        style={{ left: pos.x - 4, top: pos.y - 4 }}
      />
      <div
        className="pointer-events-none fixed z-[9999] rounded-full border transition-[width,height,background-color,border-color] duration-200"
        style={{
          left: ringPos.x - 16,
          top: ringPos.y - 16,
          width: active ? 40 : 32,
          height: active ? 40 : 32,
          marginLeft: active ? -4 : 0,
          marginTop: active ? -4 : 0,
          borderColor: active ? "var(--color-teal)" : "color-mix(in oklab, var(--color-teal) 40%, transparent)",
          backgroundColor: active ? "color-mix(in oklab, var(--color-teal) 15%, transparent)" : "transparent",
        }}
      />
    </>
  );
}
