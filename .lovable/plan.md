
# Shelf Life Wisdom — Build Plan

A premium editorial blog by ExpiryDesk. Dark, typographic, spacious. Teal (#00B8B0) as a precision accent, navy (#0F1F3D) for depth. Built for inventory operators.

---

## 1. Foundation & Design System

- **Color tokens** in `src/styles.css` using oklch equivalents of the brief: background `#0A0A0A`, surface `#111111`, border `#1A1F2E`, text `#F0EDE6` / `#8A8A9A` / `#4A4A5A`, accent teal `#00B8B0`, deep navy `#0F1F3D`. Plus `--gradient-teal` (#00B8B0 → #00D4CC) and a faint hero glow color.
- **Fonts** via Google Fonts in `__root.tsx`: Playfair Display (headings), Inter (body), JetBrains Mono (metadata/badges).
- **Type scale** with `clamp()`: hero headline 52–96px, subheads 24–36px, body 18px / 1.8.
- **Reusable primitives**: `XMark` (teal diamond brand glyph), `ShelfCheckBadge` (Floor/Manager/Ops), `FreshnessBadge` (verified / review pending), `CategoryTag`, `TealButton` (left-to-right fill on hover), `CountUp` number, `SectionDivider` (centered XMark).
- **Custom cursor** (desktop only): 8px teal dot + 32px lagging ring; ring fills teal on interactive hover. Disabled on touch.
- **Ambient grain overlay** as a reusable `<Grain />` component (animated SVG noise, 5% opacity).

## 2. Routes & Pages

Separate TanStack route files (each with its own `head()` for SEO):

- `/` — Home
- `/articles` — All posts, category-filterable
- `/articles/$slug` — Single article (the cockpit)
- `/categories` — Topic hubs grid
- `/categories/$slug` — Category landing
- `/about` — Story behind SLW
- `/newsletter` — Dedicated signup

**Shared layout** (in `__root.tsx`): fixed transparent navbar that fills `#0A0A0A` + blur on scroll, mobile fullscreen overlay menu, footer with subtle ExpiryDesk attribution and 1px teal bottom line.

## 3. Home Page

- **Hero (100vh)**: massive stacked headline `SHELF LIFE / WISDOM`, tiny `~by ExpiryDesk` in mono, slogan `Know your shelf.` with "shelf" in teal gradient, breathing radial teal glow, grain overlay, two ghost CTAs with border-fill hover, animated down-arrow.
- **Waste counter ticker**: simulated live `$X lost per minute` counter incrementing in real time, mono teal number, devastating one-liner label.
- **Topic marquee**: infinite horizontal scroll of category labels, pause on hover, individual hover → teal.
- **Featured strip**: full-width `#111111` card, FEATURED label, freshness pill, editorial 2-col layout, SVG clockwise teal border-draw on hover.
- **Categories pill row**: horizontal scrollable pills with emoji + label, active pill teal, smooth fade filter of the grid below.
- **Latest posts grid**: 3-col masonry (2 tablet / 1 mobile). Cards are purely typographic — category, ShelfCheck, freshness, serif title, 2-line excerpt, author row with optional 🔊 audio icon. Hover lifts to navy tint with sliding 3px teal left border + faint teal glow.
- **Load More Wisdom** outline button.
- **Newsletter section**: full-width navy `#0F1F3D`, serif headline "Stay sharp. Zero fluff.", inline email + Join Free, success morph to teal checkmark with "You're in. Know your shelf."
- **Footer**: minimal, with quiet ExpiryDesk easter egg (`Track · Alert · Prevent Waste` in teal mono).

## 4. Single Article Page (the centerpiece)

Every feature from the brief, in one cohesive cockpit:

- **Reading progress bar**: 2px teal line pinned top, % pill at right end.
- **Sticky reading toolbar**: top-right desktop / bottom mobile pill with progress %, mins remaining, audio toggle, reading mode toggle, share.
- **Article header**: category, ShelfCheck badge, freshness badge (auto-amber if >6 months old), serif headline, subhead, author row, share icons, thin teal divider.
- **AI Quick Take box** (navy, teal left border, collapsible): 3 AI-generated bullets via Lovable AI Gateway (Gemini), labeled "AI-generated summary · Shelf Life Wisdom". Collapsed default desktop, expanded mobile.
- **Audio narration toggle**: pill in header → expands minimal dark player with teal scrubber + 1x/1.5x/2x speed (placeholder audio file, dismissible).
- **Article body** (max-width 680px, line-height 1.9):
  - MDX-style structured content rendered via a typed renderer
  - Pull quotes (offset, italic serif 28px, teal left border, faint teal bg)
  - Pro Tip / Quick Fact callouts (navy + teal border + icon)
  - H2 with `·` teal prefix + hash anchor on hover
  - **Hover tooltip system**: defined glossary terms get rich preview cards on hover (200ms fade)
  - **Clippable stat blocks**: dark surface, teal top border, big teal 40px+ number, copy button → flash "Copied!"
  - **Scroll-triggered count-up** on all stat numbers (1200ms ease-out + teal flash)
  - **Inline waste calculator**: weekly stock value × waste % × locations → animated monthly loss with subtle "ExpiryDesk can fix this →" CTA
- **Sticky TOC** (desktop right rail): auto-built from H2/H3, active section in teal with indicator bar, smooth-scroll on click.
- **Sticky social rail** (desktop left): copy link, LinkedIn, X, WhatsApp; teal hover, tooltip; hides 200px before footer.
- **End of article**: 👍/👎 feedback with confirmation, author bio card (navy), freshness verification note, "More Shelf Wisdom →" related posts grid (3), inline newsletter signup.

## 5. AI Chat Widget (per article)

- Fixed bottom-right pill `💬 Ask about this article`.
- Slides up as side drawer (full-width bottom drawer on mobile).
- Suggested teal pill chips for starter questions.
- Scoped to current article — system prompt includes the article body. Responses end with `Based on: [Article Title]`.
- Powered by Lovable AI Gateway (Gemini default, free during promo).
- Conversation kept in component state per-article session.

## 6. Content (seeded, 5–6 articles)

Authored as typed objects (`src/content/articles.ts`) covering categories:
Stock Rotation · Expiry Date Management · FIFO & FEFO · Waste Reduction · Purchasing & Ordering · Retail Ops · Cold Chain & Storage · Zero Waste Business.

Each article includes: slug, title, subtitle, category, ShelfCheck level, lastVerified date, author, readMinutes, hasAudio flag, structured body blocks (paragraph, h2, h3, pullquote, callout, stat, calculator, glossary terms).

## 7. Backend (Lovable Cloud)

Minimal, focused on what's truly persistent:

- `newsletter_subscribers` (email, source page, created_at) with insert-only RLS for anon.
- `article_feedback` (article_slug, vote, created_at) — anonymous 👍/👎.
- Edge function `article-chat` → calls Lovable AI Gateway with article context, streams response.
- Edge function `article-quick-take` → returns 3 cached bullets per slug (cached in DB after first generation to avoid re-billing).

## 8. Animation & Motion

Framer Motion + IntersectionObserver:
- Hero headline: per-word clip-path reveal, 80ms stagger.
- Section entry: opacity 0→1 + translateY 24→0, 600ms ease-out.
- Card hover: -4px translateY + soft teal glow shadow.
- Marquee: 30s linear infinite, pause on hover.
- Featured border-draw: SVG stroke-dashoffset, 300ms.
- Page transitions: 50ms out / 200ms in fade.
- Count-ups + teal completion flash on stats.

## 9. Mobile

Single column. TOC collapses to a teal-chevron dropdown above article. Sticky bottom toolbar (progress + audio + share + reading mode). Social rail hidden (share moves into toolbar). AI chat → full-width bottom drawer. Quick Take expanded by default. Calculator stacks. Custom cursor disabled.

## 10. SEO & Polish

- Per-route `head()` with title, description, og:title/description; article routes derive og:image from a generated dark teal/navy gradient placeholder per slug.
- JSON-LD `Article` schema on article pages.
- `sitemap.xml` server route enumerating articles.
- Reading mode toggle (serif body + larger leading, persisted to localStorage).

---

## Technical Details (for reference)

- **Stack**: TanStack Start, React 19, Tailwind v4 (tokens in `styles.css`), Framer Motion, Lucide icons, Lovable Cloud (Supabase) + Lovable AI Gateway.
- **Routes**: file-based in `src/routes/` (no hash navigation between sections — every section that's a "page" is its own route).
- **Article content**: typed structured blocks rendered by an `<ArticleBody />` component — easy to add more later or swap to DB-backed.
- **No stock images**: all visual fills are CSS gradients in teal/navy.
- **What's simulated vs real**: AI Quick Take + article chat are real (Gemini via AI Gateway). Audio is a placeholder mp3 + working player UI. Waste counter is a deterministic simulated ticker. Newsletter writes to Cloud.

## Out of Scope (can add later)

- Real TTS audio generation per article (ElevenLabs/OpenAI).
- CMS/admin UI for writing articles in-app.
- Real email delivery for the newsletter (Resend).
- Comments / user accounts.
- Search across articles (can add a fast client-side fuse.js pass if you want).
