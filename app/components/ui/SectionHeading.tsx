interface SectionHeadingProps {
  title: string;
  /** Small label above the title, e.g. "EPK" */
  eyebrow?: string;
  className?: string;
}

export function SectionHeading({ title, eyebrow, className = "" }: SectionHeadingProps) {
  return (
    <header className={`mb-10 md:mb-14 ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-subtle">{eyebrow}</p>
      )}
      <h2 className="font-display-tight text-5xl font-bold sm:text-6xl lg:text-7xl">{title}</h2>
    </header>
  );
}
