import { env } from "cloudflare:workers";

const productionRobots = `User-agent: *
Allow: /

Sitemap: https://johnhooks.io/sitemap.xml
`;

const nonProductionRobots = `User-agent: *
Disallow: /
`;

export function GET() {
  const body =
    env.ENVIRONMENT === "production" ? productionRobots : nonProductionRobots;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
