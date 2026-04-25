import { useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/content/articles";

type CacheRow = { bullets: string[] };

function articleToText(a: Article): string {
  return a.body
    .map((b) => {
      if (b.type === "p") return b.text;
      if (b.type === "h2" || b.type === "h3") return b.text;
      if (b.type === "quote") return `"${b.text}"`;
      if (b.type === "callout") return `${b.title}: ${b.text}`;
      if (b.type === "stat") return `${b.value} — ${b.label}`;
      if (b.type === "list") return b.items.join(". ");
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function QuickTake({ article }: { article: Article }) {
  // Default expanded on mobile, collapsed desktop
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  const [bullets, setBullets] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      // 1. Try cache
      const { data: cached } = await supabase
        .from("article_quick_takes")
        .select("bullets")
        .eq("slug", article.slug)
        .maybeSingle();

      if (cancelled) return;
      if (cached && Array.isArray((cached as unknown as CacheRow).bullets)) {
        setBullets((cached as unknown as CacheRow).bullets);
        setLoading(false);
        return;
      }

      // 2. Generate
      const { data, error: fnError } = await supabase.functions.invoke("article-quick-take", {
        body: {
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle,
          body: articleToText(article),
        },
      });

      if (cancelled) return;
      if (fnError || !data?.bullets) {
        setError("Quick Take is taking a moment. Try refreshing.");
        setLoading(false);
        return;
      }
      setBullets(data.bullets as string[]);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [article.slug]);

  return (
    <div
      className="my-10 overflow-hidden rounded-md border border-border"
      style={{
        backgroundColor: "var(--color-navy)",
        borderLeft: "3px solid var(--color-teal)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-teal">
          <Sparkles className="h-3.5 w-3.5" />
          Quick Take — No time? Read this.
        </span>
        <ChevronDown
          className={`h-4 w-4 text-teal transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            {loading && (
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Generating quick take…
              </p>
            )}
            {error && <p className="text-sm text-muted-foreground">{error}</p>}
            {bullets && (
              <ul className="space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              AI-generated summary · Shelf Life Wisdom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
