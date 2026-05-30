---
status: draft
---

# Add a quote journey trail

## Problem

The Elsewhere quote wire now creates a procedural path through quotes, but the page does
not remember the choices that shaped the route. Each step changes the quote, links, and
layout, but the visitor has no visible artifact of the path they made.

This misses an opportunity to make the journey feel more personal and game-like while
preserving the current URL-driven model.

## Proposed solution

Add a lightweight trail to the quote journey that records the words a visitor chooses
while moving through the quote wire. The trail should be carried in the URL so the same
link preserves the same path and can be shared.

The trail should render as a quiet collection of chosen words on quote pages. It should
feel like a trace, inventory, or small poem made by the visitor's route, not like a
dashboard or progress tracker.

The existing quote journey should remain simple. The quote stays primary, the continuation
links stay minimal, and the trail should not compete with the reading experience.

## Requirements

- Trail state must live in query parameters rather than local storage or server state.
- Following a continuation link should append the chosen word to the trail.
- Sharing or reloading the URL should preserve the same trail.
- The rendered trail should remain visually subtle and fit the Elsewhere quote wire style.
- The trail should have a practical length limit so URLs do not grow without bound.
- The experience should continue to work without JavaScript.
