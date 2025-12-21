/**
 * The root url of the site.
 *
 * Set via SITE_URL environment variable at build time.
 * Must match the SITE_URL in wrangler.jsonc for each environment.
 */
export const SITE_URL = import.meta.env.SITE_URL ?? "http://localhost:5173";
