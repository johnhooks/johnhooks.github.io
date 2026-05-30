# Errors in Elsewhere

Elsewhere is an experimental part of this site. It uses procedural navigation, compact URL
state, and small generated systems that can have edges.

When Elsewhere reaches one of those edges, the default should be to throw a structured
error and render it as part of the experience. The error page is not a corporate apology
screen. It is a record of where the system failed, what the site knows about the failure,
and why the implementation has that limit.

This site is made by an individual with AI assistance. Bugs and constraints are expected.
The goal is not to hide every flaw behind a generic fallback. The goal is to be honest
about the machinery while keeping the visitor oriented.

## Pattern

Elsewhere code should throw `NoWhereError` for known impossible, dishonest, or
out-of-bounds states.

Use:

- `NoWhereErrorCode` for programmatic matching.
- `detail` for the specific message known at the throw site.
- `data.status` when the route should set an HTTP status.
- native `Error.cause` when wrapping another failure.

Do not encode multiple custom cause arrays unless a real use case appears. A single
`cause` can already form a linked chain of wrapped errors.

## Route handling

Astro does not provide React-style component error boundaries. Elsewhere routes should
catch `NoWhereError` at the route boundary and render `NoWhereErrorPage.astro`.

Unexpected errors should be re-thrown.

```ts
try {
  // Generate Elsewhere state.
} catch (error) {
  if (!isNoWhereError(error)) {
    throw error;
  }

  Astro.response.status = error.status ?? 422;
  elsewhereError = error;
}
```

## Error pages are content

Known Elsewhere errors should have specific presentation content in
`src/content/nowhere-errors`. `NoWhereErrorPage.astro` selects the entry by error code and
renders the Markdown body. The page should explain:

- what happened,
- what limit or flaw was hit,
- what the system knows about the state,
- where the visitor can go next.

The page should link back to `/elsewhere` unless a more specific recovery path is better.

## Current quote wire examples

The quote wire stores journey state in query parameters:

- `seed` identifies deterministic procedural choices.
- `d` stores depth as hexadecimal.
- `b` stores branch choices as a hexadecimal bitfield.

The specific user-facing explanations live in `src/content/nowhere-errors`. Keep the
content entries close to the actual experience, and keep this document focused on the
error-handling pattern.
