/**
 * Section registry — the single place that maps a section id to its React component.
 *
 * - Order and visibility come from content/sections.json.
 * - `label` is the heading on the page and the entry in the header's EPK dropdown.
 * - To swap a section's design, point `render` at a different component.
 * - To add a section: create a component, add its id to SECTION_IDS (app/lib/schema.ts),
 *   add an entry here and list it in content/sections.json.
 */
import type { ReactNode } from "react";
import { About } from "~/components/sections/About";
import { Contact } from "~/components/sections/Contact";
import { DownloadEpk } from "~/components/sections/DownloadEpk";
import { FeaturedTracks } from "~/components/sections/FeaturedTracks";
import { Gallery } from "~/components/sections/Gallery";
import { PlayedAt } from "~/components/sections/PlayedAt";
import { VideoSection } from "~/components/sections/VideoSection";
import { findImage, galleryImages } from "~/lib/images";
import type { Content, SectionId } from "~/lib/schema";

/** Everything a section may need, as produced by the home route loader. */
export interface SiteData {
  content: Content;
  aboutHtml: string;
}

interface SectionDefinition {
  label: string;
  /** Hide the section automatically when it has nothing to show */
  isEmpty?: (data: SiteData) => boolean;
  render: (data: SiteData, id: SectionId, label: string) => ReactNode;
}

export const sectionRegistry: Record<SectionId, SectionDefinition> = {
  tracks: {
    label: "Featured Tracks",
    isEmpty: ({ content }) => content.tracks.length === 0,
    render: ({ content }, id, label) => <FeaturedTracks id={id} title={label} tracks={content.tracks} />,
  },
  liveSets: {
    label: "Live Sets",
    isEmpty: ({ content }) => content.videos.liveSets.length === 0,
    render: ({ content }, id, label) => <VideoSection id={id} title={label} videos={content.videos.liveSets} />,
  },
  videos: {
    label: "Videos",
    isEmpty: ({ content }) => content.videos.featured.length === 0,
    render: ({ content }, id, label) => <VideoSection id={id} title={label} videos={content.videos.featured} />,
  },
  about: {
    label: "About",
    isEmpty: ({ content }) => content.about.trim() === "",
    render: ({ content, aboutHtml }, id, label) => (
      <About
        id={id}
        title={label}
        artist={content.artist}
        html={aboutHtml}
        photo={findImage(galleryImages, content.artist.pressPhoto)}
      />
    ),
  },
  playedAt: {
    label: "Played At",
    isEmpty: ({ content }) => content.venues.length === 0,
    render: ({ content }, id, label) => <PlayedAt id={id} title={label} venues={content.venues} />,
  },
  gallery: {
    label: "Gallery",
    isEmpty: () => galleryImages.length === 0,
    render: ({ content }, id, label) => (
      <Gallery id={id} title={label} images={galleryImages} artistName={content.artist.name} />
    ),
  },
  download: {
    label: "Download EPK",
    render: ({ content }, id) => <DownloadEpk id={id} artistName={content.artist.name} />,
  },
  contact: {
    label: "Contact",
    render: ({ content }, id, label) => (
      <Contact id={id} title={label} email={content.artist.email} socials={content.socials} />
    ),
  },
};

export interface ActiveSection {
  id: SectionId;
  label: string;
  /** Link to a file instead of the in-page anchor (rendered with `download`) */
  href?: string;
}

/** Enabled, non-empty sections in the order given by content/sections.json. */
export function getActiveSections(data: SiteData): ActiveSection[] {
  return data.content.sections
    .filter(({ id, enabled }) => enabled && !sectionRegistry[id].isEmpty?.(data))
    .map(({ id }) => ({ id, label: sectionRegistry[id].label }));
}
