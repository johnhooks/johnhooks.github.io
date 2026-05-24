# Image handling

Images are split by how they are used, not by file type.

## Page images

Images rendered in pages should live in `src/assets/images` and be rendered
through Astro's image pipeline. These are part of the site UI or article content:
header thumbnails, drawings inside posts, and photos embedded in writing.

This lets Astro know the source image dimensions, reduce layout shift, and emit
optimized static assets during the build. On Cloudflare Workers, those generated
assets are served as static files from the asset binding; the Worker should not
need to resize normal site images at request time.

## Public URL images

Images that need stable public URLs should stay in `static/images`. These are
referenced directly by URL and should not be fingerprinted or moved by the build:
Open Graph cards, Twitter card images, favicons, and any long-lived external
image URL.

## Repository storage

Images are committed to the repository while the site remains small and personal.
This is appropriate for occasional drawings, avatars, project images, and post
illustrations. If images become numerous, large, user-generated, or frequently
replaced, move that class of media to dedicated object storage or an image
service.

Do not commit originals or editing files unless they are intentionally part of
the source. Export web-ready images before adding them.

## Sizing guide

Use a small set of repeatable image shapes so posts feel consistent.

### Header thumbnails

Use square `512 x 512` images for small post and project header thumbnails. This
is the existing pattern and works well for drawings, icons, avatars, and project
marks.

### In-post landscape images

Prefer landscape images when the image supports the surrounding prose.

- Social landscape: `1200 x 630` (`1.91:1`)
- Video/screenshot landscape: `1280 x 720` (`16:9`)
- Golden landscape: `1200 x 742` (`1.618:1`)

Use `1200 x 630` when the image may also become a social card. Use `1280 x 720`
for screenshots or video-like compositions. Use the golden ratio when the image
is more illustrative and does not need to match a platform crop.

### In-post portrait images

Use portrait images sparingly and keep them visually intentional.

- Social portrait: `1080 x 1350` (`4:5`)
- Story portrait: `1080 x 1920` (`9:16`)
- Golden portrait: `742 x 1200` (`1:1.618`)

Use `1080 x 1350` for photos that should feel social-media native. Avoid
`1080 x 1920` unless the tall crop is important; it can dominate a text page.

### Square variants

Square images are useful for drawings, diagrams, avatars, and reusable crops.

- Small square/header thumbnail: `512 x 512`
- Standard square: `1080 x 1080`
- Large square/source export: `1200 x 1200`

For hand drawings, export a square version when the composition allows it. It can
be reused as a thumbnail, social preview, or inline image without awkward crops.

## Practical defaults

For most new post images:

- Hand drawing thumbnail: `512 x 512`
- Inline hand drawing: `1080 x 1080` or `1200 x 742`
- Inline photo landscape: `1200 x 630` or `1280 x 720`
- Inline photo portrait: `1080 x 1350`
- Social card candidate: `1200 x 630`
