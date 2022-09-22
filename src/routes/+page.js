import { ZodError } from "zod";
import { sortBy, reverse } from "lodash-es";

import { importPosts } from "./import-posts";
import { Metadata } from "$lib/schema/metadata-schema";

/** @type {import('./$types').PageLoad} */
export async function load() {
  const posts = await importPosts();

  const metadata = [];

  for (const post of posts) {
    try {
      metadata.push(Metadata.parse(post.metadata));
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
      } else {
        throw error;
      }
    }
  }
  return {
    posts: reverse(
      sortBy(
        metadata
          .filter((data) => data.isPublished)
          .map((data) => {
            return {
              ...data,
              publishedOn: new Date(data.publishedOn),
            };
          }),
        (post) => {
          return post.publishedOn.getTime();
        }
      )
    ),
  };
}
