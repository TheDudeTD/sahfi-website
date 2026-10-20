/**
 * Node-side content loader for build scripts (the website itself uses
 * app/lib/content.server.ts, which goes through Vite).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseContent } from "../app/lib/schema";

export const ROOT = resolve(import.meta.dirname, "..");
export const CONTENT_DIR = join(ROOT, "content");

const readJson = (file: string): unknown => JSON.parse(readFileSync(join(CONTENT_DIR, file), "utf8"));

/** Reads + validates all content, including that referenced image files exist. */
export function loadContent() {
  const content = parseContent({
    artist: readJson("artist.json"),
    tracks: readJson("tracks.json"),
    videos: readJson("videos.json"),
    socials: readJson("socials.json"),
    venues: readJson("venues.json"),
    sections: readJson("sections.json"),
    about: readFileSync(join(CONTENT_DIR, "about.md"), "utf8"),
  });

  const missing: string[] = [];
  if (!existsSync(join(CONTENT_DIR, "hero", content.artist.heroImage))) {
    missing.push(`content/artist.json → heroImage: content/hero/${content.artist.heroImage} does not exist`);
  }
  if (content.artist.pressPhoto && !existsSync(join(CONTENT_DIR, "gallery", content.artist.pressPhoto))) {
    missing.push(`content/artist.json → pressPhoto: content/gallery/${content.artist.pressPhoto} does not exist`);
  }
  if (missing.length) throw new Error(`Invalid content:\n${missing.map((m) => `  • ${m}`).join("\n")}`);

  return content;
}

/** Image files in a content subfolder, sorted the same way the website sorts them. */
export function listImages(folder: "gallery" | "hero"): string[] {
  return readdirSync(join(CONTENT_DIR, folder))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => join(CONTENT_DIR, folder, f));
}
