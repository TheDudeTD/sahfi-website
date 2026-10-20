import { Section } from "../ui/Section";

interface PlayedAtProps {
  id: string;
  title: string;
  venues: string[];
}

/** Scrolling strip of venues/events the artist has played. */
export function PlayedAt({ id, title, venues }: PlayedAtProps) {
  return (
    <Section id={id} title={title}>
      {/* Marquee on larger screens; the list is duplicated so the loop is seamless */}
      <div className="relative hidden overflow-hidden md:block" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
          {[...venues, ...venues].map((venue, i) => (
            <span key={i} className="font-display-tight text-5xl font-bold whitespace-nowrap text-muted lg:text-6xl">
              {venue}
              <span className="ml-12 text-subtle">/</span>
            </span>
          ))}
        </div>
      </div>
      {/* Readable list for phones and screen readers */}
      <ul className="flex flex-wrap gap-2 md:sr-only">
        {venues.map((venue) => (
          <li key={venue} className="border border-line px-3 py-2 text-xs uppercase tracking-[0.15em] text-muted">
            {venue}
          </li>
        ))}
      </ul>
    </Section>
  );
}
