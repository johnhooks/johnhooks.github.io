// import * as path from "path";
import { fileURLToPath } from "url";

import gfm from "remark-gfm";
import slug from "rehype-slug";
import link from "rehype-autolink-headings";
import { toString } from "hast-util-to-string";
import { selectAll } from "hast-util-select";
import { h } from "hastscript";

import { highlighter } from "./scripts/highligher.js";
import linkIcon from "./scripts/link-icon.js";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  // This overrides the rehype plugins, so not very useful.
  // layout: path.join(__dirname, "./src/lib/components/post-layout.svelte"),

  highlight: {
    highlighter,
    // Bypass highlighting
    // highlighter(code, lang) {
    //   return `<pre><code>${code}</code></pre>`;
    // },
  },

  smartypants: {
    dashes: "oldschool",
  },

  remarkPlugins: [gfm],

  rehypePlugins: [
    slug,
    // Add flex to h1, h2 and h3 headings
    // ref: https://github.com/martypdx/rehype-add-classes
    () => (node) =>
      selectAll("h1,h2,h3", node).forEach(({ properties }) => {
        if (!properties.className) properties.className = "flex";
        else properties.className += " flex";
      }),
    // https://github.com/rehypejs/rehype-autolink-headings
    [
      link,
      {
        behavior: "append",
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          class: "flex flex-wrap content-center",
        },
        content(node) {
          return [h("span.hidden", "Read the “", toString(node), "” section"), linkIcon()];
        },
      },
    ],
  ],
};

export default config;
