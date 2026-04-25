import { useState } from "react";
import { ARTICLES, CATEGORIES } from "@/content/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Reveal } from "@/components/brand/Reveal";

export function LatestGrid() {
  const [active, setActive] = useState<string | "all">("all");
  const filtered = active === "all" ? ARTICLES : ARTICLES.filter((a) => a.categorySlug === active);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">
            Latest Wisdom
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
            Read what the floor reads.
          </h2>
        </div>
      </div>

      <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
            active === "all"
              ? "bg-teal text-background scale-105"
              : "border border-border bg-surface text-muted-foreground hover:text-teal"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
              active === c.slug
                ? "bg-teal text-background scale-105"
                : "border border-border bg-surface text-muted-foreground hover:text-teal"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div
        key={active}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        style={{ animation: "fadeIn 0.4s ease" }}
      >
        {filtered.map((a, i) => (
          <Reveal key={a.slug} delay={i * 60}>
            <ArticleCard article={a} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No articles in this topic yet. More wisdom coming soon.
        </p>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </section>
  );
}
