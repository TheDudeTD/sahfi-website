/**
 * Single entry point for site content. Everything editable lives in `content/`.
 * Validation runs at build time (prerender), so broken content fails the build.
 */
import { marked } from "marked";
import artist from "@content/artist.json";
import tracks from "@content/tracks.json";
import videos from "@content/videos.json";
import socials from "@content/socials.json";
import venues from "@content/venues.json";
import sections from "@content/sections.json";
import about from "@content/about.md?raw";
import { parseContent } from "./schema";

export const content = parseContent({ artist, tracks, videos, socials, venues, sections, about });

export const aboutHtml = marked.parse(content.about, { async: false });
