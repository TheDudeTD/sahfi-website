/**
 * Picks up every image dropped into content/gallery/ and content/hero/ automatically.
 * vite-imagetools converts each to responsive WebP sizes at build time.
 *
 * Gallery order = file name order (01.jpg, 02.jpg, ...).
 */

export interface ResponsiveImage {
  /** File name in content/, e.g. "01.jpg" — used as the key in content JSON */
  file: string;
  /** Largest WebP version */
  src: string;
  srcset: string;
  w: number;
  h: number;
}

interface ImgOutput {
  src: string;
  srcset: string;
  w: number;
  h: number;
}

const galleryModules = import.meta.glob<ImgOutput>("/content/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: { w: "480;960;1600", format: "webp", as: "img" },
});

const heroModules = import.meta.glob<ImgOutput>("/content/hero/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: { w: "768;1440;2000", format: "webp", as: "img" },
});

function toList(modules: Record<string, ImgOutput>): ResponsiveImage[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, img]) => ({ ...img, file: path.split("/").pop()! }));
}

export const galleryImages = toList(galleryModules);
export const heroImages = toList(heroModules);

export function findImage(list: ResponsiveImage[], file: string | undefined) {
  return file ? list.find((img) => img.file === file) : undefined;
}
