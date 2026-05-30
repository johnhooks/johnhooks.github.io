# Quotes

A procedural journey through programming quotes.

This is the first Elsewhere subproject. It should use curated quotes as coordinates for a
strange trip through web craft: bold colors, stark contrast, full-page layouts, motion,
page transitions, and navigation that feels less like paging through records and more like
following signals through a cracked terminal.

Start small. A local quote dataset with clear attribution is enough. The experience
matters more than the size of the archive.

## Source direction

Wikiquote is the preferred first import source because it has stable pages, a usable
MediaWiki API, and explicit Creative Commons Attribution-ShareAlike licensing. Imports
must preserve a link back to the source page and enough metadata to render proper
attribution.

Do not copy quote collections from random websites. Do not import a repository, API,
image, or text collection until the reuse license is verified.

## Entry format

Each quote should be stored as a Markdown or MDX file with the same frontmatter shape
across the entire collection. The quote body is the page content. Metadata lives in YAML.

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

Programs must be written for people to read, and only incidentally for machines to
execute.
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

Optional fields should still use the same keys when present across entries. If the
original work is known, use `work`. If the quote needs local Elsewhere flavor, use
`signal`.

## Journey state

The quote wire is a procedural binary tree over the local quote collection. A quote can
appear in many possible branches across the generated tree, but a single journey path
should not repeat a quote. Every branch should be able to walk through every quote and
eventually reach an end state.

The current quote lives in the route. The mutable journey context lives in query
parameters:

- `seed` controls the deterministic root quote and procedural choices.
- `d` stores the journey depth as hexadecimal.
- `b` stores branch choices as one continuous hexadecimal bitfield.

Each branch choice is one bit. Bit index `0` is the first choice after the root, bit index
`1` is the second choice, and so on. `0` means left/west. `1` means right/east. The `b`
value is parsed in 32-bit chunks so the path can grow beyond JavaScript's safe integer
range without needing separators in the URL.

Example:

```txt
/elsewhere/quotes/programs-must-be-written?seed=7f3a&d=4&b=9
```

Direct quote visits without journey parameters are valid standalone entries. The visited
quote becomes the root of a new generated journey.

## Attribution

Every rendered quote page should expose attribution and a link back to the source.
Attribution should include the author, the original work when known, the source page, and
the license.

The journey can hide, distort, or ritualize navigation, but attribution must remain
findable and readable.

## Rules

- Use local curated quote data first.
- Keep one consistent YAML frontmatter schema across the collection.
- Use query parameters as the primary journey state.
- Include attribution and source links for every quote.
- Verify reuse rights before importing external collections.
- Make the route feel exploratory, not archival.
- Let layout, color, and motion vary procedurally where it improves the journey.
- Respect `prefers-reduced-motion`.
