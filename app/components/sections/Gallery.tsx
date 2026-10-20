import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ResponsiveImage } from "~/lib/images";
import { Section } from "../ui/Section";

interface GalleryProps {
  id: string;
  title: string;
  images: ResponsiveImage[];
  artistName: string;
}

export function Gallery({ id, title, images, artistName }: GalleryProps) {
  const [index, setIndex] = useState(-1);

  return (
    <Section id={id} title={title}>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <li key={image.file}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden bg-surface"
              aria-label={`Open photo ${i + 1} of ${images.length}`}
            >
              <img
                src={image.src}
                srcSet={image.srcset}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                width={image.w}
                height={image.h}
                alt={`${artistName} photo ${i + 1}`}
                loading="lazy"
                className="aspect-4/5 w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((image) => ({ src: image.src, width: image.w, height: image.h }))}
      />
    </Section>
  );
}
