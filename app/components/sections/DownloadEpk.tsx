import { EPK_PDF_PATH } from "~/config/site";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

interface DownloadEpkProps {
  id: string;
  artistName: string;
}

export function DownloadEpk({ id, artistName }: DownloadEpkProps) {
  return (
    <section id={id} className="bg-fg py-16 text-bg md:py-20">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] opacity-60">Press kit</p>
          <h2 className="font-display-tight text-4xl font-bold sm:text-5xl lg:text-6xl">
            Download the {artistName} EPK
          </h2>
        </div>
        <a
          href={EPK_PDF_PATH}
          download
          className="inline-flex min-h-12 items-center gap-3 bg-bg px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-fg transition-opacity hover:opacity-80"
        >
          Download PDF
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14" />
          </svg>
        </a>
      </Container>
    </section>
  );
}
