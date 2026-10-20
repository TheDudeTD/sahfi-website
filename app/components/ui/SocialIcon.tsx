import {
  siApplemusic,
  siBeatport,
  siFacebook,
  siInstagram,
  siMixcloud,
  siSoundcloud,
  siSpotify,
  siTiktok,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import type { SocialPlatform } from "~/lib/schema";

const icons: Record<SocialPlatform, SimpleIcon> = {
  instagram: siInstagram,
  youtube: siYoutube,
  soundcloud: siSoundcloud,
  spotify: siSpotify,
  tiktok: siTiktok,
  facebook: siFacebook,
  x: siX,
  beatport: siBeatport,
  mixcloud: siMixcloud,
  appleMusic: siApplemusic,
};

export const platformLabels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  spotify: "Spotify",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  beatport: "Beatport",
  mixcloud: "Mixcloud",
  appleMusic: "Apple Music",
};

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
}

export function SocialIcon({ platform, className = "size-5" }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={icons[platform].path} />
    </svg>
  );
}
