type MdsvexModules = Record<string, () => Promise<typeof import("*.md")>>;

/**
 * Import mdsvex modules from the posts directory
 *
 * NOTE: The type checker wasn't connecting the dots between the "*.md" module declaration
 * and the glob import so its explicit in this function.
 */
export async function importPosts() {
  // https://vitejs.dev/guide/features.html#glob-import
  const modules = import.meta.glob("../posts/*.md") as MdsvexModules;
  const mdsvex = await Promise.all(Object.entries(modules).map(([, mod]) => mod()));
  return mdsvex;
}
