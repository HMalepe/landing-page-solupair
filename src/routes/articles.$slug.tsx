import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Headphones, Copy, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { articleBySlug, relatedArticles, ARTICLES } from "@/content/articles";
import { CategoryTag, FreshnessBadge, ShelfCheckBadge } from "@/components/brand/Badges";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ReadingToolbar } from "@/components/article/ReadingToolbar";
import { QuickTake } from "@/components/article/QuickTake";
import { AudioPlayer } from "@/components/article/AudioPlayer";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { SocialRail } from "@/components/article/SocialRail";
import { ArticleFeedback } from "@/components/article/ArticleFeedback";
import { ArticleChat } from "@/components/article/ArticleChat";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Article — Shelf Life Wisdom" }] };
    return {
      meta: [
        { title: `${a.title} — Shelf Life Wisdom` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:type", content: "article" },
        { property: "article:author", content: a.author.name },
        { property: "article:published_time", content: a.publishedAt },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            author: { "@type": "Person", name: a.author.name },
            datePublished: a.publishedAt,
            dateModified: a.lastVerified,
            publisher: { "@type": "Organization", name: "Shelf Life Wisdom" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-teal">404 · Off Shelf</p>
        <h1 className="mt-3 font-serif text-5xl">Article expired.</h1>
        <Link to="/articles" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-teal hover:underline">
          ← Back to articles
        </Link>
      </div>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const [audioOpen, setAudioOpen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : `https://shelflifewisdom.com/articles/${article.slug}`;
  const related = relatedArticles(article, 3);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: article.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {}
  };

  return (
    <div className={readingMode ? "font-serif text-[19px] leading-[2]" : ""}>
      <ReadingProgress />
      <ReadingToolbar
        readMinutes={article.readMinutes}
        onAudio={() => setAudioOpen((v) => !v)}
        onReadingMode={() => setReadingMode((v) => !v)}
        onShare={share}
      />

      <article className="relative">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 pt-32 pb-20 xl:grid-cols-[60px_1fr_240px]">
          <SocialRail url={url} title={article.title} />

          <div>
            {/* Header */}
            <header className="mx-auto max-w-[760px]">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryTag>{article.category}</CategoryTag>
                <ShelfCheckBadge level={article.level} />
                <FreshnessBadge verifiedAt={article.lastVerified} />
              </div>
              <h1
                className="mt-6 font-serif font-medium tracking-tight"
                style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.05 }}
              >
                {article.title}
              </h1>
              <p className="mt-5 font-serif text-2xl italic leading-snug text-muted-foreground md:text-[28px]">
                {article.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-mono text-xs text-teal">
                    {article.author.initials}
                  </span>
                  <div>
                    <p className="font-serif text-base">{article.author.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}{" "}· {article.readMinutes} min read
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {article.hasAudio && (
                    <button
                      onClick={() => setAudioOpen((v) => !v)}
                      className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-teal hover:bg-teal hover:text-background"
                    >
                      <Headphones className="h-3 w-3" /> Listen
                    </button>
                  )}
                  <button onClick={share} className="rounded-full border border-border bg-surface p-2 text-muted-foreground hover:text-teal" aria-label="Copy link">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-surface p-2 text-muted-foreground hover:text-teal">
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-surface p-2 text-muted-foreground hover:text-teal">
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {audioOpen && <AudioPlayer onClose={() => setAudioOpen(false)} title={article.title} />}

              <QuickTake article={article} />
            </header>

            <ArticleBody article={article} />

            <div className="mx-auto max-w-[680px]">
              <ArticleFeedback slug={article.slug} />

              {/* Author bio */}
              <div
                className="my-12 rounded-md p-6"
                style={{ backgroundColor: "var(--color-navy)", borderLeft: "3px solid var(--color-teal)" }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background font-mono text-sm text-teal">
                    {article.author.initials}
                  </span>
                  <div>
                    <p className="font-serif text-xl">{article.author.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-teal">{article.author.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Freshness note */}
              <p className="my-12 flex items-center gap-2 border-l-2 border-teal pl-4 text-sm text-muted-foreground">
                <span className="text-teal">✓</span>
                This article was last verified{" "}
                {new Date(article.lastVerified).toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
                Facts and figures are reviewed every 6 months.
              </p>
            </div>
          </div>

          <TableOfContents article={article} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border bg-surface/40">
            <div className="mx-auto max-w-[1200px] px-6 py-20">
              <div className="mb-10 flex items-baseline justify-between">
                <h2 className="font-serif text-3xl tracking-tight md:text-4xl">More Shelf Wisdom</h2>
                <Link to="/articles" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-teal hover:underline">
                  All articles <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterCTA source={`article:${article.slug}`} />
      </article>

      <ArticleChat article={article} />
    </div>
  );
}

// Avoid unused import lint
void ARTICLES;
