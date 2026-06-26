import { createFileRoute } from "@tanstack/react-router";
import { NovaHome } from "@/components/nova/NovaHome";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: NovaHome,
  head: () => ({
    meta: [
      { title: "NØVA — We Design The Future" },
      {
        name: "description",
        content: "Digital experiences crafted with precision, motion & purpose.",
      },
      { name: "author", content: "Solupair" },
      { property: "og:title", content: "NØVA — We Design The Future" },
      {
        property: "og:description",
        content: "Digital experiences crafted with precision, motion & purpose.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NØVA — We Design The Future" },
      {
        name: "twitter:description",
        content: "Digital experiences crafted with precision, motion & purpose.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
});
