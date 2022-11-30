---
title: SvelteKit on GitHub Pages
seoTitle: How to deploy SvelteKit to GitHub Pages using Actions
slug: sveltekit-on-github-pages
abstract: Learn how to automate deployment of a static SvelteKit to GitHub Pages using a GitHub Action workflow
isPublished: true
publishedOn: 2022-09-22
---

- [Storing workflow data as artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)

## Configuring SvelteKit for building a static website

```js filename=src/routes/layout.js lines=[1]
export const prerender = true;
```

```diff
 async function main() {
   const file = await unified()
     .use(rehypeParse, {fragment: true})
+    .use(rehypeHighlight, {subset: false})
     .use(rehypeSanitize, {
       ...defaultSchema,
       attributes: {
         ...defaultSchema.attributes,
-        code: [
-          ...(defaultSchema.attributes.code || []),
-          // List of all allowed languages:
-          ['className', 'hljs', 'language-js', 'language-css', 'language-md']
+        span: [
+          ...(defaultSchema.attributes.span || []),
+          // List of all allowed tokens:
+          ['className', 'hljs-addition', 'hljs-attr', 'hljs-attribute', 'hljs-built_in', 'hljs-bullet', 'hljs-char', 'hljs-code', 'hljs-comment', 'hljs-deletion', 'hljs-doctag', 'hljs-emphasis', 'hljs-formula', 'hljs-keyword', 'hljs-link', 'hljs-literal', 'hljs-meta', 'hljs-name', 'hljs-number', 'hljs-operator', 'hljs-params', 'hljs-property', 'hljs-punctuation', 'hljs-quote', 'hljs-regexp', 'hljs-section', 'hljs-selector-attr', 'hljs-selector-class', 'hljs-selector-id', 'hljs-selector-pseudo', 'hljs-selector-tag', 'hljs-string', 'hljs-strong', 'hljs-subst', 'hljs-symbol', 'hljs-tag', 'hljs-template-tag', 'hljs-template-variable', 'hljs-title', 'hljs-type', 'hljs-variable'
+          ]
         ]
       }
     })
-    .use(rehypeHighlight, {subset: false})
     .use(rehypeStringify)
     .process('<pre><code className="language-js">console.log(1)</code></pre>')
```
