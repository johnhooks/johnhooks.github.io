import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import * as z from "astro/zod";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const imageAssetFilenameSchema = z.enum([
  "computer_512.png",
  "highlighter_512.jpg",
  "johnhooks_avatar_512.jpg",
]);

const httpUrlSchema = z.url().refine(
  (value) => {
    const protocol = new URL(value).protocol;

    return protocol === "http:" || protocol === "https:";
  },
  { message: "URL must use http or https." },
);

const datedContentSchema = z.object({
  title: z.string(),
  seoTitle: z.string(),
  abstract: z.string(),
  cardFilename: z.string().optional(),
  cardAlt: z.string().optional(),
  imageFilename: imageAssetFilenameSchema.optional(),
  imageAlt: z.string().optional(),
  isPublished: z.boolean(),
  isListed: z.boolean().optional(),
  publishedOn: z.coerce.date(),
  updatedOn: z.coerce.date().optional(),
  sourceUrl: httpUrlSchema.optional(),
  sourceLabel: z.string().optional(),
  writingSourcePath: z.string().optional(),
});

const nowhereErrorCodeSchema = z.enum([
  "nowhere.unknown_error",
  "nowhere.quote.bits_invalid",
  "nowhere.quote.collection_empty",
  "nowhere.quote.depth_invalid",
  "nowhere.quote.depth_out_of_bounds",
  "nowhere.quote.journey_state_incomplete",
  "nowhere.quote.root_seed_not_found",
  "nowhere.quote.route_mismatch",
]);

const quotes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/quotes" }),
  schema: z.object({
    slug: slugSchema,
    title: z.string(),
    author: z.string(),
    work: z.string(),
    sourceName: z.string(),
    sourceUrl: httpUrlSchema,
    license: z.string(),
    retrievedOn: z.coerce.date(),
    tags: z.array(z.string()).nonempty(),
    signal: z.object({
      color: z.string(),
      mood: z.string(),
    }),
  }),
});

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
    schema: datedContentSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: datedContentSchema,
  }),
  quotes,
  nowhereErrors: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/nowhere-errors",
    }),
    schema: z.object({
      code: nowhereErrorCodeSchema,
      title: z.string(),
      description: z.string(),
    }),
  }),
};
