import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import { assertImageAssetFilename } from "./images";
import type { ImageAssetFilename } from "./images";

type Frontmatter = {
  title: string;
  seoTitle: string;
  abstract: string;
  cardFilename?: string;
  cardAlt?: string;
  imageFilename?: string;
  imageAlt?: string;
  isPublished: boolean;
  publishedOn: string;
  updatedOn?: string;
};

export type Metadata = Omit<Frontmatter, "imageFilename"> & {
  imageFilename?: ImageAssetFilename;
};

export type MarkdownEntry = {
  slug: string;
  metadata: Metadata;
  Content: AstroComponentFactory;
};

type MarkdownModule = {
  frontmatter: Frontmatter;
  default: AstroComponentFactory;
};

function slugFromPath(path: string) {
  const match = /\/([\w-]+)\.md$/.exec(path);

  if (!match) {
    throw new Error(`Unable to parse markdown slug from ${path}`);
  }

  return match[1];
}

function validateMetadata(metadata: Frontmatter, context: string): Metadata {
  if (metadata.imageFilename) {
    assertImageAssetFilename(metadata.imageFilename, context);

    if (!metadata.imageAlt && !metadata.cardAlt) {
      throw new Error(
        `Image asset in ${context} must define imageAlt or cardAlt: ${metadata.imageFilename}`,
      );
    }
  }

  return metadata as Metadata;
}

function normalizeEntries(modules: Record<string, MarkdownModule>) {
  return Object.entries(modules).map(([path, module]) => ({
    slug: slugFromPath(path),
    metadata: validateMetadata(module.frontmatter, path),
    Content: module.default,
  }));
}

function byPublishedDateDescending(a: MarkdownEntry, b: MarkdownEntry) {
  return (
    new Date(b.metadata.publishedOn).getTime() -
    new Date(a.metadata.publishedOn).getTime()
  );
}

export function getPosts() {
  const modules = import.meta.glob<MarkdownModule>("../../posts/*.md", {
    eager: true,
  });

  return normalizeEntries(modules)
    .filter((entry) => entry.metadata.isPublished)
    .sort(byPublishedDateDescending);
}

export function getProjects() {
  const modules = import.meta.glob<MarkdownModule>("../../projects/*.md", {
    eager: true,
  });

  return normalizeEntries(modules)
    .filter((entry) => entry.metadata.isPublished)
    .sort(byPublishedDateDescending);
}
