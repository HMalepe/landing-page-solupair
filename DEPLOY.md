# Deploy Solupair landing page (Cloudflare Workers)

**Live preview:** https://solupair-landing.holiday-malepe.workers.dev  
**Target domain:** `solupair.co.za`

## Cloudflare Git (primary)

Worker **`solupair-landing`** → **Settings → Builds**:

| Setting | Value |
|---------|--------|
| Repository | `HMalepe/landing-page-solupair` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `npm install && npm run cf:build` |
| Deploy command | `npm run cf:deploy` |

GitHub Actions deploy is disabled on push (manual only) so it does not fight Cloudflare Builds.

## Custom domain

1. Add `solupair.co.za` to Cloudflare (nameservers).
2. Worker → **Domains & Routes** → add `solupair.co.za` and `www.solupair.co.za`.
3. Remove domain from Lovable.
