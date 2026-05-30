---
code: nowhere.quote.bits_invalid
title: branch broken
description: The quote wire received branch state it cannot parse.
---

The quote wire received branch choices outside the shape of the system.

Branches are stored as a compact hexadecimal bitfield in the URL. When that value is
malformed, the site cannot honestly replay the path.

Elsewhere stops here instead of quietly pretending the wire only ever turned west.
