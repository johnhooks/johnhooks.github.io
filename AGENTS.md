# johnhooks.io

Personal website built with Astro, deployed to Cloudflare Workers.

## Conversational Style

- Keep answers short and concise.
- No fluff or cheerful filler.
- Technical prose only, be kind but direct.
- No emojis in commits, issues, PR comments, or code.
- Prefer clear recommendations over long option lists.

## Code Quality

- Read files before making broad changes.
- Match existing style unless the task is intentionally changing the stack or conventions.
- Use specific TypeScript types; avoid `any` unless there is no practical alternative.
- Check installed package types/docs instead of guessing external APIs.
- Do not remove intentional functionality without calling it out.
- Do not commit unless explicitly asked.

## Tech Stack

- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Content**: Markdown pages rendered by Astro
- **Syntax Highlighting**: Astro's Shiki integration with `@shikijs/transformers`
- **Deployment**: Cloudflare Workers via Wrangler
- **Package Manager**: pnpm

## Project Structure

```txt
src/
├── components/         # Astro components
├── layouts/            # Shared page layouts
├── lib/astro/          # Astro-specific content and site helpers
├── pages/              # Astro routes, including dynamic post/project routes
├── posts/              # Markdown blog posts
└── projects/           # Markdown project pages

static/                 # Static assets: images, favicon
docs/plans/             # Implementation plans for future work
```

## Environment Configuration

### Build-time

- `SITE_URL` - Site origin used for canonical URLs and social cards.
- Falls back to `http://localhost:4321` in development.

### Runtime: Cloudflare Workers

- `ENVIRONMENT` - `production` or `staging`.
- `SITE_URL` - Site URL for the deployed environment.

Runtime values are defined in `wrangler.jsonc` under `env.production` and `env.staging`.

## Commands

```bash
pnpm dev              # Start Astro dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm deploy           # Build and deploy to production
pnpm deploy:staging   # Build and deploy to staging
pnpm lint             # Run Prettier check + ESLint
pnpm check            # Run astro check
pnpm format           # Format with Prettier
```

After code changes, run:

```bash
pnpm lint
pnpm check
pnpm build
```

Documentation-only changes do not require the full build unless they affect rendered content or examples.

## Deployment

### Local Deploy

```bash
SITE_URL=https://johnhooks.io pnpm deploy
SITE_URL=https://website-staging.johnhooks.workers.dev pnpm deploy:staging
```

### CI Deploy

GitHub Actions workflows in `.github/workflows/`:

- `deploy-production.yml` - Manual production deploy.
- `deploy-staging.yml` - Manual staging deploy.
- `wrangler-deploy.yml` - Shared deploy workflow.

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## URLs

- **Production**: https://johnhooks.io and https://www.johnhooks.io
- **Staging**: https://website-staging.johnhooks.workers.dev
- **Workers.dev**: https://website.johnhooks.workers.dev

## Rendering Model

Most pages are prerendered at build time with:

```ts
export const prerender = true;
```

Dynamic routes:

- `/robots.txt` - Returns different content based on `ENVIRONMENT`.

## Content Notes

- Posts live in `src/posts/*.md`.
- Projects live in `src/projects/*.md`.
- Published entries require `isPublished: true` in frontmatter.
- Homepage ordering is by `publishedOn`, newest first.
- Some older Markdown files contain former MDSveX component tags such as `DocInfo`; keep compatibility or migrate the content deliberately.

## Future Work

- See `docs/plans/sitemap.md` for sitemap implementation notes.
