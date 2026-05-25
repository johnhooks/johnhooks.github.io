import { createRandom, hashString } from "../shared/random";
import type { QuoteEntry } from "./quote-loader";

export type QuoteJourneyState = {
  seed: string;
  signal: string;
  depth: number;
  bias: string;
  from?: string;
};

export type QuoteDoor = {
  label: string;
  href: string;
  bias: string;
  quote: QuoteEntry;
};

const signals = [
  "acid",
  "static",
  "ultraviolet",
  "terminal",
  "hazard",
] as const;
const biases = ["tag", "author", "signal", "swerve"] as const;

function normalizeParameter(value: string | null, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 64) : fallback;
}

function normalizeListedParameter<T extends readonly string[]>(
  value: string | null,
  allowed: T,
  fallback: T[number],
): T[number] {
  const normalized = normalizeParameter(value, fallback);

  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeDepth(value: string | null) {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function createInitialSeed() {
  return hashString(new Date().toISOString().slice(0, 10)).toString(16);
}

export function readJourneyState(
  url: URL,
  currentSlug: string,
): QuoteJourneyState {
  const seed = normalizeParameter(
    url.searchParams.get("seed"),
    createInitialSeed(),
  );
  const fallbackSignal =
    signals[hashString(`${seed}:${currentSlug}`) % signals.length];
  const signal = normalizeListedParameter(
    url.searchParams.get("signal"),
    signals,
    fallbackSignal,
  );
  const fallbackBias =
    biases[hashString(`${currentSlug}:${seed}:bias`) % biases.length];
  const bias = normalizeListedParameter(
    url.searchParams.get("bias"),
    biases,
    fallbackBias,
  );
  const from = url.searchParams.get("from") ?? undefined;

  return {
    seed,
    signal,
    bias,
    from,
    depth: normalizeDepth(url.searchParams.get("depth")),
  };
}

function byTag(current: QuoteEntry, quotes: QuoteEntry[]) {
  return quotes.filter(
    (quote) =>
      quote.slug !== current.slug &&
      quote.metadata.tags.some((tag) => current.metadata.tags.includes(tag)),
  );
}

function byAuthor(current: QuoteEntry, quotes: QuoteEntry[]) {
  return quotes.filter(
    (quote) =>
      quote.slug !== current.slug &&
      quote.metadata.author === current.metadata.author,
  );
}

function bySignal(current: QuoteEntry, quotes: QuoteEntry[]) {
  return quotes.filter(
    (quote) =>
      quote.slug !== current.slug &&
      quote.metadata.signal.mood === current.metadata.signal.mood,
  );
}

function withoutCurrent(current: QuoteEntry, quotes: QuoteEntry[]) {
  return quotes.filter((quote) => quote.slug !== current.slug);
}

function candidatesForBias(
  bias: string,
  current: QuoteEntry,
  quotes: QuoteEntry[],
) {
  if (bias === "author") {
    return byAuthor(current, quotes);
  }

  if (bias === "signal") {
    return bySignal(current, quotes);
  }

  if (bias === "tag") {
    return byTag(current, quotes);
  }

  return withoutCurrent(current, quotes);
}

function pickQuote(
  candidates: QuoteEntry[],
  fallback: QuoteEntry[],
  seed: string,
  usedSlugs: Set<string>,
) {
  const available = candidates.filter((quote) => !usedSlugs.has(quote.slug));
  const pool = available.length > 0 ? available : fallback;
  const random = createRandom(seed);
  const quote = pool[Math.floor(random() * pool.length)];
  usedSlugs.add(quote.slug);

  return quote;
}

function createQuoteHref(
  quote: QuoteEntry,
  state: QuoteJourneyState,
  bias: string,
  currentSlug: string,
) {
  const params = new URLSearchParams({
    seed: state.seed,
    signal: quote.metadata.signal.color,
    depth: String(state.depth + 1),
    bias,
    from: currentSlug,
  });

  return `/elsewhere/quotes/${quote.slug}?${params.toString()}`;
}

export function createQuoteDoors(
  current: QuoteEntry,
  quotes: QuoteEntry[],
  state: QuoteJourneyState,
) {
  const fallback = withoutCurrent(current, quotes);
  const usedSlugs = new Set<string>();
  const doorBiases = [state.bias, state.bias === "tag" ? "swerve" : "tag"];

  return doorBiases.map((bias, index): QuoteDoor => {
    const candidates = candidatesForBias(bias, current, quotes);
    const quote = pickQuote(
      candidates,
      fallback,
      `${state.seed}:${state.depth}:${current.slug}:${bias}:${index}`,
      usedSlugs,
    );

    const labels: Record<string, string> = {
      author: "follow the author ghost",
      tag: "cross the shared wire",
      signal: "tune the same signal",
      swerve: "swerve into static",
    };

    return {
      label: labels[bias] ?? "open the unmarked door",
      bias,
      quote,
      href: createQuoteHref(quote, state, bias, current.slug),
    };
  });
}

export function createEntryHref(quote: QuoteEntry) {
  const state = {
    seed: createInitialSeed(),
    signal: quote.metadata.signal.color,
    depth: 0,
    bias: "tag",
  } satisfies QuoteJourneyState;

  return `/elsewhere/quotes/${quote.slug}?seed=${state.seed}&signal=${state.signal}&depth=${state.depth}&bias=${state.bias}`;
}
