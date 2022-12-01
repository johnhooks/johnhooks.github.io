import { fileURLToPath } from "url";

import slug from "rehype-slug";
import link from "rehype-autolink-headings";
import shiki from "shiki";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

const escape_svelty = (str) =>
  str
    .replace(/[{}`]/g, (c) => ({ "{": "&#123;", "}": "&#125;", "`": "&#96;" }[c]))
    .replace(/\\([trn])/g, "&#92;$1");

const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  // layout: join(__dirname, "./src/lib/components/post-layout.svelte"),

  highlight: {
    highlighter: async (raw, lang) => {
      const highlighter = await shiki.getHighlighter({ theme: "nord" });
      const code = escape_svelty(highlighter.codeToHtml(raw, { lang: lang || "text" }));
      return `${code}`;
    },
  },

  smartypants: {
    dashes: "oldschool",
  },

  remarkPlugins: [],

  rehypePlugins: [
    slug,
    /**
     * TODO Configure rehype-autolink-heading
     * https://github.com/rehypejs/rehype-autolink-headings
     */
    link,
  ],
};

export default config;
