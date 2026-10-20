import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { ActiveSection } from "~/config/sections";

interface NavDropdownProps {
  label: string;
  items: ActiveSection[];
}

/**
 * Desktop dropdown. Opens on hover or click; keyboard: Enter/Space/ArrowDown open,
 * arrow keys move between items, Escape closes and returns focus to the button.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  // True when the menu was just opened by hovering, so the click that usually
  // follows the hover doesn't immediately close it again.
  const openedByHoverRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const focusItem = (index: number) => {
    const links = rootRef.current?.querySelectorAll<HTMLAnchorElement>("[role=menu] a");
    if (!links?.length) return;
    links[(index + links.length) % links.length].focus();
  };

  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const links = Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("[role=menu] a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(current - 1);
    }
  };

  const onRootKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => {
        if (!open) openedByHoverRef.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        openedByHoverRef.current = false;
        setOpen(false);
      }}
      onKeyDown={onRootKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => {
          if (openedByHoverRef.current) {
            openedByHoverRef.current = false;
            return;
          }
          setOpen((v) => !v);
        }}
        onKeyDown={onButtonKeyDown}
        className="flex items-center gap-1.5 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-colors hover:text-muted"
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* pt-3 bridges the gap so hover isn't lost between button and menu */}
      <div className={`absolute top-full left-0 pt-3 ${open ? "block" : "hidden"}`}>
        <ul
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className="min-w-56 border border-line bg-bg/95 py-2 shadow-2xl backdrop-blur"
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <a
                role="menuitem"
                href={item.href ?? `#${item.id}`}
                    download={item.href ? true : undefined}
                onClick={() => setOpen(false)}
                className="block px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-muted transition-colors hover:bg-surface hover:text-fg focus:bg-surface focus:text-fg focus:outline-none"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
