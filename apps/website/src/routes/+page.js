import { sortBy, reverse } from "lodash-es";

import { loadPosts } from "$lib/data/posts";

/** @type {import('./$types').PageLoad} */
export async function load() {
  const posts = await loadPosts();

  return {
    posts: reverse(
      sortBy(
        posts
          .filter((post) => post.isPublished)
          .map((post) => {
            return {
              ...post,
              publishedOn: new Date(post.publishedOn),
            };
          }),
        (post) => {
          return post.publishedOn.getTime();
        }
      )
    ),
  };
}
