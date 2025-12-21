import type { RequestHandler } from "./$types";

export const prerender = false;

export const GET: RequestHandler = ({ platform }) => {
  const isProduction = platform?.env?.ENVIRONMENT === "production";
  const siteUrl = platform?.env?.SITE_URL ?? "https://johnhooks.io";

  const robotsTxt = isProduction
    ? `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
    : `# Non-production environment - do not index
User-agent: *
Disallow: /

# Production site: ${siteUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
