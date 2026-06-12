import { env } from "cloudflare:workers";

const quoteJourneyDisallow = "Disallow: /elsewhere/quotes/*?*";

const productionRobots = `User-agent: meta-externalagent
Allow: /
${quoteJourneyDisallow}

User-agent: ClaudeBot
Allow: /
${quoteJourneyDisallow}

User-agent: GPTBot
Allow: /
${quoteJourneyDisallow}

User-agent: ChatGPT-User
Allow: /
${quoteJourneyDisallow}

User-agent: OAI-SearchBot
Allow: /
${quoteJourneyDisallow}

User-agent: *
Allow: /
${quoteJourneyDisallow}

Sitemap: https://johnhooks.io/sitemap.xml
`;

const nonProductionRobots = `User-agent: *
Disallow: /
`;

export function GET() {
  const body = env.ENVIRONMENT === "production" ? productionRobots : nonProductionRobots;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
