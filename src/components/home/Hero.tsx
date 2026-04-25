import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";

const TOPICS = [
  "FIFO", "FEFO", "Expiry Management", "Waste Reduction", "Stock Rotation",
  "Purchasing", "Shelf Strategy", "Zero Waste Ops", "Cold Chain", "Receiving Discipline",
];

function WasteCounter() {
  // Simulated live ticker. Roughly $9.6M/min global perishable waste.
  const PER_SECOND = 160_000;
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const elapsed = (now - start) / 1000;
  const value = Math.floor(elapsed * PER_SECOND);
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
        ⚠ Lost since you arrived
      </p>
      <p className="font-mono text-2xl tabular-nums text-teal md:text-3xl">
        ${value.toLocaleString("en-US")}
      </p>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        in expired stock — globally — every second.
      </p>
    </div>
  );
}

function TopicMarquee() {
  return (
    <div className="marquee relative w-full overflow-hidden border-y border-border bg-background py-4">
      <div className="marquee-track gap-12">
        {[...TOPICS, ...TOPICS, ...TOPICS].map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-teal"
          >
            {t} <span className="ml-12 text-text-tertiary">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100vh] flex-col overflow-hidden bg-background pt-24">
      <div className="grain" />
      <div className="hero-glow" />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="word-reveal mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-teal">
          <span style={{ animationDelay: "0ms" }}>~ by ExpiryDesk</span>
        </p>

        <h1
          className="font-serif font-medium leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(52px, 9vw, 120px)" }}
        >
          <span className="word-reveal block">
            <span style={{ animationDelay: "100ms" }}>SHELF LIFE</span>
          </span>
          <span className="word-reveal block">
            <span style={{ animationDelay: "200ms" }}>WISDOM</span>
          </span>
        </h1>

        <p
          className="word-reveal mt-8 font-serif italic text-foreground/90"
          style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
        >
          <span style={{ animationDelay: "400ms" }}>
            Know your <span className="gradient-teal not-italic font-semibold">shelf</span>.
          </span>
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/articles"
            className="btn-fill rounded-full border border-teal px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-teal"
          >
            Start Reading
          </Link>
          <Link
            to="/categories"
            className="btn-fill rounded-full border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Browse Topics
          </Link>
        </div>

        <div className="mt-16">
          <WasteCounter />
        </div>
      </div>

      <TopicMarquee />

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-teal arrow-pulse">
        <ArrowDown className="h-5 w-5" />
      </div>
    </section>
  );
}
