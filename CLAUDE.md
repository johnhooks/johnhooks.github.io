# johnhooks.io

Personal website built with SvelteKit 2 + Svelte 5, deployed to Cloudflare Workers.

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Styling**: Tailwind CSS
- **Content**: mdsvex (Markdown with Svelte components)
- **Syntax Highlighting**: @bitmachina/highlighter + Shiki
- **Deployment**: Cloudflare Workers (via wrangler)
- **Package Manager**: pnpm

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── data/           # Post and project loaders
│   └── constants.ts    # SITE_URL constant
├── posts/              # Markdown blog posts
├── projects/           # Markdown project pages
└── routes/             # SvelteKit routes
    └── robots.txt/     # Dynamic robots.txt (SSR)

static/                 # Static assets (images, favicon)
docs/plans/             # Implementation plans for future work
```

## Environment Configuration

### Build-time
- `SITE_URL` - Set via environment variable, exposed through `vite.config.ts` (`envPrefix: ["VITE_", "SITE_"]`)
- Falls back to `http://localhost:5173` in development

### Runtime (Cloudflare Workers)
- `ENVIRONMENT` - "production" or "staging"
- `SITE_URL` - Site URL for the environment

Defined in `wrangler.jsonc` under `env.production` and `env.staging`.

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm deploy           # Build and deploy to production
pnpm deploy:staging   # Build and deploy to staging
pnpm lint             # Run prettier + eslint
pnpm check            # Run svelte-check (TypeScript)
```

## Deployment

### Local Deploy
```bash
SITE_URL=https://johnhooks.io pnpm deploy
SITE_URL=https://website-staging.johnhooks.workers.dev pnpm deploy:staging
```

### CI Deploy
GitHub Actions workflows in `.github/workflows/`:
- `deploy-production.yml` - Manual trigger, deploys to production
- `deploy-staging.yml` - Manual trigger, deploys to staging
- `wrangler-deploy.yml` - Reusable workflow with shared deploy logic

Required GitHub secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## URLs

- **Production**: https://johnhooks.io (also www.johnhooks.io)
- **Staging**: https://website-staging.johnhooks.workers.dev
- **Workers.dev**: https://website.johnhooks.workers.dev

## Prerendering vs SSR

Most pages are prerendered at build time (`prerender = true` in layout).

Dynamic routes (SSR):
- `/robots.txt` - Returns different content based on `ENVIRONMENT`

## Future Work

- See `docs/plans/sitemap.md` for sitemap implementation plan
