/**
 * Shape of every file in `content/`. The build fails with a readable error
 * if a content file doesn't match, so a typo never reaches the live site.
 *
 * Pure module (no Vite-specific imports) so it can also be used by the
 * Node scripts in `scripts/`.
 */
import { z } from "zod";
import { parseSpotifyUrl, parseYouTubeId } from "./embeds";

export const SECTION_IDS = [
  "tracks",
  "liveSets",
  "videos",
  "about",
  "playedAt",
  "gallery",
  "download",
  "contact",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SOCIAL_PLATFORMS = [
  "instagram",
  "youtube",
  "soundcloud",
  "spotify",
  "tiktok",
  "facebook",
  "x",
  "beatport",
  "mixcloud",
  "appleMusic",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

const imageFile = z
  .string()
  .regex(/^[\w.-]+\.(jpe?g|png|webp)$/i, "must be an image file name like 01.jpg");

export const artistSchema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  genres: z.array(z.string()).default([]),
  location: z.string().optional(),
  email: z.email(),
  /** File name inside content/hero/ */
  heroImage: imageFile,
  /** File name inside content/gallery/ — shown next to the bio */
  pressPhoto: imageFile.optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    siteUrl: z.url(),
  }),
});

export const trackSchema = z.object({
  title: z.string().min(1),
  spotifyUrl: z
    .url()
    .refine((u) => parseSpotifyUrl(u) !== null, "is not a valid open.spotify.com link"),
});

export const videoSchema = z.object({
  title: z.string().min(1),
  url: z.url().refine((u) => parseYouTubeId(u) !== null, "is not a valid YouTube link"),
});

export const videosSchema = z.object({
  liveSets: z.array(videoSchema),
  featured: z.array(videoSchema),
});

export const socialSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.url(),
});

export const sectionsSchema = z.array(
  z.object({
    id: z.enum(SECTION_IDS),
    enabled: z.boolean(),
  }),
);

export const contentSchema = z.object({
  artist: artistSchema,
  tracks: z.array(trackSchema),
  videos: videosSchema,
  socials: z.array(socialSchema),
  venues: z.array(z.string().min(1)),
  sections: sectionsSchema,
  about: z.string(),
});

export type Artist = z.infer<typeof artistSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Content = z.infer<typeof contentSchema>;

/** Validates raw content and throws an error that points at the broken file/field. */
export function parseContent(raw: Record<keyof Content, unknown>): Content {
  const result = contentSchema.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((issue) => {
      const [file, ...path] = issue.path;
      const fileName = file === "about" ? "about.md" : `${String(file)}.json`;
      // Show list positions the way a person counts them: item #1, #2, ...
      const where = path.length
        ? ` → ${path.map((p) => (typeof p === "number" ? `item #${p + 1}` : String(p))).join(" → ")}`
        : "";
      return `  • content/${fileName}${where}: ${issue.message}`;
    });
    throw new Error(`Invalid content:\n${lines.join("\n")}`);
  }
  return result.data;
}
