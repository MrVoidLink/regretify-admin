import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/(dashboard)/actions";
import { adminNavigationItems } from "@/lib/config/adminNavigation";
import type { AdminProfile } from "@/types/admin";

export function AdminShell({
  children,
  session,
}: {
  children: ReactNode;
  session: AdminProfile;
}) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[96rem] gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_20px_48px_rgba(24,24,27,0.06)] backdrop-blur-sm">
          <div className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(111,67,255,0.1)_0%,rgba(255,255,255,0.9)_100%)] px-4 py-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              Regretify
            </p>
            <h1 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
              Admin
            </h1>
            <p className="mt-2 text-[0.82rem] leading-6 text-[var(--color-text-soft)]">
              Internal operating surface for content, assets, monetization, and settings.
            </p>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-[color:var(--color-border)] bg-white/80 px-4 py-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
              Signed In
            </p>
            <p className="mt-2 text-[0.92rem] font-medium text-[var(--color-text)]">{session.email}</p>
            <p className="mt-1 text-[0.8rem] capitalize text-[var(--color-text-soft)]">{session.role}</p>
          </div>

          <nav className="mt-6 grid gap-2">
            {adminNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-[1rem] border border-transparent px-3.5 text-[0.88rem] font-medium text-[var(--color-text-soft)] transition-colors hover:border-[color:var(--color-border)] hover:bg-white hover:text-[var(--color-text)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAction} className="mt-6">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[1rem] border border-[color:var(--color-border)] bg-white px-3.5 text-[0.88rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)]"
            >
              Sign out
            </button>
          </form>
        </aside>

        <main className="rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_20px_48px_rgba(24,24,27,0.06)] backdrop-blur-sm sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
