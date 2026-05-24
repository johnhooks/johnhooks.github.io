# Design Direction

This site should feel like freerange HTML with light CSS: a small, personal document on the web, not an app shell or a component showcase.

The reference point is early independent blogs and hand-built personal sites, but the goal is not to look old. The site should be plain, direct, and modern in execution.

## Goals

- Keep the layout narrow, readable, and single-column.
- Make text and links the primary interface.
- Use plain-looking styles: simple spacing, visible links, minimal borders.
- Avoid decorative UI patterns that feel like a product dashboard.
- Add interest through restraint: subtle motion, careful typography, and targeted color.

## Non-goals

- No nostalgia cosplay.
- No fake retro widgets, textures, badges, or pixel effects.
- No cards by default.
- No drop shadows.
- No rounded corners unless an image or asset specifically needs them.
- No broad use of vibrant color.

## Color

Colors should be defined through CSS custom properties in `src/app.css`.

The palette should use:

- off-white and off-black instead of pure white or black
- muted neutral text for secondary information
- quiet rules for separation
- one vibrant-but-subtle accent color for links, focus, and selected callouts

The accent color should be easy to change. Templates should use semantic classes while site identity lives in custom properties such as:

```css
--color-bg
--color-surface
--color-text
--color-muted
--color-rule
--color-link
--color-link-soft
--color-focus
--color-callout
```

Use authored CSS for structure, spacing, and identity. Core templates should stay semantic so the theme remains visible in one place.

## Layout

The default layout is a single text column using the shared measure and gutters:

```css
--measure
--gutter
```

Avoid filling the full viewport just because space exists. The site should feel like a document with a comfortable reading measure.

## Components

Components should stay small and obvious. Prefer simple markup over reusable abstractions until duplication causes real maintenance friction.

Good component behavior:

- navigation is plain text links
- footer is plain text links plus copyright
- article headers match homepage header rhythm
- callouts are quiet asides, not cards
- code blocks are square, flat, and readable

## Motion and view transitions

Motion should provide polish without making the site feel like an app.

Use subtle view transitions only:

- short content fade between pages
- tiny vertical movement if it improves continuity
- possible image crossfade for matching hero image placement
- active navigation underline transitions if they remain understated

Avoid:

- large slides
- blur effects
- long durations
- staggered list animations
- shared-element tricks that call attention to themselves

All motion must respect `prefers-reduced-motion`.

## Rule of thumb

If a style makes the site feel more like a UI kit, remove it. If it makes the page feel more readable, personal, or quietly intentional, keep it.
