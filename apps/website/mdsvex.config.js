// import * as path from "path";
import { fileURLToPath } from "url";

import { createHighlighter } from "@bitmachina/highlighter";
import { selectAll } from "hast-util-select";
import { toString } from "hast-util-to-string";
import { h } from "hastscript";
import link from "rehype-autolink-headings";
import slug from "rehype-slug";
import gfm from "remark-gfm";

import linkIcon from "./mdsvex/link-icon.js";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  // This overrides the rehype plugins, so not very useful.
  // layout: path.join(__dirname, "./src/lib/components/post-layout.svelte"),

  highlight: {
    highlighter: await createHighlighter({ theme: "css-variables" }),
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
      selectAll("h1,h2,h3,h4,h5,h6", node).forEach(({ properties }) => {
        if (!properties.className) properties.className = ["flex", "flex-row"];
        else properties.className.push("flex", "flex-row");
      }),
    // https://github.com/rehypejs/rehype-autolink-headings
    [
      link,
      {
        behavior: "append",
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          class: "flex flex-row flex-wrap content-center",
        },
        content(node) {
          return [h("span.hidden", "Read the “", toString(node), "” section"), linkIcon()];
        },
      },
    ],
  ],
};

export default config;
