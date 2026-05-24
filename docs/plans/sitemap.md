# Sitemap Generation Plan

## Overview

Generate a `sitemap.xml` at build time using a prerendered Astro endpoint that reuses the existing Astro content helpers.

## Approach

Create `src/pages/sitemap.xml.ts` with `prerender = true` to generate a static sitemap at build time.

## Implementation

### 1. Create the endpoint

```ts
// src/pages/sitemap.xml.ts
import { getPosts, getProjects } from "../lib/astro/content";
import { SITE_URL } from "../lib/astro/site";

export const prerender = true;

export function GET() {
  const staticPages = ["", "/about"];
  const postUrls = getPosts().map((post) => `/posts/${post.slug}`);
  const projectUrls = getProjects().map(
    (project) => `/projects/${project.slug}`,
  );
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
}
```

### 2. Optional enhancements

- Add `<lastmod>` using post/project `updatedOn` or `publishedOn` dates.
- Add `<changefreq>` and `<priority>` hints.
- Add `<image:image>` entries for social card URLs.

## Considerations

- **SITE_URL at build time**: The sitemap uses `SITE_URL` from Astro env, matching canonical URLs and social cards.
- **Prerendering**: Since `prerender = true`, the sitemap is generated once at build time, not on every request.
- **No additional dependencies**: Reuses existing `getPosts()` and `getProjects()` helpers.

## Verification

After implementation:

1. Run `pnpm build` and check `dist/client/sitemap.xml` exists.
2. Validate XML structure at https://www.xml-sitemaps.com/validate-xml-sitemap.html.
3. Submit to Google Search Console when ready.
