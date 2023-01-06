import { sortBy, reverse } from "lodash-es";

import { loadPosts } from "$lib/data/posts";
import { loadProjects } from "$lib/data/projects";

/** @type {import('./$types').PageLoad} */
export async function load() {
  const posts = await loadPosts();
  const projects = await loadProjects();

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
    projects: reverse(
      sortBy(
        projects
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
