import { z } from "zod";

export const Metadata = z.object({
  title: z.string(),
  seoTitle: z.string(),
  slug: z.string(),
  abstract: z.string(),
  isPublished: z.boolean(),
  publishedOn: z.string(),
});

export type Metadata = z.infer<typeof Metadata>;
