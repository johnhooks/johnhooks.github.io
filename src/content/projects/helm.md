---
title: Helm
seoTitle: Helm, a starship operating system built on WordPress
slug: helm
abstract:
  A slow space exploration game, starship interface, and deeply unserious argument that
  WordPress is ready for command duty.
isPublished: true
publishedOn: 2026-05-25
sourceUrl: https://github.com/johnhooks/helm
sourceLabel: johnhooks/helm
---

Helm is a starship operating system built on WordPress.

That is the official position. We are building the next generation of interstellar command
software on PHP, custom tables, Action Scheduler, REST endpoints, and an amount of
LCARS-inspired interface work that suggests we may have confused commitment with judgment.

The game version is slow and asynchronous. Your ship scans, travels, mines, and reports
back over real time. A scan might take hours. A route might take days. You check in
between other things and ask the only question that matters: what did my ship find?

The lore version is that, by 2126, humanity has learned something obvious in hindsight:
subspace behaves like the WordPress hook system. `do_action()` and `apply_filters()` were
not just a plugin API. They were a rough sketch of spacetime. The first warp drive was a
WordPress installation running on a quantum array, and every attempt to rewrite it in
cleaner modern code has gone badly enough that the committee stopped scheduling follow-up
meetings.

So ships are jacks. You jack in through subspace and your ship becomes your body: cameras
for eyes, sensors for ears, an AI crew keeping things alive when you disconnect. Hosting
companies became spacefaring megacorps because of course they did. “Shared hosting” means
fleet infrastructure. “Dedicated hosting” means your own warp core. The universe,
regrettably, is a legacy codebase.

Under the bit, Helm is a real WordPress plugin and a design exercise in using familiar web
machinery sideways. WordPress is the Origin server. Ships are data. Actions are queued
work units. The universe is generated deterministically from seeds so the same coordinates
keep meaning the same thing. State is computed from timestamps instead of a constant game
loop, because a ship should be able to drift through space while the site is asleep.

This is a silly project, but not a joke project. The joke is mostly that the pieces fit
better than they should. Background jobs become warp field processing. REST becomes
ship-to-Origin communication. Capabilities start looking suspiciously like crew clearance.
`wp_options` is not a navigation computer, technically, but it has never personally told
me it is not one.

The goal is a quiet game about patience, discovery, and operating a tiny absurd machine.
Space is huge. Encounters are rare. Components have history. Stations become territory.
Wrecks stay in the universe until someone finds them. The interface should feel like a
calm bridge console waiting for something strange to happen.

If this works, WordPress becomes viable starship infrastructure. If it does not, the
devoted will still have excellent incident reports.
