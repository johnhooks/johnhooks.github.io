---
title: Beautiful MDSveX Code Blocks
seoTitle: Add beautifully highlighted code to a SvelteKit project using MDsveX and the Shiki syntax highlighter
slug: highlighter
abstract: How to configure MDSveX and @bitmachina/highlighter in a SvelteKit project.
isPublished: true
publishedOn: 2023-01-06
---

<script>
  import DocInfo from '../lib/components/doc-info.svelte';
</script>

<div class="flex justify-center gap-4 not-prose">
  <a href="https://www.npmjs.com/package/@bitmachina/highlighter">
    <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/johnhooks/highlighter?style=flat-square">
  </a>
  <a href="https://github.com/johnhooks/highlighter">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/johnhooks/highlighter?style=social">
  </a>
</div>

## 📦 Install

```sh
npm install @bitmachina/highlighter@1.0.0-alpha.6

# or

yarn add @bitmachina/highlighter@1.0.0-alpha.6
```

## ⚡️ Quick start

Use the return value of `createHighlighter` in your `mdsvex.config.js`.

```js {0,6} title="Example using the Shiki CSS Variables theme."
import { createHighlighter } from "@bitmachina/highlighter";

/** @type {import('mdsvex').MdsvexOptions} */
export default {
  extensions: [".svelte.md", ".md", ".svx"],
  highlight: {
    highlighter: await createHighlighter({ theme: "nord" }),
  },
};
```

The [`@bitmachina/highlighter`](https://github.com/johnhooks/highlighter) package exports the `createHighlighter` function which takes an argument of Shiki `HighlighterOptions`, these are passed directly to Shiki `getHighlighter` internally. The highlighting function returned by `createHighlighter` was built for MDSveX and inserts the proper HTML entities to escape characters syntactically important to Svelte.

Any [Shiki theme](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes) can be used.

## Table of Contents

- [Meta strings](#meta-strings)
  - [Titles](#titles)
  - [Line numbers](#line-numbers)
  - [Highlight lines](#highlight-lines)
- [Notes](#notes)
- [References](#references)

## Meta strings

Code blocks are configured via the meta string on the top codeblock fence.

Some features have been added to make this package comparable to [Rehype Pretty Code](https://rehype-pretty-code.netlify.app/).

### Titles

Add a title to your code block, with text inside double quotes (`""`):

````txt title="example source"
```js title="Title directive example"
console.log('Hello, Shiki!");
```
````

```js title="example rendered"
console.log('Hello, Shiki!");
```

This directive will add a `data-code-title` attribute to the `<pre>` element.

The code block titles on this site are created using the following css.

```css showLineNumbers{75} title="apps/website/src/app.css"
pre[data-code-title]:before {
  color: rgb(255 255 255 1);
  background: rgb(39 39 42);
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  line-height: 1.5rem;
  min-height: calc(3rem + 1px);
  content: attr(data-code-title);
  display: block;
  padding-top: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: solid 1px rgb(63 63 70);
}
```

### Line numbers

Line numbers can be conditionally be shown, using the `showLineNumbers` directive. This adds a `data-line-numbers` boolean attribute to the `<code>` element.

The line number is made available in the `data-line-number` attribute on the `<span>` elements containing each line.

````txt title="example source"
```js showLineNumbers
  console.log("Show me the numbers!")
  console.log("Show me more!")
```
````

```js title="example rendered" showLineNumbers
  console.log("Show me the numbers!")
  console.log("Show me more!")
```

```js title="example of generated html"
<code data-line-numbers>
  <span data-line-number="1">...</span>
  <span data-line-number="2">...</span>
</code>
```

A starting line number can be provided as an argument to `showLineNumbers`.

````md title="example source"
```js showLineNumbers{64}
const example="The first line of this code block will start at 64"
```
````

```js showLineNumbers{64} title="example rendered"
const example="The first line of this code block will start at 64"
```

#### CSS Example

Below is an example of adding line numbers to the code block using CSS and the data attributes.

```css
code[data-line-numbers] > span[data-line-number]::before {
  /* Insert the line number data attribute before the line */
  content: attr(data-line-number);

  /* Other styling */
  display: inline-block;
  width: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  text-align: right;
  color: gray;
}
```

### Highlight lines

Place a numeric range inside `{}`.

````txt title="example source"
```ts {3..5,7}
/**
 * Parse Markdown code fence metadata.
 *
 * @param metastring - Code block metadata string.
 * @returns Parsed metadata values object.
 * @public
 */
export declare function parseMetadata(metastring: string | undefined): TMetadata;
```
````

```ts {3..5,7} title="example rendered"
/**
 * Parse Markdown code fence metadata.
 *
 * @param metastring - Code block metadata string.
 * @returns Parsed metadata values object.
 * @public
 */
export declare function parseMetadata(metastring: string | undefined): TMetadata;
```

#### CSS Example

Actually apply the highlighting to the line by targeting the `data-highlighted` attribute.

```css
code > span[data-highlighted] {
  background: #3b4252;
  width: 100%;
}
```

## Notes

If languages are known ahead of time, limiting them should speed up loading the highlighter.

```js
// mdsvex.config.js
export default {
  // ...rest of the MDsveX options
  highlight: {
    highlighter: createHighlighter({
      //  ...rest of the Shiki options
      lang: ["css", "html", "js", "ts", "sh"]
     }),
  },
};
```

If using the CSS variables, add them to your css like so.

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

## References

- The rendering was inspired by Shiki's [renderToHtml](https://github.com/shikijs/shiki/blob/a585c9d6860334a6233ff1c035a42d023e016400/packages/shiki/src/renderer.ts) function.
- The metadata parsing was inspired by [Rehype Pretty Code](https://github.com/atomiks/rehype-pretty-code).
- More information on theming: [Shiki - Theming with CSS Variables](https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables)

## License

[MIT](https://github.com/johnhooks/highlighter/blob/main/LICENSE) @ [John Hooks](https://github.com/johnhooks)
