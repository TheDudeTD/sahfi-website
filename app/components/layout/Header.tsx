import { useCallback, useEffect, useState } from "react";
import type { ActiveSection } from "~/config/sections";
import type { Social } from "~/lib/schema";
import { SocialLinks } from "../ui/SocialLinks";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";

interface HeaderProps {
  artistName: string;
  epkItems: ActiveSection[];
  socials: Social[];
}

const navLink = "py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:text-muted";

/**
 * Sticky header: transparent over the hero, solid black once scrolled.
 * Desktop (lg+): Home + EPK dropdown | centred wordmark | contact + socials.
 * Mobile/tablet: wordmark + hamburger that opens <MobileMenu>.
 */
export function Header({ artistName, epkItems, socials }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasContact = epkItems.some((item) => item.id === "contact");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-(--header-height) transition-colors duration-300 ${
          scrolled || menuOpen ? "border-b border-line bg-bg/95 backdrop-blur" : "bg-transparent"
        }`}
      >
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            <a href="#top" className={navLink}>
              Home
            </a>
            <NavDropdown label="EPK" items={epkItems} />
          </nav>

          <a
            href="#top"
            className="col-start-1 justify-self-start font-display-tight text-3xl font-extrabold tracking-[0.15em] lg:col-start-2 lg:justify-self-center"
            onClick={closeMenu}
          >
            {artistName}
          </a>

          <div className="col-start-3 flex items-center justify-end gap-6">
            {hasContact && (
              <a href="#contact" className={`${navLink} hidden lg:block`}>
                Contact
              </a>
            )}
            <SocialLinks socials={socials} className="hidden xl:flex" />
            <button
              type="button"
              className="relative -mr-2 flex size-11 items-center justify-center lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`absolute h-0.5 w-6 bg-fg transition-transform duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-fg transition-transform duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} epkItems={epkItems} socials={socials} />
    </>
  );
}
