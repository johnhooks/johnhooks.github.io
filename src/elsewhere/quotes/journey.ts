import { NoWhereError, NoWhereErrorCode } from "../shared/NoWhereError";
import { createRandom, hashString, pickBySeed } from "../shared/random";
import type { QuoteSummary } from "./quote-loader";

export type QuoteJourneyState = {
  seed: string;
  signal: string;
  depth: number;
  bits: ChoiceBits;
};

export type QuoteDirection = "left" | "right";

export type QuoteDoor = {
  label: string;
  href: string;
  quote: QuoteSummary;
  direction: QuoteDirection;
};

type ChoiceBits = number[];

const signals = ["acid", "static", "ultraviolet", "terminal", "hazard"] as const;
const biases = ["tag", "author", "signal", "swerve"] as const;
const bitsPerChunk = 32;
const hexCharsPerChunk = 8;
const maxDepth = 4096;
const maxSeedLength = 64;
const seedAttempts = 4096;
const hexPattern = /^[a-f0-9]+$/i;

function normalizeParameter(value: string | null, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, maxSeedLength) : fallback;
}

function normalizeDepth(value: string | null, quoteCount: number) {
  if (!value) {
    return 0;
  }

  if (!hexPattern.test(value)) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteDepthInvalid,
      `Depth ${value} is not valid hexadecimal journey state.`,
      {
        data: {
          status: 422,
          depth: value,
        },
      },
    );
  }

  const parsed = BigInt(`0x${value}`);
  const maxCollectionDepth = Math.max(quoteCount - 1, 0);
  const allowedDepth = Math.min(maxDepth, maxCollectionDepth);

  if (parsed > BigInt(allowedDepth)) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteDepthOutOfBounds,
      `Depth ${value} resolves to ${parsed.toString()}, but this quote wire can only descend to depth ${allowedDepth} across ${quoteCount} quotes.`,
      {
        data: {
          status: 422,
          depth: parsed.toString(),
          maxDepth: allowedDepth,
          quoteCount,
        },
      },
    );
  }

  return Number(parsed);
}

function normalizeBits(value: string | null): ChoiceBits {
  if (!value) {
    return [];
  }

  if (!hexPattern.test(value)) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteBitsInvalid,
      `Branch bits ${value} are not valid hexadecimal journey state.`,
      {
        data: {
          status: 422,
          bits: value,
        },
      },
    );
  }

  const chunks: ChoiceBits = [];

  for (let end = value.length; end > 0; end -= hexCharsPerChunk) {
    const start = Math.max(0, end - hexCharsPerChunk);
    chunks.push(Number.parseInt(value.slice(start, end), 16) >>> 0);
  }

  return chunks;
}

function trimBits(bits: ChoiceBits) {
  let lastIndex = bits.length - 1;

  while (lastIndex >= 0 && bits[lastIndex] === 0) {
    lastIndex -= 1;
  }

  return bits.slice(0, lastIndex + 1);
}

function encodeBits(bits: ChoiceBits) {
  const trimmed = trimBits(bits);

  if (trimmed.length === 0) {
    return "0";
  }

  return trimmed
    .toReversed()
    .map((chunk, index) => {
      const encoded = chunk.toString(16);

      return index === 0 ? encoded : encoded.padStart(hexCharsPerChunk, "0");
    })
    .join("");
}

function encodeDepth(depth: number) {
  return depth.toString(16);
}

function hasJourneyState(url: URL) {
  return (
    url.searchParams.has("seed") || url.searchParams.has("d") || url.searchParams.has("b")
  );
}

function validateJourneyState(url: URL) {
  if (!hasJourneyState(url)) {
    return;
  }

  const requiredParams = ["seed", "d", "b"];
  const missingParams = requiredParams.filter(
    (parameter) => !url.searchParams.has(parameter),
  );
  const obsoleteParams = ["depth", "bias", "signal", "from"].filter((parameter) =>
    url.searchParams.has(parameter),
  );

  if (missingParams.length > 0 || obsoleteParams.length > 0) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteJourneyStateIncomplete,
      `Journey URLs need seed, d, and b together. Missing: ${missingParams.join(", ") || "none"}. Obsolete: ${obsoleteParams.join(", ") || "none"}.`,
      {
        data: {
          status: 422,
          missingParams,
          obsoleteParams,
        },
      },
    );
  }
}

