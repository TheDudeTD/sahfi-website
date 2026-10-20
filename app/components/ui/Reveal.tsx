import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Fades content up when it scrolls into view.
 * Content is visible by default (prerendered HTML / no-JS); the effect is only
 * applied after hydration, and skipped for users who prefer reduced motion.
 */
export function Reveal({ children, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion =
    state === "hidden"
      ? "translate-y-8 opacity-0"
      : state === "shown"
        ? "translate-y-0 opacity-100 transition-all duration-700 ease-out"
        : "";

  return (
    <div ref={ref} className={`${motion} ${className}`}>
      {children}
    </div>
  );
}
