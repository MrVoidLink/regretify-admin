import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/adminApi";
import { isSuperAdminRole } from "@/lib/auth/roles";
import type { AdminProfile } from "@/types/admin";

const SESSION_COOKIE_NAME = "regretify_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function isAdminAuthBypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.REGRETIFY_ADMIN_AUTH_BYPASS?.trim().toLowerCase() === "true"
  );
}

function getBypassAdminSession(): AdminProfile {
  const timestamp = new Date().toISOString();

  return {
    id: "dev-admin-bypass",
    email: "dev-admin@regretify.local",
    role: "super_admin",
    status: "active",
    username: "devadmin",
    displayName: "Dev Admin",
    avatarUrl: null,
    avatarAssetKey: null,
    authorRole: "Your daily dose of crypto news, charts, and chaos.",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

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
  if (isAdminAuthBypassEnabled()) {
    return getBypassAdminSession();
  }

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

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();

  if (!isSuperAdminRole(session.role)) {
    redirect("/settings");
  }

  return session;
}
