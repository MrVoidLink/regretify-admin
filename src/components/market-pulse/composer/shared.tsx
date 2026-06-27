import type { ReactNode } from "react";

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[1.02rem] font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="text-[0.84rem] leading-6 text-[var(--color-text-soft)]">{description}</p>
      </div>
      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">{label}</span>
      {children}
    </div>
  );
}

export function textInputClassName() {
  return "min-h-11 w-full min-w-0 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.92rem] text-[var(--color-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--color-brand)]";
}

export function textareaClassName() {
  return "min-h-28 w-full min-w-0 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.92rem] leading-6 text-[var(--color-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--color-brand)]";
}

export function EyeIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.2 10s2.8-4.5 7.8-4.5 7.8 4.5 7.8 4.5-2.8 4.5-7.8 4.5S2.2 10 2.2 10Z" />
      <circle cx="10" cy="10" r="2.1" />
    </svg>
  );
}

export function HeartIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 16.8 4 12.1a3.8 3.8 0 0 1 5.2-5.5L10 7.4l.8-.8A3.8 3.8 0 0 1 16 12.1Z" />
    </svg>
  );
}

export function SaveIcon({
  className = "h-3.5 w-3.5",
  isSaved = false,
}: {
  className?: string;
  isSaved?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill={isSaved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 3.5h9v13l-4.5-2.8-4.5 2.8Z" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.5 4.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" />
      <path d="M4.5 11.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" />
      <path d="M14.5 19.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" />
      <path d="m6.5 8.6 4.1-2.2" />
      <path d="m6.5 10.4 6 3.2" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.5 5.5 7 10l4.5 4.5" />
      <path d="M7.5 10h7.5" />
    </svg>
  );
}
