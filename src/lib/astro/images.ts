import type { ImageMetadata } from "astro";

import computer512 from "../../assets/images/computer_512.png";
import highlighter512 from "../../assets/images/highlighter_512.jpg";
import johnhooksAvatar512 from "../../assets/images/johnhooks_avatar_512.jpg";

export const imageAssets = {
  "computer_512.png": computer512,
  "highlighter_512.jpg": highlighter512,
  "johnhooks_avatar_512.jpg": johnhooksAvatar512,
} satisfies Record<string, ImageMetadata>;

export type ImageAssetFilename = keyof typeof imageAssets;

export function isImageAssetFilename(filename: string): filename is ImageAssetFilename {
  return filename in imageAssets;
}

export function assertImageAssetFilename(
  filename: string,
  context: string,
): asserts filename is ImageAssetFilename {
  if (!isImageAssetFilename(filename)) {
    throw new Error(`Unknown image asset in ${context}: ${filename}`);
  }
}
