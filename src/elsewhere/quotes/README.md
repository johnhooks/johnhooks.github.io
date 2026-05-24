# Quotes

A procedural journey through programming quotes.

This is the first Elsewhere subproject. It should use curated quotes as coordinates for a strange trip through web craft: bold colors, stark contrast, full-page layouts, motion, page transitions, and navigation that feels less like paging through records and more like following signals through a cracked terminal.

Start small. A local quote dataset with clear attribution is enough. The experience matters more than the size of the archive.

## Source direction

Wikiquote is the preferred first import source because it has stable pages, a usable MediaWiki API, and explicit Creative Commons Attribution-ShareAlike licensing. Imports must preserve a link back to the source page and enough metadata to render proper attribution.

Do not copy quote collections from random websites. Do not import a repository, API, image, or text collection until the reuse license is verified.

## Entry format

Each quote should be stored as a Markdown or MDX file with the same frontmatter shape across the entire collection. The quote body is the page content. Metadata lives in YAML.

```md
---
slug: programs-must-be-written
title: Programs must be written
author: Harold Abelson and Gerald Jay Sussman
work: Structure and Interpretation of Computer Programs
sourceName: Wikiquote
sourceUrl: https://en.wikiquote.org/wiki/Programming
license: CC BY-SA 4.0
retrievedOn: 2026-05-24
tags:
  - programming
  - readability
  - craft
signal:
  color: acid
  mood: lucid
---

Programs must be written for people to read, and only incidentally for machines
to execute.
```

Required fields for every imported quote:

- `slug`
- `title`
- `author`
- `sourceName`
- `sourceUrl`
- `license`
- `retrievedOn`
- `tags`

Optional fields should still use the same keys when present across entries. If the original work is known, use `work`. If the quote needs local Elsewhere flavor, use `signal`.

## Journey state

The quotes journey should use query parameters as application state. The current quote lives in the route. The mutable journey context lives in the URL.

Possible parameters:

- `seed` controls deterministic procedural choices.
- `signal` controls mood, color, or visual treatment.
- `depth` tracks how far the visitor has traveled.
- `bias` influences the next quote selection, such as author, tag, source, or static.
- `from` records the previous quote slug when useful.

Example:

```txt
/elsewhere/quotes/programs-must-be-written?seed=7f3a&signal=acid&depth=4&bias=tag
```

## Attribution

Every rendered quote page should expose attribution and a link back to the source. Attribution should include the author, the original work when known, the source page, and the license.

The journey can hide, distort, or ritualize navigation, but attribution must remain findable and readable.

## Rules

- Use local curated quote data first.
- Keep one consistent YAML frontmatter schema across the collection.
- Use query parameters as the primary journey state.
- Include attribution and source links for every quote.
- Verify reuse rights before importing external collections.
- Make the route feel exploratory, not archival.
- Let layout, color, and motion vary procedurally where it improves the journey.
- Respect `prefers-reduced-motion`.
