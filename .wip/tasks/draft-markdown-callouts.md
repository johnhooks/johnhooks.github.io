---
status: draft
---

# Render Markdown in info callouts

## Problem

Info callouts are currently written as raw `<doc-info>` HTML blocks inside Markdown posts. Markdown syntax inside raw HTML is not parsed, so inline code like backticks renders literally in the HTML. This makes callout content inconsistent with the surrounding prose and forces authors to use manual HTML for normal Markdown formatting.

## Proposed solution

Authors should be able to write info callouts with normal Markdown content, including inline code, links, emphasis, and other common inline formatting. Existing callout styling and rendered markup should remain visually consistent with the current `<doc-info>` presentation.

The preferred authoring format is MDX for posts that need Markdown-rendered callout contents. Existing plain Markdown posts should continue to work.

## Requirements

- Existing published posts that use `<doc-info>` should continue to render as callouts or be migrated to the new supported Markdown-friendly syntax.
- Inline Markdown inside info callouts must render correctly.
- The solution should preserve the existing callout appearance.
