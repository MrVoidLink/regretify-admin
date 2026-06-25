import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/adminApi";
import type { AdminProfile } from "@/types/admin";

const SESSION_COOKIE_NAME = "regretify_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

export async function createAdminSession(input: { accessToken: string }) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, input.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getAdminSession(): Promise<AdminProfile | null> {
  const token = await getAdminAccessToken();

  if (!token) {
    return null;
  }

  const admin = await getCurrentAdmin(token);

  if (!admin) {
    await clearAdminSession();
    return null;
  }

  return admin;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
