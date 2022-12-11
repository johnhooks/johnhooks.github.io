/// <reference types="mdsvex/globals" />

// https://github.com/pngwn/MDsveX/blob/6c60fe68c335fce559db9690fbf5e69ef539d37d/packages/mdsvex/globals.d.ts
declare module "*.md" {
  import type { SvelteComponentDev } from "svelte/internal";

  export default class Comp extends SvelteComponentDev {
    // eslint-disable-next-line @typescript-eslint/ban-types
    $$prop_def: {};
  }
  export const metadata: Record<string, unknown>;
}

declare module "*.svelte" {
  export { SvelteComponentDev as default } from "svelte/internal";
}
