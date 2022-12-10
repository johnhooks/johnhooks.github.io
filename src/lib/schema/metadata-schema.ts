import { z } from "zod";

export const Frontmatter = z.object({
  title: z.string(),
  seoTitle: z.string(),
  abstract: z.string(),
  isPublished: z.boolean(),
  publishedOn: z.string(),
  updatedOn: z.string().optional(),
});

export type Frontmatter = z.infer<typeof Frontmatter>;

export const Metadata = Frontmatter.extend({
  slug: z.string(),
});

export type Metadata = z.infer<typeof Metadata>;
