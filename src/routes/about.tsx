import { createFileRoute } from "@tanstack/react-router";
import { XMark } from "@/components/brand/XMark";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Shelf Life Wisdom" },
      { name: "description", content: "Why Shelf Life Wisdom exists, and who it's for." },
      { property: "og:title", content: "About — Shelf Life Wisdom" },
      { property: "og:description", content: "An editorial platform for inventory operators. By ExpiryDesk." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 pt-32 pb-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal">About</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
        Where the real operators read.
      </h1>
      <div className="mt-10 space-y-6 text-[18px] leading-[1.9] text-foreground/90">
        <p>
          Shelf Life Wisdom is an editorial platform for the people who actually work the floor.
          Floor managers. Receiving leads. Inventory directors. Buyers who know that the
          spreadsheet stopped telling the truth around lunchtime.
        </p>
        <p>
          We don't write for executives. We write for operators. The difference shows up in every
          paragraph: less theory, more discipline. Less narrative, more numbers. Less brand,
          more bench depth.
        </p>
        <blockquote
          className="my-10 -mx-2 rounded-r-md py-2 pl-6 pr-2"
          style={{
            borderLeft: "3px solid var(--color-teal)",
            backgroundColor: "color-mix(in oklab, var(--color-teal) 5%, transparent)",
          }}
        >
          <p className="font-serif text-2xl italic md:text-[28px]">
            Know your shelf. The rest follows.
          </p>
        </blockquote>
        <p>
          Every article is verified at publication and reviewed again every six months. When
          numbers change, we say so. When something we wrote is no longer true, we mark it stale
          and rewrite it. This isn't a content marketing site. It's a working reference.
        </p>
        <h2 className="mt-12 flex items-baseline gap-2 font-serif text-3xl">
          <span className="text-teal">·</span> Published by ExpiryDesk
        </h2>
        <p>
          Shelf Life Wisdom is a quiet project from{" "}
          <a href="https://expirydesk.com" className="text-teal hover:underline">ExpiryDesk</a> —
          the inventory tracking platform that prevents expired stock before it costs you. We
          built the tool because we kept reading bad inventory advice. We built this publication
          because we wanted somewhere good to point people.
        </p>
      </div>

      <div className="mt-16 flex items-center justify-center gap-4 text-teal/30">
        <span className="h-px w-16 bg-border" />
        <XMark size={14} />
        <span className="h-px w-16 bg-border" />
      </div>
    </div>
  );
}
