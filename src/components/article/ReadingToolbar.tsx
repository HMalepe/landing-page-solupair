import { useEffect, useState } from "react";
import { Headphones, BookOpen, Share2, ChevronUp } from "lucide-react";

type Props = {
  readMinutes: number;
  onAudio: () => void;
  onReadingMode: () => void;
  onShare: () => void;
};

export function ReadingToolbar({ readMinutes, onAudio, onReadingMode, onShare }: Props) {
  const [pct, setPct] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setPct(p);
      setShow(h.scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const minsLeft = Math.max(0, Math.round(readMinutes * (1 - pct / 100)));

  if (!show) return null;

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:left-auto md:right-6 md:bottom-auto md:top-24 md:translate-x-0">
      <div className="flex items-center gap-1 rounded-full border border-border bg-surface/95 px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-xl shadow-teal-faint">
        <span className="hidden px-2 text-teal sm:inline">{Math.round(pct)}%</span>
        <span className="hidden border-l border-border px-2 sm:inline">{minsLeft} min left</span>
        <button onClick={onAudio} className="rounded-full p-2 transition-colors hover:bg-navy hover:text-teal" aria-label="Audio">
          <Headphones className="h-3.5 w-3.5" />
        </button>
        <button onClick={onReadingMode} className="rounded-full p-2 transition-colors hover:bg-navy hover:text-teal" aria-label="Reading mode">
          <BookOpen className="h-3.5 w-3.5" />
        </button>
        <button onClick={onShare} className="rounded-full p-2 transition-colors hover:bg-navy hover:text-teal" aria-label="Share">
          <Share2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full p-2 transition-colors hover:bg-navy hover:text-teal"
          aria-label="To top"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
