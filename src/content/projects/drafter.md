---
title: Drafter
seoTitle: Drafter, a small parametric modeller for the browser
abstract: A small browser-based modeller for drawing things I want to build.
imageFilename: drafter.svg
imageAlt: Drafter's pixel D icon on a purple background.
isPublished: true
publishedOn: 2026-09-13
sourceUrl: https://github.com/johnhooks/drafter
sourceLabel: johnhooks/drafter
---

Drafter is a small parametric modeller that runs in the browser. I started it to design
some cabinets after moving, but the tools work in terms of sketches, faces, and solids.

The geometry is deliberately limited: horizontal and vertical lines, right angles, and
lengths stored as whole sixteenths of an inch. Sketch a shape, extrude it, then draw on a
face of what you've built. Named measurements and expressions let dimensions depend on
each other. Change a material thickness once and the parts using it update together.

Ableton was the reference for the UI: flat panels, compact controls, and a layout that
stays consistent as you work. Colour marks selection and active tools. Labels appear when
you need them, rather than covering the drawing by default. I built a small component
library on React Aria, with shared colour tokens and Storybook to work on the controls in
isolation.

Documents stay in the browser and can be saved as JSON files. Drawing sheets turn the
model into scaled pages with dimensions and notes, something I can hand to the person
building it.

I used [OpenSpec](https://github.com/Fission-AI/OpenSpec) to work through the behaviour
before implementing it with agents.

[Try Drafter](https://drafter.johnhooks.io), or read
[how the cabinet project started](/posts/i-needed-some-cabinets).
