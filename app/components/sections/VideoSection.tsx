import type { Video } from "~/lib/schema";
import { Section } from "../ui/Section";
import { YouTubeEmbed } from "../ui/YouTubeEmbed";

interface VideoSectionProps {
  id: string;
  title: string;
  videos: Video[];
}

/** Grid of YouTube videos. Used for both "Live Sets" and "Videos". */
export function VideoSection({ id, title, videos }: VideoSectionProps) {
  return (
    <Section id={id} title={title}>
      <ul className="grid gap-8 md:grid-cols-2 lg:gap-10">
        {videos.map((video) => (
          <li key={video.url}>
            <YouTubeEmbed url={video.url} title={video.title} />
            <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide md:text-2xl">
              {video.title}
            </h3>
          </li>
        ))}
      </ul>
    </Section>
  );
}
