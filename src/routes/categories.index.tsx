import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, CATEGORIES } from "@/content/articles";

export const Route = createFileRoute("/categories/")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Shelf Life Wisdom" },
      { name: "description", content: "Browse Shelf Life Wisdom by topic — from FIFO to cold chain." },
      { property: "og:title", content: "Categories — Shelf Life Wisdom" },
      { property: "og:description", content: "Browse our wisdom by topic." },
    ],
  }),
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">Topics</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight md:text-6xl">Browse by topic.</h1>
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => {
          const count = ARTICLES.filter((a) => a.categorySlug === c.slug).length;
          return (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="card-hover flex items-center justify-between rounded-md border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className="card-title font-serif text-2xl tracking-tight">{c.label}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    {count} {count === 1 ? "article" : "articles"}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-teal">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
