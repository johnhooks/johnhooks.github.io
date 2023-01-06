import { error } from "@sveltejs/kit";

import { loadProject } from "$lib/data/projects";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (typeof params?.slug === "string") {
    const post = await loadProject(params.slug);
    return post;
  }
  throw error(404, "Not found");
}
