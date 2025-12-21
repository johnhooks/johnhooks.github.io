# Sitemap Generation Plan

## Overview

Generate a `sitemap.xml` at build time using a prerendered SvelteKit endpoint that reuses existing data loaders.

## Approach

Create `src/routes/sitemap.xml/+server.ts` with `prerender = true` to generate a static sitemap at build time.

## Implementation

### 1. Create the endpoint

```ts
// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from "./$types";
import { SITE_URL } from "$lib/constants";
import { loadPosts } from "$lib/data/posts";
import { loadProjects } from "$lib/data/projects";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const posts = await loadPosts();
  const projects = await loadProjects();

  const staticPages = ["", "/about"];

  const postUrls = posts
    .filter((post) => post.isPublished)
    .map((post) => `/posts/${post.slug}`);

  const projectUrls = projects
    .filter((project) => project.isPublished)
    .map((project) => `/projects/${project.slug}`);

  const allUrls = [...staticPages, ...postUrls, ...projectUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
```

### 2. Optional enhancements

- Add `<lastmod>` using post/project `updatedOn` or `publishedOn` dates
- Add `<changefreq>` and `<priority>` hints
- Add `<image:image>` entries for og:image URLs

## Considerations

- **SITE_URL at build time**: The sitemap uses `SITE_URL` from constants, which is set via env var at build time. This matches the canonical URLs in page meta tags.
- **Prerendering**: Since `prerender = true`, the sitemap is generated once at build time, not on every request.
- **No additional dependencies**: Reuses existing `loadPosts()` and `loadProjects()` functions.

## Verification

After implementation:

1. Run `pnpm build` and check `.svelte-kit/cloudflare/sitemap.xml` exists
2. Validate XML structure at https://www.xml-sitemaps.com/validate-xml-sitemap.html
3. Submit to Google Search Console when ready
