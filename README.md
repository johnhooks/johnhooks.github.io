# johnhooks.io

[johnhooks.io](https://johnhooks.io)

Personal website built with [SvelteKit](https://kit.svelte.dev) and deployed to Cloudflare Workers.

## Developing

```bash
pnpm install
pnpm dev
```

## Building

```bash
pnpm build
pnpm preview
```

## Deployment

```bash
pnpm deploy
```

Or test locally with wrangler:

```bash
pnpm build
wrangler dev .svelte-kit/cloudflare
```
