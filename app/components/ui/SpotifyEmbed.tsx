import { spotifyEmbedUrl } from "~/lib/embeds";

interface SpotifyEmbedProps {
  url: string;
  title: string;
}

/** Official Spotify player. Compact (152px) on phones, full (352px) from tablet up. */
export function SpotifyEmbed({ url, title }: SpotifyEmbedProps) {
  const src = spotifyEmbedUrl(url);
  if (!src) return null;
  return (
    <iframe
      src={src}
      title={`${title} on Spotify`}
      className="block h-[152px] w-full rounded-xl border-0 md:h-[352px]"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
