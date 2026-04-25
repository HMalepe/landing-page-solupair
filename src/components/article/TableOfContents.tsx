import { useEffect, useState } from "react";
import type { Article } from "@/content/articles";
import { slugifyHeading } from "@/content/articles";

export function TableOfContents({ article }: { article: Article }) {
  const headings = article.body
    .filter((b): b is { type: "h2"; text: string; id?: string } => b.type === "h2")
    .map((h) => ({ id: h.id ?? slugifyHeading(h.text), text: h.text }));

  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [article.slug]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal">
          In this article
        </p>
        <ul className="mt-4 space-y-3 border-l border-border pl-4">
          {headings.map((h) => {
            const isActive = h.id === active;
            return (
              <li key={h.id} className="relative">
                {isActive && (
                  <span className="absolute -left-4 top-1 h-4 w-0.5 bg-teal" />
                )}
                <a
                  href={`#${h.id}`}
                  className={`block text-sm leading-snug transition-colors ${
                    isActive ? "text-teal" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
