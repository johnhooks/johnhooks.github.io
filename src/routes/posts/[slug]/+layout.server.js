import { BASE_URL } from "$lib/const";

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  return {
    base_url: BASE_URL,
  };
}
