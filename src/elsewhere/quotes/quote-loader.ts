import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export type QuoteSignal = {
  color: string;
  mood: string;
};

export type QuoteFrontmatter = Omit<CollectionEntry<"quotes">["data"], "retrievedOn"> & {
  retrievedOn: string;
};

export type QuoteSummary = {
  slug: string;
  metadata: QuoteFrontmatter;
  bodyText: string;
};

export type QuoteEntry = QuoteSummary & {
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

function normalizeQuoteSummary(entry: CollectionEntry<"quotes">) {
  validateQuoteSlug(entry);

  return {
    slug: entry.id,
    metadata: {
      ...entry.data,
      retrievedOn: formatDate(entry.data.retrievedOn),
    },
    bodyText: entry.body ?? "",
  } satisfies QuoteSummary;
}

async function normalizeQuote(entry: CollectionEntry<"quotes">) {
  const summary = normalizeQuoteSummary(entry);
  const { Content } = await render(entry);

  return {
    ...summary,
    Content,
  } satisfies QuoteEntry;
}

function sortByTitle<T extends QuoteSummary>(quotes: T[]) {
  return quotes.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
}

export async function getQuoteSummaries() {
  const entries = await getCollection("quotes");

  return sortByTitle(entries.map(normalizeQuoteSummary));
}

export async function getQuote(slug: string) {
  const entries = await getCollection("quotes");
  const entry = entries.find((candidate) => candidate.id === slug);

  return entry ? normalizeQuote(entry) : undefined;
}

export async function getQuotePageData(slug: string) {
  const entries = await getCollection("quotes");
  const summaries = sortByTitle(entries.map(normalizeQuoteSummary));
  const entry = entries.find((candidate) => candidate.id === slug);
  const quote = entry ? await normalizeQuote(entry) : undefined;

  return { quote, summaries };
}
