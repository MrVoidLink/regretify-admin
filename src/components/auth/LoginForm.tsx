"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/app/(auth)/login/actions";

const initialState: LoginFormState = {
  error: null,
};

export function LoginForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 grid gap-3">
      <label className="grid gap-2">
        <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Email</span>
        <input
          type="email"
          name="email"
          defaultValue={defaultEmail}
          autoComplete="username"
          className="min-h-12 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.95rem] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="min-h-12 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.95rem] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-brand)]"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-[0.86rem] text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-4 text-[0.9rem] font-semibold text-white shadow-[0_14px_28px_rgba(111,67,255,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}