function readChoiceBit(bits: ChoiceBits, index: number): QuoteDirection {
  const chunk = bits[Math.floor(index / bitsPerChunk)] ?? 0;
  const mask = 2 ** (index % bitsPerChunk);

  return (chunk & mask) !== 0 ? "right" : "left";
}

function writeChoiceBit(bits: ChoiceBits, index: number, direction: QuoteDirection) {
  const nextBits = [...bits];

  if (direction === "left") {
    return nextBits;
  }

  const chunkIndex = Math.floor(index / bitsPerChunk);
  const mask = 2 ** (index % bitsPerChunk);

  while (nextBits.length <= chunkIndex) {
    nextBits.push(0);
  }

  nextBits[chunkIndex] = ((nextBits[chunkIndex] ?? 0) | mask) >>> 0;

  return nextBits;
}

export function createInitialSeed() {
  return crypto.randomUUID().slice(0, 8);
}

function createSeedForQuote(quote: QuoteSummary, quotes: QuoteSummary[]) {
  // Direct quote visits need a seed whose procedural root is the current quote.
  // The quote wire normally gets there by trying deterministic slug-derived
  // seeds until one hashes into the current quote's slot. That bounded search is
  // intentionally simple and works for a small curated archive, but it is not a
  // mathematical guarantee for arbitrarily large collections. If this ever
  // fails, the URL could no longer honestly claim the visited quote is the root
  // of the generated tree, so fall off the path instead of silently lying about
  // the journey state.
  for (let attempt = 0; attempt < seedAttempts; attempt += 1) {
    const seed = `${quote.slug}:${attempt.toString(16)}`;

    if (pickBySeed(quotes, seed).slug === quote.slug) {
      return seed;
    }
  }

  throw new NoWhereError(
    NoWhereErrorCode.QuoteRootSeedNotFound,
    `Tried ${seedAttempts} deterministic seeds for ${quote.slug}. The bounded search is simple enough for a small curated archive, but it is not a mathematical guarantee.`,
    {
      data: {
        status: 422,
        quoteSlug: quote.slug,
        seedAttempts,
      },
    },
  );
}

export function readJourneyState(
  url: URL,
  current: QuoteSummary,
  quotes: QuoteSummary[],
): QuoteJourneyState {
  validateJourneyState(url);

  const seed = hasJourneyState(url)
    ? normalizeParameter(url.searchParams.get("seed"), createInitialSeed())
    : createSeedForQuote(current, quotes);
  const signal =
    signals[hashString(`${seed}:${current.slug}`) % signals.length] ??
    current.metadata.signal.color;

  return {
    seed,
    signal,
    depth: normalizeDepth(url.searchParams.get("d"), quotes.length),
    bits: normalizeBits(url.searchParams.get("b")),
  };
}

function byTag(current: QuoteSummary, quotes: QuoteSummary[]) {
  return quotes.filter((quote) =>
    quote.metadata.tags.some((tag) => current.metadata.tags.includes(tag)),
  );
}

function byAuthor(current: QuoteSummary, quotes: QuoteSummary[]) {
  return quotes.filter((quote) => quote.metadata.author === current.metadata.author);
}

function bySignal(current: QuoteSummary, quotes: QuoteSummary[]) {
  return quotes.filter(
    (quote) => quote.metadata.signal.mood === current.metadata.signal.mood,
  );
}

function candidatesForBias(bias: string, current: QuoteSummary, quotes: QuoteSummary[]) {
  if (bias === "author") {
    return byAuthor(current, quotes);
  }

  if (bias === "signal") {
    return bySignal(current, quotes);
  }

  if (bias === "tag") {
    return byTag(current, quotes);
  }

  return quotes;
}

