import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ARTICLES, CATEGORIES } from "@/content/articles";
import { ArticleCard } from "@/components/article/ArticleCard";

export const Route = createFileRoute("/articles/")({
  component: ArticlesIndex,
  head: () => ({
    meta: [
      { title: "All Articles — Shelf Life Wisdom" },
      { name: "description", content: "Every article on Shelf Life Wisdom. Filter by topic." },
      { property: "og:title", content: "All Articles — Shelf Life Wisdom" },
      { property: "og:description", content: "Editorial-grade inventory wisdom, all in one place." },
    ],
  }),
});

function ArticlesIndex() {
  const [active, setActive] = useState<string | "all">("all");
  const filtered = active === "all" ? ARTICLES : ARTICLES.filter((a) => a.categorySlug === active);
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">The Archive</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight md:text-6xl">All articles.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Every piece of wisdom, ordered by what we've published most recently. Filter by topic.
      </p>

      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
            active === "all" ? "bg-teal text-background scale-105" : "border border-border bg-surface text-muted-foreground hover:text-teal"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all ${
              active === c.slug ? "bg-teal text-background scale-105" : "border border-border bg-surface text-muted-foreground hover:text-teal"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => <ArticleCard key={a.slug} article={a} />)}
      </div>
    </div>
  );
}
