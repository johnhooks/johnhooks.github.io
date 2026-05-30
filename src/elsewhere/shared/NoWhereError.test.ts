import { describe, expect, test } from "vitest";

import { NoWhereError, NoWhereErrorCode } from "./NoWhereError";

describe("NoWhereError", () => {
  test("stores the code as the Error message and keeps detail separate", () => {
    const error = new NoWhereError(
      NoWhereErrorCode.QuoteRootSeedNotFound,
      "The wire failed here.",
      { data: { status: 422 } },
    );

    expect(error.message).toBe(NoWhereErrorCode.QuoteRootSeedNotFound);
    expect(error.code).toBe(NoWhereErrorCode.QuoteRootSeedNotFound);
    expect(error.detail).toBe("The wire failed here.");
    expect(error.status).toBe(422);
  });

  test("wraps unknown errors as unsafe unknown errors", () => {
    const cause = new Error("technical failure");
    const error = NoWhereError.from(cause);

    expect(error.code).toBe(NoWhereErrorCode.Unknown);
    expect(error.detail).toBe("technical failure");
    expect(error.isSafe).toBe(false);
    expect(error.cause).toBe(cause);
  });

  test("safeFrom preserves existing safe NoWhereErrors", () => {
    const original = new NoWhereError(
      NoWhereErrorCode.QuoteRootSeedNotFound,
      "Already safe.",
    );
    const wrapped = NoWhereError.safeFrom(
      original,
      NoWhereErrorCode.Unknown,
      "Replacement.",
    );

    expect(wrapped).toBe(original);
  });
});
