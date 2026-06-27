import type { AdminProfile } from "@/types/admin";

export function getCoreApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_CORE_API_BASE_URL?.trim();

  if (!value) {
    throw new Error("Missing required env: NEXT_PUBLIC_CORE_API_BASE_URL");
  }

  return value.replace(/\/$/, "");
}

export async function fetchCoreWithAdminAccessToken(
  accessToken: string,
  path: string,
  init?: RequestInit,
) {
  const headers = new Headers(init?.headers);
  headers.set("authorization", `Bearer ${accessToken}`);

  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return fetch(`${getCoreApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function loginAgainstCore(email: string, password: string) {
  const response = await fetch(`${getCoreApiBaseUrl()}/admin/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    accessToken: string;
    admin: AdminProfile;
  };

  if (!payload.accessToken || !payload.admin) {
    return null;
  }

  return payload;
}

export async function getCurrentAdmin(accessToken: string) {
  const response = await fetch(`${getCoreApiBaseUrl()}/admin/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AdminProfile;
}
