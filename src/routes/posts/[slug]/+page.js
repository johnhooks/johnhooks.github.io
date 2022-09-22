import { error } from "@sveltejs/kit";
import { ZodError } from "zod";

import { Metadata } from "$lib/schema/metadata-schema";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  if (typeof params?.slug === "string") {
    try {
      const post = await import(`../../../posts/${params?.slug}.md`);
      const { abstract, seoTitle, title } = Metadata.parse(post.metadata);
      return { abstract, slug: params.slug, seoTitle, title, content: post.default };
    } catch (e) {
      if (e instanceof ZodError) {
        // TODO: Maybe handle this differently
        throw error(404, "Not Found");
      }
      throw error(404, "Not Found");
    }
  }
  throw error(404, "Not found");
}
