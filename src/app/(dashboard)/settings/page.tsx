import Link from "next/link";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default async function SettingsAdminPage() {
  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Settings"
        title="Settings hub"
        description="Keep settings grouped here so new admin controls can be added without crowding the main page."
      />

      <section className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-4 shadow-[0_16px_38px_rgba(24,24,27,0.04)] sm:p-5">
        <div className="grid gap-3">
          <Link
            href="/settings/operator-account"
            className="group flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--color-border)] bg-white/90 px-4 py-4 transition-colors hover:bg-[var(--color-background)]"
          >
            <div className="min-w-0">
              <p className="text-[0.96rem] font-semibold text-[var(--color-text)]">Operator account</p>
              <p className="mt-1 text-[0.84rem] leading-6 text-[var(--color-text-soft)]">
                Manage the public profile used for Market Pulse author identity.
              </p>
            </div>

            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[var(--color-brand-strong)] transition-transform group-hover:translate-x-0.5">
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
                <path d="M7 5.5 11.5 10 7 14.5" />
                <path d="M8.5 10h6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
