/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "cloudflare:workers" {
  export const env: {
    ENVIRONMENT?: string;
    SITE_URL?: string;
  };
}
