import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export type Metadata = {
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

export type MarkdownEntry = {
  slug: string;
  metadata: Metadata;
  Content: AstroComponentFactory;
};

type MarkdownModule = {
  frontmatter: Metadata;
  default: AstroComponentFactory;
};

function slugFromPath(path: string) {
  const match = /\/([\w-]+)\.md$/.exec(path);

  if (!match) {
    throw new Error(`Unable to parse markdown slug from ${path}`);
  }

  return match[1];
}

function normalizeEntries(modules: Record<string, MarkdownModule>) {
  return Object.entries(modules).map(([path, module]) => ({
    slug: slugFromPath(path),
    metadata: module.frontmatter,
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
