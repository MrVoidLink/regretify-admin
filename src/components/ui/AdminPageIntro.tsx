export function AdminPageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,246,255,0.92)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[var(--color-text-soft)]">
        {description}
      </p>
    </section>
  );
}
