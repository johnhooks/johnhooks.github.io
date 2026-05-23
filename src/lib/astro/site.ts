export const SITE_URL = import.meta.env.SITE_URL ?? "http://localhost:4321";

export function getSiteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
