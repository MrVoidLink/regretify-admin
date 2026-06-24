import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,67,255,0.12)_0%,rgba(255,255,255,0)_34%)]" />
      <div className="relative z-10 w-full max-w-5xl">{children}</div>
    </main>
  );
}
