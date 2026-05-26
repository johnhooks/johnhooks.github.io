import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import { transformerMetaHighlight } from "@shikijs/transformers";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export default defineConfig({
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  integrations: [mdx()],
  output: "server",
  publicDir: "./static",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "css-variables",
      transformers: [transformerMetaHighlight()],
    },
    remarkPlugins: [remarkGfm],
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
