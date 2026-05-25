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
  isListed?: boolean;
  publishedOn: string;
  updatedOn?: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type Metadata = Omit<Frontmatter, "imageFilename"> & {
  imageFilename?: ImageAssetFilename;
};

export type ContentEntry = {
  slug: string;
  metadata: Metadata;
  Content: AstroComponentFactory;
};

type ContentModule = {
  frontmatter: Frontmatter;
  default: AstroComponentFactory;
};

type MarkdownModule = {
  default: AstroComponentFactory;
};

function slugFromPath(path: string) {
  const match = /\/([\w-]+)\.mdx?$/.exec(path);

  if (!match) {
    throw new Error(`Unable to parse content slug from ${path}`);
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

function normalizeEntries(modules: Record<string, ContentModule>) {
  return Object.entries(modules).map(([path, module]) => ({
    slug: slugFromPath(path),
    metadata: validateMetadata(module.frontmatter, path),
    Content: module.default,
  }));
}

function byPublishedDateDescending(a: ContentEntry, b: ContentEntry) {
  return (
    new Date(b.metadata.publishedOn).getTime() -
    new Date(a.metadata.publishedOn).getTime()
  );
}

export function getPosts() {
  const modules = import.meta.glob<ContentModule>("../../posts/*.{md,mdx}", {
    eager: true,
  });

  return normalizeEntries(modules)
    .filter((entry) => entry.metadata.isPublished)
    .sort(byPublishedDateDescending);
}

export function getProjects() {
  const modules = import.meta.glob<ContentModule>("../../projects/*.{md,mdx}", {
    eager: true,
  });

  return normalizeEntries(modules)
    .filter((entry) => entry.metadata.isPublished)
    .sort(byPublishedDateDescending);
}

export function getListedProjects() {
  return getProjects().filter((entry) => entry.metadata.isListed !== false);
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
