import { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { CountUp } from "@/components/brand/CountUp";

type Props = {
  value: string;
  label: string;
  numeric: number;
  prefix?: string;
  suffix?: string;
};

export function StatBlock({ value, label, numeric, prefix = "", suffix = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${value} — ${label} (Shelf Life Wisdom)`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="not-prose relative my-8 rounded-md border border-border bg-[#161616] p-6 md:p-8"
      style={{ borderTop: "2px solid var(--color-teal)" }}
    >
      <button
        onClick={copy}
        className="absolute right-4 top-4 rounded-full border border-border bg-surface p-2 text-muted-foreground transition-all hover:border-teal hover:text-teal"
        aria-label="Copy stat"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-teal" /> : <Clipboard className="h-3.5 w-3.5" />}
      </button>
      <p
        className="font-serif font-medium text-teal"
        style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1 }}
      >
        <CountUp to={numeric} prefix={prefix} suffix={suffix} decimals={value.includes(".") ? 1 : 0} />
      </p>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{label}</p>
      {copied && (
        <span className="absolute right-4 top-14 rounded-full bg-teal px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-background">
          Copied!
        </span>
      )}
    </div>
  );
}
