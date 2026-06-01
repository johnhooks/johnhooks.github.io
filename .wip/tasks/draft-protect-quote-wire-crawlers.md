---
status: draft
---

# Protect the quote wire from crawler loops

## Problem

The Elsewhere quote wire creates procedural journey URLs with query parameters. After
release, ClaudeBot and OpenAI crawlers followed the quote wire deeply enough to burn
through the Cloudflare Workers allotment.

The site should still expose the quote index and clean quote pages for normal discovery,
but crawlers should not be invited into the infinite-looking journey space.

## Proposed solution

Keep the public quote index crawlable while making the procedural journey URLs
crawler-hostile and budget-safe. Clean archive and quote URLs should remain available, but
query-state journey URLs should not be indexed or followed.

Start with a repo-level fix before adding Cloudflare custom rules. Robots directives
should explicitly keep crawlers out of `/elsewhere/quotes/*?*`, with specific handling for
ClaudeBot and OpenAI crawlers where useful. Journey links should signal `nofollow`, and
journey pages should keep canonical URLs pointed at their clean quote path.

Cloudflare-side protection should remain a fallback if robots directives and link hints do
not reduce abusive crawler traffic enough.

## Requirements

- `/elsewhere/quotes`, `/elsewhere/quotes/archive`, and clean `/elsewhere/quotes/{slug}`
  pages should remain accessible.
- Procedural journey URLs with query parameters should be disallowed for crawlers.
- Journey continuation links should use `rel="nofollow"`.
- Journey pages should remain `noindex, nofollow` and canonicalize to the clean quote URL.
- ClaudeBot and OpenAI crawler traffic should be handled explicitly in robots directives.
- Do not add Cloudflare custom rules unless the repo-level crawl controls prove
  insufficient.
- The first fix may rely on crawler politeness, but it should leave a clear escalation
  path for Worker budget protection.
