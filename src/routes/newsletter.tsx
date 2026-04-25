import { createFileRoute } from "@tanstack/react-router";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export const Route = createFileRoute("/newsletter")({
  component: NewsletterPage,
  head: () => ({
    meta: [
      { title: "Newsletter — Shelf Life Wisdom" },
      { name: "description", content: "Weekly inventory insights for people who actually work the floor. Free. No fluff." },
      { property: "og:title", content: "Newsletter — Shelf Life Wisdom" },
      { property: "og:description", content: "One email a week. Five minutes. Pure operator wisdom." },
    ],
  }),
});

function NewsletterPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[760px] px-6 pt-12 pb-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">The Newsletter</p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
          One email. Five minutes. No fluff.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
          Every Thursday morning. The most useful inventory thinking we found that week,
          curated by operators for operators. No marketing copy. No upsells. Unsubscribe in one click.
        </p>
      </div>
      <NewsletterCTA source="newsletter-page" />
    </div>
  );
}
