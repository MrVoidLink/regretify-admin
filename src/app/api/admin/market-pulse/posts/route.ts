import { NextResponse } from "next/server";
import { fetchCoreWithAdminAccessToken } from "@/lib/auth/adminApi";
import { getAdminAccessToken } from "@/lib/auth/session";

function buildCorePath(request: Request) {
  const { searchParams } = new URL(request.url);
  const coreSearchParams = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (value) {
      coreSearchParams.set(key, value);
    }
  }

  const queryString = coreSearchParams.toString();
  return `/admin/market-pulse/posts${queryString ? `?${queryString}` : ""}`;
}

export async function GET(request: Request) {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetchCoreWithAdminAccessToken(accessToken, buildCorePath(request), {
    method: "GET",
  });
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { mode?: "draft" | "published"; payload?: unknown };
  const mode = body.mode === "published" ? "published" : "drafts";

  const response = await fetchCoreWithAdminAccessToken(
    accessToken,
    `/admin/market-pulse/posts/${mode}`,
    {
      method: "POST",
      body: JSON.stringify(body.payload ?? {}),
    },
  );
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}
