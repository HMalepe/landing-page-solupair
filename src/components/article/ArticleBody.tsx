import { useState } from "react";
import type { Article, ArticleBlock } from "@/content/articles";
import { slugifyHeading } from "@/content/articles";
import { StatBlock } from "./StatBlock";
import { WasteCalculator } from "./WasteCalculator";
import { Lightbulb, BarChart3, Hash } from "lucide-react";

function GlossaryTerm({
  term,
  definition,
  children,
}: {
  term: string;
  definition: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-block cursor-help border-b border-dashed border-teal/60 text-foreground"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-md border border-border bg-surface p-4 text-left text-sm font-normal not-italic shadow-teal-faint"
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <span className="block font-mono text-[10px] uppercase tracking-wider text-teal">
            {term}
          </span>
          <span className="mt-1 block leading-relaxed text-muted-foreground">{definition}</span>
        </span>
      )}
    </span>
  );
}

function withGlossary(text: string, glossary?: Record<string, string>): React.ReactNode {
  if (!glossary) return text;
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  if (terms.length === 0) return text;
  const re = new RegExp(`\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const term = m[1];
    parts.push(
      <GlossaryTerm key={`${term}-${i++}`} term={term} definition={glossary[term]}>
        {term}
      </GlossaryTerm>
    );
    last = m.index + term.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="article-body mx-auto max-w-[680px]">
      {article.body.map((block, i) => (
        <Block key={i} block={block} glossary={article.glossary} />
      ))}
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

function Block({
  block,
  glossary,
}: {
  block: ArticleBlock;
  glossary?: Record<string, string>;
}) {
  switch (block.type) {
    case "p":
      return (
        <p className="my-6 text-[18px] leading-[1.9] text-foreground/90">
          {withGlossary(block.text, glossary)}
        </p>
      );
    case "h2": {
      const id = block.id ?? slugifyHeading(block.text);
      return (
        <h2 id={id} className="group mt-16 mb-6 flex items-baseline gap-2 font-serif text-3xl tracking-tight md:text-4xl">
          <span className="text-teal">·</span>
          <span>{block.text}</span>
          <a
            href={`#${id}`}
            className="ml-2 opacity-0 transition-opacity group-hover:opacity-100 text-teal"
            aria-label="Anchor"
          >
            <Hash className="inline h-4 w-4" />
          </a>
        </h2>
      );
    }
    case "h3": {
      const id = block.id ?? slugifyHeading(block.text);
      return (
        <h3 id={id} className="mt-10 mb-4 font-serif text-2xl tracking-tight">
          {block.text}
        </h3>
      );
    }
    case "quote":
      return (
        <blockquote
          className="my-12 -mx-2 rounded-r-md py-2 pl-6 pr-2 md:-mx-12"
          style={{
            borderLeft: "3px solid var(--color-teal)",
            backgroundColor: "color-mix(in oklab, var(--color-teal) 5%, transparent)",
          }}
        >
          <p className="font-serif text-2xl italic leading-snug text-foreground md:text-[28px]">
            {block.text}
          </p>
        </blockquote>
      );
    case "callout":
      return (
        <div
          className="my-10 rounded-md p-5"
          style={{
            backgroundColor: "var(--color-navy)",
            borderLeft: "3px solid var(--color-teal)",
          }}
        >
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-teal">
            {block.variant === "tip" ? <Lightbulb className="h-3.5 w-3.5" /> : <BarChart3 className="h-3.5 w-3.5" />}
            {block.title}
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">{block.text}</p>
        </div>
      );
    case "stat":
      return (
        <StatBlock
          value={block.value}
          label={block.label}
          numeric={block.numeric}
          prefix={block.prefix}
          suffix={block.suffix}
        />
      );
    case "calculator":
      return <WasteCalculator />;
    case "list":
      return (
        <ul className="my-6 space-y-3 pl-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-relaxed text-foreground/90">
              <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-teal" />
              <span>{withGlossary(it, glossary)}</span>
            </li>
          ))}
        </ul>
      );
  }
}