function pickQuote(
  candidates: QuoteSummary[],
  fallback: QuoteSummary[],
  seed: string,
  usedSlugs: Set<string>,
) {
  const available = candidates.filter((quote) => !usedSlugs.has(quote.slug));
  const fallbackAvailable = fallback.filter((quote) => !usedSlugs.has(quote.slug));
  const pool = available.length > 0 ? available : fallbackAvailable;

  if (pool.length === 0) {
    return undefined;
  }

  const random = createRandom(seed);
  const quote = pool[Math.floor(random() * pool.length)];
  usedSlugs.add(quote.slug);

  return quote;
}

function selectQuoteDoors(
  current: QuoteSummary,
  remaining: QuoteSummary[],
  seed: string,
  depth: number,
) {
  const usedSlugs = new Set<string>();

  return (["left", "right"] as const).flatMap((direction, index) => {
    const bias =
      biases[
        hashString(`${seed}:${depth}:${current.slug}:${direction}:bias`) % biases.length
      ];
    const candidates = candidatesForBias(bias, current, remaining);
    const quote = pickQuote(
      candidates,
      remaining,
      `${seed}:${depth}:${current.slug}:${direction}:${index}`,
      usedSlugs,
    );

    if (!quote) {
      return [];
    }

    const labels: Record<QuoteDirection, string> = {
      left: "follow the west wire",
      right: "follow the east wire",
    };

    return [{ direction, label: labels[direction], quote }];
  });
}

function replayJourney(state: QuoteJourneyState, quotes: QuoteSummary[]) {
  const root = pickBySeed(quotes, state.seed);
  const visited = new Map<string, QuoteSummary>([[root.slug, root]]);
  let current = root;

  for (let depth = 0; depth < state.depth; depth += 1) {
    const remaining = quotes.filter((quote) => !visited.has(quote.slug));

    if (remaining.length === 0) {
      break;
    }

    const doors = selectQuoteDoors(current, remaining, state.seed, depth);
    const direction = readChoiceBit(state.bits, depth);
    const door = doors.find((candidate) => candidate.direction === direction) ?? doors[0];

    if (!door) {
      break;
    }

    current = door.quote;
    visited.set(current.slug, current);
  }

  return { current, visited };
}

function createQuoteHref(
  quote: QuoteSummary,
  state: QuoteJourneyState,
  direction: QuoteDirection,
) {
  const nextDepth = state.depth + 1;
  const nextBits = writeChoiceBit(state.bits, state.depth, direction);
  const params = new URLSearchParams({
    seed: state.seed,
    d: encodeDepth(nextDepth),
    b: encodeBits(nextBits),
  });

  return `/elsewhere/quotes/${quote.slug}?${params.toString()}`;
}

export function createQuoteDoors(
  current: QuoteSummary,
  quotes: QuoteSummary[],
  state: QuoteJourneyState,
) {
  const replayed = replayJourney(state, quotes);
  const visited = new Map(replayed.visited);

  if (replayed.current.slug !== current.slug) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteRouteMismatch,
      `The URL journey state resolves to ${replayed.current.slug}, but the route is showing ${current.slug}.`,
      {
        data: {
          status: 422,
          routeSlug: current.slug,
          replayedSlug: replayed.current.slug,
          depth: state.depth,
        },
      },
    );
  }

  const remaining = quotes.filter((quote) => !visited.has(quote.slug));
  const doors = selectQuoteDoors(current, remaining, state.seed, state.depth);

  return doors.map(
    (door): QuoteDoor => ({
      ...door,
      href: createQuoteHref(door.quote, state, door.direction),
    }),
  );
}

export function createEntryHref(quotes: QuoteSummary[]) {
  if (quotes.length === 0) {
    throw new NoWhereError(
      NoWhereErrorCode.QuoteCollectionEmpty,
      "The quote wire cannot create an entry URL because the quote collection is empty.",
      {
        data: {
          status: 422,
        },
      },
    );
  }

  const seed = createInitialSeed();
  const quote = pickBySeed(quotes, seed);
  const params = new URLSearchParams({
    seed,
    d: "0",
    b: "0",
  });

  return `/elsewhere/quotes/${quote.slug}?${params.toString()}`;
}
