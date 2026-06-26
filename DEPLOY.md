# Deploy solupair.co.za from GitHub (no Lovable)

**Canonical code:** edit in the `marineflow` monorepo (`landing-page-solupair-check/`) or this repo — keep them in sync.

Every push to `main` builds and deploys via GitHub Actions to **Cloudflare Workers**.

## One-time setup

### 1. Cloudflare API token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. **My Profile → API Tokens → Create Token**.
3. Use the **Edit Cloudflare Workers** template (or custom token with Workers Scripts + Account read).
4. Copy the token.

### 2. Cloudflare account ID

Dashboard → any zone or **Workers & Pages** → right sidebar **Account ID**.

### 3. GitHub repository secrets

Repo: **`HMalepe/landing-page-solupair`** (this repo) **or** `HMalepe/marineflow` if using the monorepo workflow → **Settings → Secrets and variables → Actions → Repository secrets**

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from step 2 |

Use **Repository secrets**, not Environment secrets.

### 4. First deploy

Push to `main` (or **Actions → Deploy to Cloudflare → Run workflow**).

Check **Actions** tab for a green run.

### 5. Custom domain (solupair.co.za)

**Remove from Lovable first** (Lovable → Project → Domains → remove `solupair.co.za`).

Then in Cloudflare:

1. **Workers & Pages** → your worker → **Settings → Domains & Routes**.
2. **Add Custom Domain** → `solupair.co.za` (and `www` if needed).

### 6. Optional — stop using Lovable

- Disconnect GitHub in Lovable project settings.
- Keep editing in Cursor → push to `main` (here) or `master` on `marineflow`.

## Local commands

```bash
npm ci
npm run dev
npm run build
npm run deploy
```

## Monorepo mirror

The same site lives at `HMalepe/marineflow` → `landing-page-solupair-check/`. After editing there, sync to this repo or rely on the monorepo deploy workflow.
