export enum NoWhereErrorCode {
  Unknown = "nowhere.unknown_error",
  QuoteBitsInvalid = "nowhere.quote.bits_invalid",
  QuoteCollectionEmpty = "nowhere.quote.collection_empty",
  QuoteDepthInvalid = "nowhere.quote.depth_invalid",
  QuoteDepthOutOfBounds = "nowhere.quote.depth_out_of_bounds",
  QuoteJourneyStateIncomplete = "nowhere.quote.journey_state_incomplete",
  QuoteRootSeedNotFound = "nowhere.quote.root_seed_not_found",
  QuoteRouteMismatch = "nowhere.quote.route_mismatch",
}

export type NoWhereErrorOptions = {
  cause?: unknown;
  data?: Record<string, unknown>;
  isSafe?: boolean;
};

export class NoWhereError extends Error {
  override readonly message: NoWhereErrorCode;
  readonly code: NoWhereErrorCode;
  readonly detail: string;
  readonly data: Record<string, unknown>;
  readonly isSafe: boolean;

  constructor(code: NoWhereErrorCode, detail: string, options?: NoWhereErrorOptions) {
    super(code, { cause: options?.cause });
    this.name = "NoWhereError";
    this.message = code;
    this.code = code;
    this.detail = detail;
    this.data = options?.data ?? {};
    this.isSafe = options?.isSafe ?? true;
  }

  get status() {
    const status = this.data.status;

    return typeof status === "number" ? status : undefined;
  }

  static from(error: unknown) {
    if (NoWhereError.is(error)) {
      return error;
    }

    const detail = error instanceof Error ? error.message : "Unknown error";

    return new NoWhereError(NoWhereErrorCode.Unknown, detail, {
      cause: error,
      isSafe: false,
    });
  }

  static safeFrom(error: unknown, code: NoWhereErrorCode, detail: string) {
    if (NoWhereError.is(error) && error.isSafe) {
      return error;
    }

    return NoWhereError.safe(code, detail, error);
  }

  static safe(code: NoWhereErrorCode, detail: string, cause?: unknown) {
    return new NoWhereError(code, detail, { cause, isSafe: true });
  }

  static is(error: unknown): error is NoWhereError {
    return error instanceof NoWhereError;
  }
}

export function isNoWhereError(error: unknown): error is NoWhereError {
  return NoWhereError.is(error);
}
