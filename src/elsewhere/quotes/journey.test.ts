import { describe, expect, test } from "vitest";

import { NoWhereError, NoWhereErrorCode } from "../shared/NoWhereError";
import { createEntryHref, createQuoteDoors, readJourneyState } from "./journey";
import type { QuoteSummary } from "./quote-loader";

function createQuote(slug: string, index: number): QuoteSummary {
  return {
    slug,
    bodyText: `Quote body for ${slug} with several navigable words`,
    metadata: {
      slug,
      title: `Quote ${index}`,
      author: `Author ${index % 3}`,
      work: `Work ${index}`,
      sourceName: "Test source",
      sourceUrl: `https://example.com/${slug}`,
      license: "CC BY-SA 4.0",
      retrievedOn: "2026-05-30",
      tags: [`tag-${index % 2}`, "shared"],
      signal: {
        color: "acid",
        mood: `mood-${index % 2}`,
      },
    },
  };
}

function createQuotes(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createQuote(`quote-${index}`, index),
  );
}

function readStateForUrl(url: string, current: QuoteSummary, quotes: QuoteSummary[]) {
  return readJourneyState(new URL(url, "https://example.com"), current, quotes);
}

function searchParams(href: string) {
  return new URL(href, "https://example.com").searchParams;
}

describe("quote journey", () => {
  test("creates direct-visit seeds rooted at each current quote", () => {
    const quotes = createQuotes(6);

    for (const root of quotes) {
      const state = readStateForUrl(`/elsewhere/quotes/${root.slug}`, root, quotes);
      let current = root;
      let url = `/elsewhere/quotes/${root.slug}`;
      const path = [root.slug];

      expect(state.depth).toBe(0);

      while (path.length < quotes.length) {
        const currentState = readStateForUrl(url, current, quotes);
        const doors = createQuoteDoors(current, quotes, currentState);
        const door = doors[0];

        expect(door).toBeDefined();
        expect(path).not.toContain(door?.quote.slug);

        current = door?.quote ?? current;
        url = door?.href ?? url;
        path.push(current.slug);
      }

      expect(
        createQuoteDoors(current, quotes, readStateForUrl(url, current, quotes)),
      ).toHaveLength(0);
    }
  });

  test("encodes generated door URLs with seed, hex depth, and branch bits", () => {
    const quotes = createQuotes(6);
    const root = quotes[0];
    const state = readStateForUrl(`/elsewhere/quotes/${root.slug}`, root, quotes);
    const doors = createQuoteDoors(root, quotes, state);
    const left = doors.find((door) => door.direction === "left");
    const right = doors.find((door) => door.direction === "right");

    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(searchParams(left?.href ?? "").get("seed")).toBe(state.seed);
    expect(searchParams(left?.href ?? "").get("d")).toBe("1");
    expect(searchParams(left?.href ?? "").get("b")).toBe("0");
    expect(searchParams(right?.href ?? "").get("seed")).toBe(state.seed);
    expect(searchParams(right?.href ?? "").get("d")).toBe("1");
    expect(searchParams(right?.href ?? "").get("b")).toBe("1");
  });

  test("replays every branch without repeats until all quotes are visited", () => {
    const quotes = createQuotes(5);
    const root = quotes[2];
    const leaves: string[][] = [];

    function walk(current: QuoteSummary, url: string, path: string[]) {
      const state = readStateForUrl(url, current, quotes);
      const doors = createQuoteDoors(current, quotes, state);

      expect(new Set(path).size).toBe(path.length);

      if (doors.length === 0) {
        leaves.push(path);
        expect(path).toHaveLength(quotes.length);
        return;
      }

      for (const door of doors) {
        expect(path).not.toContain(door.quote.slug);
        walk(door.quote, door.href, [...path, door.quote.slug]);
      }
    }

    walk(root, `/elsewhere/quotes/${root.slug}`, [root.slug]);

    expect(leaves.length).toBeGreaterThan(0);
  });

  test("keeps branch bits stable past one 32-bit chunk", () => {
    const quotes = createQuotes(36);
    let current = quotes[0];
    let url = `/elsewhere/quotes/${current.slug}`;

    for (let step = 0; step < 33; step += 1) {
      const state = readStateForUrl(url, current, quotes);
      const doors = createQuoteDoors(current, quotes, state);
      const door = doors.find((candidate) => candidate.direction === "right");

      expect(door).toBeDefined();
      current = door?.quote ?? current;
      url = door?.href ?? url;
    }

    const params = searchParams(url);

    expect(params.get("d")).toBe("21");
    expect(params.get("b")).toBe("1ffffffff");
  });

  test("throws a coded error when a direct visit cannot be rooted", () => {
    const quotes = createQuotes(2);
    const missing = createQuote("missing-quote", 99);

    try {
      readStateForUrl(`/elsewhere/quotes/${missing.slug}`, missing, quotes);
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteRootSeedNotFound);
        expect(error.message).toBe(NoWhereErrorCode.QuoteRootSeedNotFound);
        expect(error.detail).toContain("Tried 4096 deterministic seeds");
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when URL depth exceeds the collection", () => {
    const quotes = createQuotes(4);
    const current = quotes[0];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=4&b=0`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteDepthOutOfBounds);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when URL depth exceeds the hard limit", () => {
    const quotes = createQuotes(5000);
    const current = quotes[0];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=1001&b=0`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteDepthOutOfBounds);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when journey state is incomplete", () => {
    const quotes = createQuotes(4);
    const current = quotes[1];

    try {
      readStateForUrl(`/elsewhere/quotes/${current.slug}?seed=test`, current, quotes);
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteJourneyStateIncomplete);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when obsolete journey params are present", () => {
    const quotes = createQuotes(4);
    const current = quotes[1];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=0&b=0&depth=0&bias=tag`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteJourneyStateIncomplete);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when URL depth is malformed", () => {
    const quotes = createQuotes(4);
    const current = quotes[1];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=wat&b=0`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteDepthInvalid);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when URL depth is too large to parse as a number", () => {
    const quotes = createQuotes(4);
    const current = quotes[1];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=${"f".repeat(400)}&b=0`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteDepthOutOfBounds);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when URL branch bits are malformed", () => {
    const quotes = createQuotes(4);
    const current = quotes[1];

    try {
      readStateForUrl(
        `/elsewhere/quotes/${current.slug}?seed=test&d=0&b=not-hex`,
        current,
        quotes,
      );
      throw new Error("Expected readJourneyState to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteBitsInvalid);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when route and journey state disagree", () => {
    const quotes = createQuotes(4);
    const root = quotes[0];
    const state = readStateForUrl(`/elsewhere/quotes/${root.slug}`, root, quotes);
    const doors = createQuoteDoors(root, quotes, state);
    const door = doors[0];

    expect(door).toBeDefined();

    const nextState = readStateForUrl(door?.href ?? "", root, quotes);

    try {
      createQuoteDoors(root, quotes, nextState);
      throw new Error("Expected createQuoteDoors to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteRouteMismatch);
        expect(error.status).toBe(422);
      }
    }
  });

  test("throws a coded error when creating an entry URL without quotes", () => {
    try {
      createEntryHref([]);
      throw new Error("Expected createEntryHref to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(NoWhereError);

      if (error instanceof NoWhereError) {
        expect(error.code).toBe(NoWhereErrorCode.QuoteCollectionEmpty);
        expect(error.status).toBe(422);
      }
    }
  });

  test("creates an entry URL with journey parameters", () => {
    const quotes = createQuotes(4);
    const href = createEntryHref(quotes);
    const url = new URL(href, "https://example.com");

    expect(url.pathname).toMatch(/^\/elsewhere\/quotes\/quote-\d$/);
    expect(url.searchParams.get("seed")).toMatch(/^[a-f0-9-]+$/);
    expect(url.searchParams.get("d")).toBe("0");
    expect(url.searchParams.get("b")).toBe("0");
  });
});
