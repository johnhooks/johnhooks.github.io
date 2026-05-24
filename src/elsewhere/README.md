# Elsewhere

Elsewhere is the experimental layer of johnhooks.io.

The regular site is a clean place to read and write on the internet. Elsewhere is the hidden circuit beneath it: a bright, strange, procedural journey through HTML, CSS, JavaScript, quotes, fragments, images, and whatever else the web can be convinced to become.

This directory owns the implementation for Elsewhere experiences. Route files under `src/pages/elsewhere` should stay thin and import from here.

## Shape

```txt
src/elsewhere/
├── AGENTS.md
├── README.md
├── index/
│   └── README.md
├── quotes/
│   └── README.md
└── shared/
    └── README.md
```

## Direction

Elsewhere should be:

- bold
- stark
- strange
- counter-cultural
- playful
- procedural where useful
- animated with care
- built from web primitives
- isolated from the main blog experience

It should feel like entering a different pressure system. The reader leaves the quiet document and steps into a neon hallway where links behave like doors and layouts mutate with the viewport.

## Color scheme

Elsewhere should support both `prefers-color-scheme: light` and `prefers-color-scheme: dark`. Experiences can stay stark and strange, but they should define foreground, background, muted, and accent colors through local custom properties that respond to the user's preferred color scheme.

## State

Elsewhere should use query parameters as its primary application state. The URL is the coordinate system for the journey: seed, signal, depth, palette, mode, previous node, and route bias can all live in the address bar.

This makes experiments shareable and reload-safe while keeping the machinery visible. If the page changes because of state, prefer putting that state in the URL.

## Boundaries

Elsewhere may be loud. The main site should remain restrained.

Keep core experiments, data, styles, and procedural logic in this directory. Use `src/pages/elsewhere` for Astro route entry points only.

## First subproject

The first planned subproject is `quotes`, a procedural journey through programming quotes. It should establish the Elsewhere design language through curated text, bold color, intrinsic layouts, motion, and non-linear navigation.
