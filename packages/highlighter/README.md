# Highlight code in MDsveX with Shiki

> Use [Shiki](https://shiki.matsu.io/) to highlight code blocks in [MDSvex](https://mdsvex.com/) files.

## 📦 Install

```sh
npm install @bitmachina/highlighter@alpha

# or

yarn add @bitmachina/highlighter@alpha
```

## ⚡️ Quick start

You can use any Shiki theme, but usage with the `css-variables` theme is really flexible.

```js
// mdsvex.config.js
import { createHighlighter } from "@bitmachina/highlighter";
import * as shiki from "shiki";

const shikiHighlighter = await shiki.getHighlighter({ theme: "css-variables" });
const highlighter = createHighlighter(shikiHighlighter);

/** @type {import('mdsvex').MdsvexOptions} */
export default {
  extensions: [".svelte.md", ".md", ".svx"],
  highlight: {
    highlighter,
  },
};
```

```css
/* app.css */
:root {
  --shiki-color-background: #27272a;
  --shiki-color-text: #fff;
  --shiki-token-constant: #6ee7b7;
  --shiki-token-string: #6ee7b7;
  --shiki-token-comment: #71717a;
  --shiki-token-keyword: #7dd3fc;
  --shiki-token-parameter: #f9a8d4;
  --shiki-token-function: #c4b5fd;
  --shiki-token-string-expression: #6ee7b7;
  --shiki-token-punctuation: #e4e4e7;
}
```
