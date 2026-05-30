---
status: draft
---

# Create an Elsewhere programming quotes journey

## Problem

The site currently has a clean, text-first blog experience, but it does not yet have a
dedicated place for more experimental web design. The desired Elsewhere direction needs a
first concrete project that can establish the visual language without changing the main
blog experience.

A procedural programming quotes journey is a good starting point because it can be small,
self-contained, and expressive. It can use curated text fragments to explore bold styling,
odd layouts, animation, page transitions, and non-linear navigation while keeping the
normal writing experience intact.

## Proposed solution

Create the first Elsewhere experience as a procedural journey through programming quotes.
The experience should live behind an intentional Elsewhere entry point and present curated
quotes through bold, full-page, CSS-driven layouts.

The journey should feel exploratory rather than archival. Readers should move through
quotes by following strange choices, signals, doors, or fragments instead of using a
normal list. Each step can vary layout, color, scale, motion, or composition to make the
route feel alive. Query parameters should carry the journey state so each route is
shareable, reload-safe, and inspectable.

The quote collection should start as local Markdown or MDX entries with a consistent YAML
frontmatter schema across the entire import. Wikiquote is the preferred first source to
investigate because it has explicit reuse terms and stable source pages. Do not depend on
scraped quote sites unless the source license is verified and compatible with reuse.

## Requirements

- The main blog and default reading templates should remain unchanged.
- The experience should sit under the Elsewhere concept documented in `docs/elsewhere.md`.
- Quote entries should be stored as Markdown or MDX files with the quote text as content.
- Quote frontmatter must use one consistent YAML schema across the entire collection.
- Query parameters must be the primary application state for the journey.
- Quote data must include quote text, author attribution, source name, source URL,
  license, retrieval date, and tags.
- Every rendered quote page must include a readable attribution path and link back to the
  source.
- Any external quote source must have a verified license before content is copied into the
  project.
- Styling should use authored CSS and custom property inheritance as a core design
  mechanism.
- Layouts should be responsive and intrinsically adapt across viewport sizes.
- Motion and page transitions should respect `prefers-reduced-motion`.
- The first version should be small and easy to extend rather than a complete quote
  platform.
