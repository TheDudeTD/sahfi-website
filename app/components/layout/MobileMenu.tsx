import { useEffect, useState } from "react";
import type { ActiveSection } from "~/config/sections";
import type { Social } from "~/lib/schema";
import { SocialLinks } from "../ui/SocialLinks";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  epkItems: ActiveSection[];
  socials: Social[];
}

/** Full-screen navigation overlay for phones and tablets (< lg). */
export function MobileMenu({ open, onClose, epkItems, socials }: MobileMenuProps) {
  const [epkOpen, setEpkOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const linkClass = "block py-2 font-display-tight text-5xl font-bold sm:text-6xl";

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-4 pt-[calc(var(--header-height)+1.5rem)] pb-10 transition-opacity duration-300 sm:px-6 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      <nav aria-label="Mobile" className="flex-1">
        <ul className="space-y-2">
          <li>
            <a href="#top" onClick={onClose} className={linkClass}>
              Home
            </a>
          </li>
          <li>
            <button
              type="button"
              aria-expanded={epkOpen}
              aria-controls="mobile-epk-list"
              onClick={() => setEpkOpen((v) => !v)}
              className={`${linkClass} flex w-full items-center justify-between text-left`}
            >
              EPK
              <svg
                viewBox="0 0 24 24"
                className={`size-8 transition-transform ${epkOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <ul id="mobile-epk-list" hidden={!epkOpen} className="mt-2 mb-4 space-y-1 border-l border-line pl-5">
              {epkItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href ?? `#${item.id}`}
                    download={item.href ? true : undefined}
                    onClick={onClose}
                    className="block py-2 text-lg uppercase tracking-[0.15em] text-muted hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      {socials.length > 0 && <SocialLinks socials={socials} className="mt-10" />}
    </div>
  );
}
