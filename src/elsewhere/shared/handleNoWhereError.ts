import type { AstroGlobal } from "astro";

import { isNoWhereError, type NoWhereError } from "./NoWhereError";

export function handleNoWhereError(error: unknown, astro: AstroGlobal) {
  if (!isNoWhereError(error)) {
    throw error;
  }

  astro.response.status = error.status ?? 422;

  return error satisfies NoWhereError;
}
