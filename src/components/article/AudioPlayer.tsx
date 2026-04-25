import { useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";

export function AudioPlayer({ onClose, title }: { onClose: () => void; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Placeholder audio (silent test tone). Real TTS to be wired later.
  const SRC =
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2c4e8b3a92.mp3?filename=ambient-piano-amp-strings-10711.mp3";

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else void a.play();
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const v = Number(e.target.value);
    a.currentTime = (v / 100) * (a.duration || 0);
    setProgress(v);
  };

  const cycleSpeed = () => {
    const next: 1 | 1.5 | 2 = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return (
    <div className="my-6 rounded-md border border-border bg-surface p-4">
      <audio ref={audioRef} src={SRC} onTimeUpdate={onTimeUpdate} preload="metadata" />
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-background"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            🔊 Listening · {title}
          </p>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={onScrub}
            className="mt-1 h-1 w-full appearance-none rounded-full bg-border accent-teal"
            style={{
              background: `linear-gradient(to right, var(--color-teal) 0%, var(--color-teal) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
            }}
          />
        </div>
        <button
          onClick={cycleSpeed}
          className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-teal"
        >
          {speed}x
        </button>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground hover:text-teal"
          aria-label="Close audio"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
