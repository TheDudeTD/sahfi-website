/**
 * Helpers that turn the plain links stored in `content/` into embeddable IDs/URLs.
 * Accepts the URLs you get from the "Share" buttons on Spotify and YouTube.
 */

const SPOTIFY_TYPES = ["track", "album", "playlist", "artist", "episode", "show"] as const;
export type SpotifyType = (typeof SPOTIFY_TYPES)[number];

/** https://open.spotify.com/track/ID?si=... → { type: "track", id: "ID" } */
export function parseSpotifyUrl(url: string): { type: SpotifyType; id: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "open.spotify.com") return null;
    // Paths may be prefixed with a locale, e.g. /intl-de/track/ID
    const parts = u.pathname.split("/").filter(Boolean).filter((p) => !p.startsWith("intl-"));
    const [type, id] = parts;
    if (!SPOTIFY_TYPES.includes(type as SpotifyType) || !/^[A-Za-z0-9]{22}$/.test(id ?? "")) return null;
    return { type: type as SpotifyType, id };
  } catch {
    return null;
  }
}

export function spotifyEmbedUrl(url: string): string | null {
  const parsed = parseSpotifyUrl(url);
  if (!parsed) return null;
  return `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`;
}

/**
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/live/ID,
 * youtube.com/shorts/ID, youtube.com/embed/ID
 */
export function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v");
      if (!id) {
        const match = u.pathname.match(/^\/(?:live|shorts|embed)\/([^/?]+)/);
        id = match?.[1] ?? null;
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
