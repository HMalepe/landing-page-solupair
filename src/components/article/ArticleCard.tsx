import { Link } from "@tanstack/react-router";
import { Volume2 } from "lucide-react";
import type { Article } from "@/content/articles";
import { ShelfCheckBadge, FreshnessBadge, CategoryTag } from "@/components/brand/Badges";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="card-hover group block rounded-md border border-border bg-surface p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <CategoryTag>{article.category}</CategoryTag>
        <ShelfCheckBadge level={article.level} />
        <FreshnessBadge verifiedAt={article.lastVerified} />
      </div>
      <h3 className="card-title mt-5 font-serif text-2xl leading-tight tracking-tight transition-colors">
        {article.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[9px] font-medium text-teal">
            {article.author.initials}
          </span>
          <span className="text-muted-foreground">{article.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{article.readMinutes} min</span>
          {article.hasAudio && <Volume2 className="h-3 w-3 text-teal" />}
        </div>
      </div>
    </Link>
  );
}
