import type { Artist } from "~/lib/schema";
import type { ResponsiveImage } from "~/lib/images";
import { EPK_PDF_PATH } from "~/config/site";
import { Button } from "../ui/Button";

interface HeroProps {
  artist: Artist;
  image?: ResponsiveImage;
}

export function Hero({ artist, image }: HeroProps) {
  return (
    <section id="top" className="relative flex min-h-svh items-end overflow-hidden">
      {image && (
        <img
          src={image.src}
          srcSet={image.srcset}
          sizes="100vw"
          width={image.w}
          height={image.h}
          alt={`${artist.name} portrait`}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[50%_30%]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/30" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-muted sm:text-sm">
          {artist.tagline}
        </p>
        <h1 className="font-display-tight text-[26vw] font-extrabold sm:text-[20vw] lg:text-[15rem]">
          {artist.name}
        </h1>
        {artist.genres.length > 0 && (
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-muted">{artist.genres.join(" · ")}</p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="#tracks">Listen</Button>
          <Button href={EPK_PDF_PATH} variant="outline" download>
            Download EPK
          </Button>
          <Button href={`mailto:${artist.email}`} variant="outline">
            Booking
          </Button>
        </div>
      </div>
    </section>
  );
}
