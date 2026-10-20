import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

interface SectionProps {
  id: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/** Standard page section: anchor id, spacing, heading and scroll-in animation. */
export function Section({ id, title, eyebrow = "EPK", children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`border-t border-line py-20 md:py-28 ${className}`}>
      <Container>
        <Reveal>
          {title && <SectionHeading title={title} eyebrow={eyebrow} />}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
