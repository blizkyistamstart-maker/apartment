export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terra-600">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 text-lg leading-relaxed text-ink-500">{intro}</p>
          ) : null}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
