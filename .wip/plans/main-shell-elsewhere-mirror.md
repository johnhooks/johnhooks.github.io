# Implementation Plan: Main Shell Elsewhere Mirror

## Task

Make the main site shell mirror Elsewhere by anchoring navigation in the same top-left
breadcrumb position, and remove page transition animations.

## Approach

Create a shared breadcrumb-like navigation treatment for the main shell rather than
importing the Elsewhere implementation directly. The main site can keep its readable
content column, but the top navigation should become the same kind of small,
fixed-position reality anchor as Elsewhere.

Remove Astro view transitions and title transition behavior from the main layout and
page/article title links. This includes dropping the client router, transition attributes,
controller component usage, and view-transition CSS/keyframes that only exist to support
animated page changes. Keep ordinary CSS link hover/focus affordances.

## Touch points

- `src/layouts/SiteLayout.astro`: remove transition imports/components and keep a static
  shell.
- `src/components/Navigation.astro` and `src/app.css`: restyle primary navigation to
  occupy the same top-left anchor role as Elsewhere breadcrumbs.
- `src/pages/index.astro` and `src/layouts/ArticleLayout.astro`: remove transition
  attributes/classes from titles and links.
- `src/lib/astro/viewTransitions.ts` and `src/components/TitleTransitionController.astro`:
  likely remove if no longer referenced.

## Verification

Manual check the homepage, about page, post page, project page, and Elsewhere route to
ensure navigation remains usable and no transition-only imports remain.
