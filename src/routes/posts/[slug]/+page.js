import { error } from "@sveltejs/kit";

import { loadPost } from "$lib/data/posts";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (typeof params?.slug === "string") {
    const post = await loadPost(params.slug);
    return post;
  }
  throw error(404, "Not found");
}
