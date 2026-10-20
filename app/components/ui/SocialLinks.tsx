import type { Social } from "~/lib/schema";
import { SocialIcon, platformLabels } from "./SocialIcon";

interface SocialLinksProps {
  socials: Social[];
  /** "icons" = round icon buttons, "list" = icon + label rows */
  variant?: "icons" | "list";
  className?: string;
}

export function SocialLinks({ socials, variant = "icons", className = "" }: SocialLinksProps) {
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {socials.map(({ platform, url }) => (
        <li key={url}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={variant === "icons" ? `SAHFI on ${platformLabels[platform]}` : undefined}
            className={
              variant === "icons"
                ? "flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
                : "flex min-h-12 items-center gap-3 border border-line px-5 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:border-fg"
            }
          >
            <SocialIcon platform={platform} />
            {variant === "list" && platformLabels[platform]}
          </a>
        </li>
      ))}
    </ul>
  );
}
