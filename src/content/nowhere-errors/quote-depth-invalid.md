---
code: nowhere.quote.depth_invalid
title: depth broken
description: The quote wire received a depth value it cannot parse.
---

The quote wire received a depth value outside the shape of the system.

Depth is stored as a compact hexadecimal number in the URL. When that value is too large
or malformed to compare honestly, Elsewhere treats it as a broken path instead of quietly
guessing.

The flaw is part of the machinery: compact state is useful, but it has edges.
