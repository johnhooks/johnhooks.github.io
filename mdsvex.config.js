// import { join } from "path";
import { fileURLToPath } from "url";

import slug from "rehype-slug";
import link from "rehype-autolink-headings";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));

const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  // layout: join(__dirname, "./src/lib/components/post-layout.svelte"),

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
