import { getCollection, render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import type { ImageAssetFilename } from "./images";

type DatedCollectionKey = "posts" | "projects";
type DatedContentCollectionEntry = CollectionEntry<"posts"> | CollectionEntry<"projects">;

export type Metadata = DatedContentCollectionEntry["data"] & {
  imageFilename?: ImageAssetFilename;
};

export type ContentSummary = {
  slug: string;
  metadata: Metadata;
};

export type ContentEntry = ContentSummary & {
  Content: AstroComponentFactory;
};

type MarkdownModule = {
  default: AstroComponentFactory;
};

function validateMetadata(
  metadata: DatedContentCollectionEntry["data"],
  context: string,
): Metadata {
  if (metadata.imageFilename && !metadata.imageAlt && !metadata.cardAlt) {
    throw new Error(
      `Image asset in ${context} must define imageAlt or cardAlt: ${metadata.imageFilename}`,
    );
  }

  return metadata;
}

function normalizeSummary(entry: DatedContentCollectionEntry) {
  return {
    slug: entry.id,
    metadata: validateMetadata(entry.data, entry.id),
  } satisfies ContentSummary;
}

async function normalizeEntry(entry: DatedContentCollectionEntry) {
  const { Content } = await render(entry);

  return {
    ...normalizeSummary(entry),
    Content,
  } satisfies ContentEntry;
}

function byPublishedDateDescending(a: ContentSummary, b: ContentSummary) {
  return b.metadata.publishedOn.getTime() - a.metadata.publishedOn.getTime();
}

async function getPublishedEntries(collection: DatedCollectionKey) {
  return getCollection(collection, (entry) => entry.data.isPublished);
}

async function getDatedContent(collection: DatedCollectionKey) {
  const entries = await getPublishedEntries(collection);
  const normalizedEntries = await Promise.all(entries.map(normalizeEntry));

  return normalizedEntries.sort(byPublishedDateDescending);
}

async function getDatedContentSummaries(collection: DatedCollectionKey) {
  const entries = await getPublishedEntries(collection);

  return entries.map(normalizeSummary).sort(byPublishedDateDescending);
}

export function getPosts() {
  return getDatedContent("posts");
}

export async function getListedPosts() {
  return (await getDatedContentSummaries("posts")).filter(
    (entry) => entry.metadata.isListed !== false,
  );
}

export function getProjects() {
  return getDatedContent("projects");
}

export async function getListedProjects() {
  return (await getDatedContentSummaries("projects")).filter(
    (entry) => entry.metadata.isListed !== false,
  );
}

export function getHomeCurrent() {
  const modules = import.meta.glob<MarkdownModule>("../../home/current.md", {
    eager: true,
  });
  const module = modules["../../home/current.md"];

  if (!module) {
    throw new Error("Missing home current note at src/home/current.md");
  }

  return module.default;
}
