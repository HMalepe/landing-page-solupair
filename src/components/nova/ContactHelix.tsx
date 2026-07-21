import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  /** Position along helix axis (0–1 loops the ribbon). */
  t: number;
  strand: 0 | 1;
  size: number;
  hue: number;
  sparkle: number;
};

function buildParticles(count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      t: i / count,
      strand: (i % 2) as 0 | 1,
      size: 1.6 + (i % 9) * 0.42,
      hue: i % 2 === 0 ? 192 + (i % 4) * 3 : 300 + (i % 6) * 5,
      sparkle: (i * 0.17) % 1,
    });
  }
  return out;
}

/**
 * Soft double-helix particle ribbon — projected 3D look without WebGL.
 * Drifts slowly left → right across the contact band.
 */
export function ContactHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const particles = buildParticles(280);
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const start = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      paint(ctx, particles, w, h, 0, true);
    };

    const tick = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      paint(ctx, particles, w, h, t, false);
      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    if (reduceMotion) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduceMotion]);

  return (
    <div
      aria-hidden
      className="nova-contact-helix pointer-events-none absolute inset-x-0 top-[42%] h-[220px] -translate-y-1/2 overflow-hidden sm:h-[280px] lg:h-[320px]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="nova-contact-helix-fade pointer-events-none absolute inset-0" />
    </div>
  );
}

function paint(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  time: number,
  frozen: boolean,
) {
  // Slow left→right crawl (~45s for a full loop).
  const drift = frozen ? 0.1 : time * 0.022;
  const turns = 3.6;
  const ampY = h * 0.34;
  const cxPad = w * 0.02;
  const usableW = w - cxPad * 2;
  const midY = h * 0.5;

  const ambience = ctx.createRadialGradient(w * 0.5, midY, 8, w * 0.5, midY, w * 0.62);
  ambience.addColorStop(0, "oklch(0.55 0.22 288 / 0.22)");
  ambience.addColorStop(0.4, "oklch(0.72 0.14 200 / 0.1)");
  ambience.addColorStop(1, "transparent");
  ctx.fillStyle = ambience;
  ctx.fillRect(0, 0, w, h);

  type Proj = { p: Particle; x: number; y: number; depth: number };
  const projected: Proj[] = new Array(particles.length);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!;
    const phase = (p.t + drift) % 1;
    const angle = phase * Math.PI * 2 * turns + p.strand * Math.PI;
    const z = Math.sin(angle);
    const depth = (z + 1) * 0.5;
    projected[i] = {
      p,
      x: cxPad + phase * usableW,
      y: midY + Math.cos(angle) * ampY * 0.62 + z * ampY * 0.42,
      depth,
    };
  }

  projected.sort((a, b) => a.depth - b.depth);

  // DNA rungs — pair opposite strands at matching t
  ctx.lineCap = "round";
  for (let i = 0; i < projected.length; i += 8) {
    const a = projected[i]!;
    let best: Proj | null = null;
    let bestDist = 0.03;
    for (let j = 0; j < projected.length; j++) {
      const b = projected[j]!;
      if (b.p.strand === a.p.strand) continue;
      const d = Math.abs(((b.p.t - a.p.t + 0.5) % 1) - 0.5);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    if (!best) continue;
    const alpha = 0.12 + ((a.depth + best.depth) * 0.5) * 0.28;
    ctx.strokeStyle = `oklch(0.78 0.14 ${a.p.hue} / ${alpha})`;
    ctx.lineWidth = 1.2 + a.depth * 1.4;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(best.x, best.y);
    ctx.stroke();
  }

  // Soft strand trails
  for (const strand of [0, 1] as const) {
    const pts = projected.filter((q) => q.p.strand === strand).sort((a, b) => a.x - b.x);
    if (pts.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo(pts[0]!.x, pts[0]!.y);
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const cur = pts[i]!;
      const mx = (prev.x + cur.x) / 2;
      const my = (prev.y + cur.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    ctx.strokeStyle = strand === 0 ? "oklch(0.78 0.14 192 / 0.22)" : "oklch(0.62 0.24 310 / 0.2)";
    ctx.lineWidth = 2.2;
    ctx.stroke();
  }

  for (const { p, x, y, depth } of projected) {
    const pulse = frozen ? 1 : 0.78 + 0.22 * Math.sin(time * 1.15 + p.sparkle * Math.PI * 2);
    const radius = (1.8 + p.size * (0.85 + depth * 1.75)) * pulse;
    const alpha = 0.32 + depth * 0.68;
    const glow = 8 + depth * 22;

    const bloom = ctx.createRadialGradient(x, y, 0, x, y, glow);
    bloom.addColorStop(0, `oklch(0.82 0.16 ${p.hue} / ${alpha * 0.65})`);
    bloom.addColorStop(0.4, `oklch(0.62 0.22 ${p.hue} / ${alpha * 0.28})`);
    bloom.addColorStop(1, "transparent");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(x, y, glow, 0, Math.PI * 2);
    ctx.fill();

    const core = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    core.addColorStop(0, `oklch(0.97 0.03 ${p.hue} / ${Math.min(1, alpha + 0.2)})`);
    core.addColorStop(0.5, `oklch(0.72 0.18 ${p.hue} / ${alpha})`);
    core.addColorStop(1, `oklch(0.4 0.18 ${p.hue} / 0)`);
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
