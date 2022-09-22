import { SUPER_SECRET } from "$env/static/private";

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return {
    secret: SUPER_SECRET,
  };
}
