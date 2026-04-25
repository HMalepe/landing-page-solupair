import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { articlesByCategory, CATEGORIES } from "@/content/articles";
import { ArticleCard } from "@/components/article/ArticleCard";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat, articles: articlesByCategory(params.slug) };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return { meta: [{ title: "Category — Shelf Life Wisdom" }] };
    return {
      meta: [
        { title: `${cat.label} — Shelf Life Wisdom` },
        { name: "description", content: `All Shelf Life Wisdom articles on ${cat.label}.` },
        { property: "og:title", content: `${cat.label} — Shelf Life Wisdom` },
        { property: "og:description", content: `Wisdom on ${cat.label}, from operators who do the work.` },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-serif text-4xl">Topic not found.</h1>
        <Link to="/categories" className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-teal">← All topics</Link>
      </div>
    </div>
  ),
});

function CategoryPage() {
  const { cat, articles } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-32 pb-24">
      <Link to="/categories" className="font-mono text-[10px] uppercase tracking-wider text-teal hover:underline">
        ← All Topics
      </Link>
      <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
        {cat.emoji} {cat.label}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Everything we've published on {cat.label}.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a: typeof articles[number]) => <ArticleCard key={a.slug} article={a} />)}
      </div>
      {articles.length === 0 && <p className="py-16 text-center text-muted-foreground">No articles in this topic yet.</p>}
    </div>
  );
}
