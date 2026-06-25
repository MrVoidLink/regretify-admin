"use server";

import { redirect } from "next/navigation";
import { loginAgainstCore } from "@/lib/auth/adminApi";
import { createAdminSession } from "@/lib/auth/session";

export type LoginFormState = {
  error: string | null;
};

export async function loginAction(_: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const result = await loginAgainstCore(email, password);

    if (!result) {
      return { error: "Incorrect email or password." };
    }

    await createAdminSession({ accessToken: result.accessToken });
  } catch {
    return { error: "Core admin auth is not reachable right now." };
  }

  redirect("/dashboard");
}
