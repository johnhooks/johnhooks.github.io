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

## Follow-up: third crawler wave (2026-06-11)

Meta-ExternalAgent made 138.76k requests after the robots.txt journey disallow was already
live in production. The `User-agent: *` group covered it, so either Meta ignored the
directives, had stale robots instructions, or hammered clean quote URLs that robots.txt
explicitly allows. The repo-level crawl controls have now proven insufficient, which
triggers the escalation path:

- `meta-externalagent` now has an explicit robots.txt group with the same terms as the
  other AI crawlers: site allowed, journey query URLs disallowed. An explicit group
  removes any ambiguity about whether it honors the `User-agent: *` fallback.
- Structural problem: all `/elsewhere/quotes/*` routes are `prerender = false`, so every
  bot request to even a clean, allowed quote URL is a billable Worker invocation. Static
  asset requests on Workers are free. The durable fix is splitting clean quote pages
  (prerendered) from journey state (separate path prefix or client-side), so polite
  re-crawls cost nothing and the journey space is trivially blockable.
- Cloudflare WAF custom rule (free plan) is the backstop for robots-ignoring bots, e.g.
  block `http.user_agent contains "meta-externalagent"`, or block AI-crawler-category
  verified bots when `http.request.uri.query ne ""`.
- robots.txt advertises `https://johnhooks.io/sitemap.xml`, which currently 404s
  (`docs/plans/sitemap.md` was never implemented). Shipping it gives well-behaved crawlers
  a finite crawl list instead of link-walking.
