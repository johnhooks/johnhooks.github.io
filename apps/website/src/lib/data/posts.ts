import { error } from "@sveltejs/kit";
import { ZodError } from "zod";

import { Frontmatter, Metadata } from "$lib/schema/metadata-schema";

type MdsvexModule = typeof import("*.md");
type Post = { content: MdsvexModule["default"] } & Metadata;

/**
 * Load all mdsvex modules from the src/posts directory
 *
 * @returns A Promise of an array of posts, throws an error if:
 *  * a post file name doesn't match `/[-\w]\.md/`
 *  * or a module fails to load
 *
 * NOTE: Mdsvex files that have malformed frontmatter are skipped
 */
export async function loadPosts(): Promise<Post[]> {
  // https://vitejs.dev/guide/features.html#glob-import
  // NOTE: The type checker wasn't connecting the dots between the "*.md" module declaration
  // and the glob import so its explicit in this function.
  const modules = import.meta.glob("../../posts/*.md") as Record<
    string,
    () => Promise<MdsvexModule>
  >;

  const mdsvex = (await Promise.all(
    Object.entries(modules).map(([filePath, promise]) => {
      const match = /\.\.\/\.\.\/posts\/([-\w]+)\.md$/.exec(filePath);
      if (match) {
        const slug = match[1];

        return promise()
          .then((mod) => [slug, mod])
          .catch((error) => {
            throw error;
          });
      } else {
        throw new Error(`error parsing slug from ${filePath}`);
      }
    })
  )) as [string, MdsvexModule][];

  return mdsvex
    .map(([slug, mod]): Post | null => {
      try {
        const frontmatter = Frontmatter.parse(mod.metadata);
        return { ...frontmatter, slug, content: mod.default };
      } catch (e) {
        if (e instanceof ZodError) {
          // If post metadata is malformed don't push it into the array
          // TODO: Should find a better way to log the error
          console.log(e);
          return null;
        }
        throw e;
      }
    })
    .filter((value) => value !== null) as Post[];
}

/**
 * Load a single mdsvex module from the src/posts directory
 *
 * @param slug - The slug of the post
 * @returns A Promise of the post or throws a not found error
 */
export async function loadPost(slug: string): Promise<Post> {
  try {
    const module = (await import(`../../posts/${slug}.md`)) as MdsvexModule;
    const frontmatter = Frontmatter.parse(module.metadata);
    return { ...frontmatter, slug, content: module.default };
  } catch (e) {
    if (e instanceof ZodError) {
      // TODO: Maybe handle this differently
      throw error(404, "Not Found");
    }
    throw error(404, "Not Found");
  }
}
