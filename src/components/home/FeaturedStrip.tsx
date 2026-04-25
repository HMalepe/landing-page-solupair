import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/content/articles";
import { CategoryTag, FreshnessBadge, ShelfCheckBadge } from "@/components/brand/Badges";

export function FeaturedStrip({ article }: { article: Article }) {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="mb-8 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">
            Featured
          </p>
          <FreshnessBadge verifiedAt={article.lastVerified} />
        </div>

        <Link
          to="/articles/$slug"
          params={{ slug: article.slug }}
          className="group relative block"
        >
          <svg
            className="border-draw pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="var(--color-teal)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="grid grid-cols-1 gap-10 p-2 md:grid-cols-2 md:gap-16 md:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CategoryTag>{article.category}</CategoryTag>
                <ShelfCheckBadge level={article.level} />
              </div>
              <h2
                className="mt-6 font-serif font-medium tracking-tight transition-colors group-hover:text-teal"
                style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.05 }}
              >
                {article.title}
              </h2>
              <p className="mt-4 max-w-md font-serif text-xl italic text-muted-foreground">
                {article.subtitle}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    By
                  </p>
                  <p className="mt-1 font-serif text-lg">{article.author.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {article.readMinutes} min read · {article.author.role}
                  </p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-teal text-teal transition-all group-hover:bg-teal group-hover:text-background">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
