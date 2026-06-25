import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAdminSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <section className="w-full max-w-md rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_24px_56px_rgba(24,24,27,0.08)] backdrop-blur-sm">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
        Admin Access
      </p>
      <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
        Sign in to Regretify Admin
      </h1>
      <p className="mt-3 text-[0.95rem] leading-7 text-[var(--color-text-soft)]">
        This access layer is intentionally narrow. Use the seeded admin account from core to enter the dashboard.
      </p>

      <LoginForm defaultEmail="" />
    </section>
  );
}
