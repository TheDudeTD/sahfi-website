import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { parseYouTubeId } from "~/lib/embeds";

interface YouTubeEmbedProps {
  url: string;
  title: string;
}

/**
 * Lightweight YouTube player: shows the thumbnail and only loads the real
 * YouTube iframe when clicked (much faster on mobile).
 */
export function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const id = parseYouTubeId(url);
  if (!id) return null;
  return (
    <div className="overflow-hidden bg-surface">
      <LiteYouTubeEmbed id={id} title={title} poster="hqdefault" noCookie />
    </div>
  );
}
