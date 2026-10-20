import type { Social } from "~/lib/schema";
import { SocialLinks } from "../ui/SocialLinks";
import { Container } from "../ui/Container";

interface FooterProps {
  artistName: string;
  email: string;
  socials: Social[];
}

export function Footer({ artistName, email, socials }: FooterProps) {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col items-center gap-6 text-center">
        <a href="#top" className="font-display-tight text-4xl font-extrabold tracking-[0.15em]">
          {artistName}
        </a>
        <SocialLinks socials={socials} className="justify-center" />
        <a href={`mailto:${email}`} className="text-sm text-muted hover:text-fg">
          {email}
        </a>
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">
          © {new Date().getFullYear()} {artistName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
