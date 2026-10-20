import type { Track } from "~/lib/schema";
import { Section } from "../ui/Section";
import { SpotifyEmbed } from "../ui/SpotifyEmbed";

interface FeaturedTracksProps {
  id: string;
  title: string;
  tracks: Track[];
}

export function FeaturedTracks({ id, title, tracks }: FeaturedTracksProps) {
  return (
    <Section id={id} title={title}>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tracks.map((track) => (
          <li key={track.spotifyUrl}>
            <SpotifyEmbed url={track.spotifyUrl} title={track.title} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
