export default function LoginPage() {
  return (
    <section className="w-full max-w-md rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_24px_56px_rgba(24,24,27,0.08)] backdrop-blur-sm">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
        Admin Access
      </p>
      <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
        Sign in to Regretify Admin
      </h1>
      <p className="mt-3 text-[0.95rem] leading-7 text-[var(--color-text-soft)]">
        Authentication wiring is not connected yet. This route is the placeholder entry for the internal dashboard flow.
      </p>

      <div className="mt-6 grid gap-3">
        <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text-soft)]">
          admin@regretify.app
        </div>
        <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text-soft)]">
          Password
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-4 text-[0.9rem] font-semibold text-white shadow-[0_14px_28px_rgba(111,67,255,0.24)]"
        >
          Continue
        </button>
      </div>
    </section>
  );
}
