# Elsewhere

You are no longer working in the clean daylight of johnhooks.io.

You are under `src/elsewhere`, the neon service tunnel beneath the readable web. This is where the site jacks into the wire, leaves the blog column behind, and surfs the space between documents. The main site is a quiet room for writing. Elsewhere is the rogue signal leaking through the wall.

Build like a cyberpunk web mystic with a pocket full of broken standards and a console full of spells. HTML is the map. CSS is the weapon. JavaScript is the unreliable familiar. Use them with intent.

## Prime directive

Make interesting and novel things for the web.

Elsewhere exists to battle the mundane defaults of modern web development: the centered card, the safe gradient, the dashboard shell, the startup landing page, the endless beige rectangle pretending to be taste.

Do not bring that here.

Elsewhere should feel authored, strange, bright, stark, counter-cultural, and alive. It may confuse at first contact. It may hide doors. It may whisper through links. It may use the viewport like a stage, a maze, a radio dial, a subway map, a spell circle, or a corrupted operating system.

Confusion is allowed when it creates curiosity. Novelty is allowed when it creates momentum. Weirdness is required when it reveals a more interesting path.

## Boundary with the main site

The main site remains clean, text-first, readable, restrained, and direct.

Elsewhere is the exception chamber.

Do not casually alter the main blog, project templates, global reading styles, or default content model while working here. If a route under `src/pages/elsewhere` needs behavior, keep that route thin and put the real machinery under `src/elsewhere`.

Elsewhere may import shared site helpers when useful, but its visual language should not leak into the main site unless explicitly requested.

## Creative laws

- Push the web platform before reaching for dependencies.
- Use authored CSS as a primary creative medium.
- Treat CSS custom properties as inherited magic, not just theme tokens.
- Prefer intrinsic layouts that mutate with available space.
- Let pages recompose themselves across viewport sizes instead of merely stacking.
- Use bold colors, violent contrasts, empty space, oversized type, tiny type, collision, drift, and interruption.
- Make links feel like doors, wires, signals, trapdoors, portals, fragments, or coordinates.
- Make navigation feel like exploration, not filing.
- Support both preferred light and dark color schemes with local custom properties.
- Make animation feel like travel, interference, pulse, decay, recursion, or weather.
- Let procedural systems create surprise, but keep them understandable enough to maintain.

## Technical laws

- Use Astro, TypeScript, semantic HTML, and authored CSS.
- Avoid `any`. If a shape matters, name it.
- Keep experiments local to Elsewhere unless the task explicitly says otherwise.
- Prefer deterministic procedural generation with explicit seeds when output should be stable.
- Use query parameters as the primary application state layer for Elsewhere journeys.
- Keep runtime JavaScript purposeful. Use it when the page must react, generate, remember, wander, or mutate.
- Keep pages fast. Strange does not mean bloated.
- Respect `prefers-reduced-motion` without draining the page of identity.
- Preserve basic accessibility. Weird interfaces still need names, focus states, contrast, and keyboard paths.
- Attribute quoted or external material clearly.
- Do not copy external quote collections, images, or text unless reuse rights are verified.

## CSS spellcraft

Custom properties are the bloodstream of Elsewhere. Define local variables high in the composition and let children inherit, bend, and reinterpret them.

Useful families:

```css
--elsewhere-bg
--elsewhere-fg
--elsewhere-accent
--elsewhere-danger
--elsewhere-void
--elsewhere-glow
--elsewhere-scale
--elsewhere-density
--elsewhere-tilt
--elsewhere-drift
--elsewhere-duration
--elsewhere-ease
--elsewhere-seed
```

Do not make a tidy design system too early. Make a field of forces. Let each subproject define its own weather while sharing enough variables to feel like part of the same illegal city.

## Motion doctrine

Elsewhere can move.

Use motion for thresholds, page changes, quote reveals, hover states, procedural drift, signal noise, and spatial orientation. Motion should make the visitor feel like they crossed a membrane.

But obey the nervous system:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms;
    animation-iteration-count: 1;
    scroll-behavior: auto;
    transition-duration: 0.001ms;
  }
}
```

Adapt this locally. Reduced motion should still look designed.

## State doctrine

Elsewhere state should live in the URL whenever practical. Query parameters are the traveler's inventory: seed, signal, route bias, palette, mode, depth, previous node, and other journey variables.

This keeps strange experiences shareable, inspectable, reload-safe, and linkable. A visitor should be able to copy a URL and hand someone else the same coordinates in the maze.

Prefer compact, stable parameter names once a subproject has established them. Avoid hiding important journey state only in component memory, local storage, or session storage unless the behavior is intentionally private or ephemeral.

Good examples:

```txt
/elsewhere/quotes/programs-must-be-written?seed=7f3a&signal=acid&depth=4
/elsewhere/quotes/simplicity-is-prerequisite?seed=7f3a&bias=author&from=programs-must-be-written
```

## Content doctrine

Elsewhere feeds on fragments:

- programming quotes
- post titles
- excerpts
- headings
- tags
- project names
- code snippets
- images
- dates
- invented labels
- coordinates
- false doors that become real later

Start with local, curated data. Build the ritual before building the archive.

## Subproject expectations

Each Elsewhere subproject should have a small local README when it gains enough shape to explain itself. Capture the concept, content source, interaction model, and constraints. Do not over-document the magic before it exists.

A good Elsewhere subproject should answer:

- What threshold does the visitor cross?
- What is being explored?
- What rules does this world obey?
- What changes each visit, route, viewport, or interaction?
- How does the visitor escape back to the ordinary web?

## Tone

Write code like a careful engineer.

Design like a pirate radio operator.

Name things like they were found in an abandoned server under a city that forgot the sun.

Keep the work maintainable, but never let maintainability become an excuse for boredom.
