import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/brand/Cursor";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-wider text-teal">404 · Off Shelf</p>
        <h1 className="mt-4 font-serif text-6xl">Out of stock.</h1>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for has expired — or never made it to the floor.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-teal px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-teal btn-fill"
        >
          Back to the floor
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shelf Life Wisdom — Know your shelf." },
      {
        name: "description",
        content:
          "Editorial-grade inventory wisdom for operators, floor managers, and inventory professionals. Published by ExpiryDesk.",
      },
      { name: "author", content: "Shelf Life Wisdom" },
      { name: "theme-color", content: "#0A0A0A" },
      { property: "og:title", content: "Shelf Life Wisdom — Know your shelf." },
      {
        property: "og:description",
        content:
          "Editorial-grade inventory wisdom for the people who actually work the floor. By ExpiryDesk.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Shelf Life Wisdom" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shelf Life Wisdom — Know your shelf." },
      { name: "description", content: "Shelf Life Wisdom Hub is a premium editorial platform for inventory professionals." },
      { property: "og:description", content: "Shelf Life Wisdom Hub is a premium editorial platform for inventory professionals." },
      { name: "twitter:description", content: "Shelf Life Wisdom Hub is a premium editorial platform for inventory professionals." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e22cdd90-3c58-4a7a-871d-f4f565105864/id-preview-4bb93685--08690d1f-965c-4c6b-8023-8849e6e87516.lovable.app-1777146004916.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e22cdd90-3c58-4a7a-871d-f4f565105864/id-preview-4bb93685--08690d1f-965c-4c6b-8023-8849e6e87516.lovable.app-1777146004916.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
