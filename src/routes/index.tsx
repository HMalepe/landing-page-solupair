import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { FeaturedStrip } from "@/components/home/FeaturedStrip";
import { LatestGrid } from "@/components/home/LatestGrid";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { featuredArticle } from "@/content/articles";
import { SectionDivider } from "@/components/brand/SectionDivider";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Shelf Life Wisdom — Know your shelf." },
      {
        name: "description",
        content:
          "Editorial-grade inventory wisdom for operators, floor managers, and inventory professionals. By ExpiryDesk.",
      },
      { property: "og:title", content: "Shelf Life Wisdom — Know your shelf." },
      {
        property: "og:description",
        content: "Where the real operators read. Inventory, expiry, waste — without the fluff.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStrip article={featuredArticle} />
      <LatestGrid />
      <SectionDivider />
      <NewsletterCTA source="home" />
    </>
  );
}
