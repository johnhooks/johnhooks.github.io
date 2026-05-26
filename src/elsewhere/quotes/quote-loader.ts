import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export type QuoteSignal = {
  color: string;
  mood: string;
};

export type QuoteFrontmatter = Omit<
  CollectionEntry<"quotes">["data"],
  "retrievedOn"
> & {
  retrievedOn: string;
};

export type QuoteEntry = {
  slug: string;
  metadata: QuoteFrontmatter;
  bodyText: string;
  Content: AstroComponentFactory;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function validateQuoteSlug(entry: CollectionEntry<"quotes">) {
  if (entry.data.slug !== entry.id) {
    throw new Error(
      `Quote entry ${entry.id} has slug ${entry.data.slug}, expected ${entry.id}`,
    );
  }
}

async function normalizeQuote(entry: CollectionEntry<"quotes">) {
  validateQuoteSlug(entry);

  const { Content } = await render(entry);

  return {
    slug: entry.id,
    metadata: {
      ...entry.data,
      retrievedOn: formatDate(entry.data.retrievedOn),
    },
    bodyText: entry.body ?? "",
    Content,
  } satisfies QuoteEntry;
}

export async function getQuotes() {
  const entries = await getCollection("quotes");
  const quotes = await Promise.all(entries.map(normalizeQuote));

  return quotes.sort((a, b) =>
    a.metadata.title.localeCompare(b.metadata.title),
  );
}
