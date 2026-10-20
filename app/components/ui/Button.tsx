import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-muted",
  outline: "border border-fg text-fg hover:bg-fg hover:text-bg",
};

/** Link styled as a button (all CTAs on the site are navigations/downloads). */
export function Button({ href, variant = "solid", className = "", children, ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
