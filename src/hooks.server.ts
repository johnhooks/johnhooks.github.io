import { building, dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Add noindex headers for non-production environments
  // platform.env is only available in Cloudflare runtime (not during dev/build/prerender)
  if (!dev && !building) {
    const environment = event.platform?.env?.ENVIRONMENT;
    if (environment !== "production") {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
  }

  return response;
};
