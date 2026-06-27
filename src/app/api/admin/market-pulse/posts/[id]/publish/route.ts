import { NextResponse } from "next/server";
import { fetchCoreWithAdminAccessToken } from "@/lib/auth/adminApi";
import { getAdminAccessToken } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await fetchCoreWithAdminAccessToken(
    accessToken,
    `/admin/market-pulse/posts/${id}/publish`,
    {
      method: "POST",
    },
  );
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}
