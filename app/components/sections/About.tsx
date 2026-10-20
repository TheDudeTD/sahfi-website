import type { Artist } from "~/lib/schema";
import type { ResponsiveImage } from "~/lib/images";
import { Section } from "../ui/Section";

interface AboutProps {
  id: string;
  title: string;
  artist: Artist;
  /** Bio rendered from content/about.md */
  html: string;
  photo?: ResponsiveImage;
}

export function About({ id, title, artist, html, photo }: AboutProps) {
  return (
    <Section id={id} title={title}>
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        {photo && (
          <img
            src={photo.src}
            srcSet={photo.srcset}
            sizes="(min-width: 1024px) 40vw, 100vw"
            width={photo.w}
            height={photo.h}
            alt={`${artist.name} press photo`}
            loading="lazy"
            className="aspect-4/5 w-full object-cover grayscale lg:col-span-5"
          />
        )}
        <div className={photo ? "lg:col-span-7" : "lg:col-span-12 lg:max-w-3xl"}>
          <div className="prose-bio" dangerouslySetInnerHTML={{ __html: html }} />
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 text-sm">
            {artist.location && (
              <div>
                <dt className="mb-1 uppercase tracking-[0.2em] text-subtle">Based in</dt>
                <dd>{artist.location}</dd>
              </div>
            )}
            {artist.genres.length > 0 && (
              <div>
                <dt className="mb-1 uppercase tracking-[0.2em] text-subtle">Genres</dt>
                <dd>{artist.genres.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </Section>
  );
}
