# Solupair Studio

Marketing site for **Solupair** — a B2B design studio for product UI, brand systems, landing pages, and internal tools.

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- [TanStack Router](https://tanstack.com/router) (file-based routes in `src/routes/`)
- Tailwind CSS 4 + Radix UI primitives (`src/components/ui/`)
- [Nitro](https://nitro.build/) for Vercel deployment
- Supabase client scaffolding (`src/integrations/supabase/`) for future auth and data

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (port may vary if 5173 is in use).

## Production domain

- **Primary:** [https://solupair.co.za](https://solupair.co.za)
- **Redirect:** `www.solupair.co.za` → apex (configured in `vercel.json`)
- Site constants live in `src/lib/site.ts` (email, canonical URLs, Open Graph)

### DNS (at your .co.za registrar)

If Vercel shows “Invalid configuration”, add:

| Type | Name | Value |
|------|------|--------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

In Vercel → Project → **Settings → Domains**, set **solupair.co.za** as the primary domain.

## Deploy on Vercel

1. Import [github.com/HMalepe/solupair](https://github.com/HMalepe/solupair) in the [Vercel dashboard](https://vercel.com/new).
2. Use the defaults: **Build Command** `npm run build`, **Install Command** `npm install`.
3. Add **solupair.co.za** (and optionally `www`) under Domains.
4. Add environment variables when you wire up Supabase (see `.env.example`).
5. Deploy. Vercel detects TanStack Start via Nitro with no extra adapter.

CLI (after `npx vercel login`):

```bash
npx vercel link
npx vercel --prod
```

## Project structure

```
src/
  routes/           # Pages: /, /about, /work, /services, /process, /contact
  components/
    layout/         # Navbar, Footer
    brand/          # Cursor, Reveal, studio-specific UI
    ui/             # shadcn-style primitives
  integrations/     # Supabase client + auth middleware
supabase/           # Local Supabase config and migrations
```

## Repository

- **GitHub:** https://github.com/HMalepe/solupair
- **Previous name:** `shelf-wisdom-forge` (renamed)
