import type { Social } from "~/lib/schema";
import { Section } from "../ui/Section";
import { SocialLinks } from "../ui/SocialLinks";

interface ContactProps {
  id: string;
  title: string;
  email: string;
  socials: Social[];
}

export function Contact({ id, title, email, socials }: ContactProps) {
  return (
    <Section id={id} title={title}>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-subtle">Bookings & press</p>
          {/* mailto: opens the visitor's default email app */}
          <a
            href={`mailto:${email}`}
            className="font-display-tight text-3xl font-bold normal-case break-all underline-offset-8 hover:underline sm:text-5xl"
          >
            {email}
          </a>
        </div>
        {socials.length > 0 && (
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-subtle">Follow</p>
            <SocialLinks socials={socials} variant="list" />
          </div>
        )}
      </div>
    </Section>
  );
}
