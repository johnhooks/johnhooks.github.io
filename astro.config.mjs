import cloudflare from "@astrojs/cloudflare";
import { transformerMetaHighlight } from "@shikijs/transformers";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function removeMarkdownScripts() {
  return (tree) => {
    tree.children = tree.children.filter(
      (node) =>
        !(node.type === "html" && node.value.trim().startsWith("<script")),
    );
  };
}

export default defineConfig({
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  output: "server",
  publicDir: "./static",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "css-variables",
      transformers: [transformerMetaHighlight()],
    },
    remarkPlugins: [remarkGfm, removeMarkdownScripts],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            className: ["autolink"],
          },
          content() {
            return {
              type: "element",
              tagName: "span",
              properties: {},
              children: [{ type: "text", value: "#" }],
            };
          },
        },
      ],
    ],
  },
});
