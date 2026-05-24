import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export type QuoteSignal = {
  color: string;
  mood: string;
};

export type QuoteFrontmatter = {
  slug: string;
  title: string;
  author: string;
  work: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  retrievedOn: string;
  tags: string[];
  signal: QuoteSignal;
};

export type QuoteEntry = {
  slug: string;
  metadata: QuoteFrontmatter;
  bodyText: string;
  Content: AstroComponentFactory;
};

type QuoteModule = {
  frontmatter: QuoteFrontmatter;
  default: AstroComponentFactory;
};

const requiredFields = [
  "slug",
  "title",
  "author",
  "work",
  "sourceName",
  "sourceUrl",
  "license",
  "retrievedOn",
  "tags",
  "signal",
] as const;

function slugFromPath(path: string) {
  const match = /\/([\w-]+)\.mdx?$/.exec(path);

  if (!match) {
    throw new Error(`Unable to parse quote slug from ${path}`);
  }

  return match[1];
}

function bodyTextFromRaw(raw: string) {
  return raw.replace(/^---[\s\S]*?---\s*/, "").trim();
}

function validateQuoteMetadata(metadata: QuoteFrontmatter, path: string) {
  for (const field of requiredFields) {
    if (!(field in metadata)) {
      throw new Error(
        `Quote entry ${path} is missing frontmatter field: ${field}`,
      );
    }
  }

  const fileSlug = slugFromPath(path);

  if (metadata.slug !== fileSlug) {
    throw new Error(
      `Quote entry ${path} has slug ${metadata.slug}, expected ${fileSlug}`,
    );
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
    throw new Error(`Quote entry ${path} must define at least one tag.`);
  }

  if (!metadata.signal.color || !metadata.signal.mood) {
    throw new Error(
      `Quote entry ${path} must define signal.color and signal.mood.`,
    );
  }

  return metadata;
}

export function getQuotes() {
  const modules = import.meta.glob<QuoteModule>("./entries/*.{md,mdx}", {
    eager: true,
  });
  const rawModules = import.meta.glob<string>("./entries/*.{md,mdx}", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return Object.entries(modules)
    .map(([path, module]) => ({
      slug: slugFromPath(path),
      metadata: validateQuoteMetadata(module.frontmatter, path),
      bodyText: bodyTextFromRaw(rawModules[path] ?? ""),
      Content: module.default,
    }))
    .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
}

export function getQuoteBySlug(slug: string) {
  return getQuotes().find((quote) => quote.slug === slug);
}
