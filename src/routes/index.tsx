import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { NovaHome } from "@/components/nova/NovaHome";
import { NovaHomeFallback } from "@/components/nova/nova-home-shared";
import { absoluteUrl } from "@/lib/site";
import "@/styles-nova.css";

function HomePage() {
  return (
    <ClientOnly fallback={<NovaHomeFallback />}>
      <NovaHome />
    </ClientOnly>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "NØVA — We Design The Future" },
      {
        name: "description",
        content:
          "Automation and web design — web applications with admin dashboards, WhatsApp booking agents, and more from Solupair.",
      },
      { name: "author", content: "Solupair" },
      { property: "og:title", content: "NØVA — We Design The Future" },
      {
        property: "og:description",
        content:
          "Automation and web design — web applications with admin dashboards, WhatsApp booking agents, and more from Solupair.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NØVA — We Design The Future" },
      {
        name: "twitter:description",
        content:
          "Automation and web design — web applications with admin dashboards, WhatsApp booking agents, and more from Solupair.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
});
