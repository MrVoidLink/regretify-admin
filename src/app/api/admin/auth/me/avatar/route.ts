import { NextResponse } from "next/server";
import { fetchCoreWithAdminAccessToken } from "@/lib/auth/adminApi";
import { getAdminAccessToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const response = await fetchCoreWithAdminAccessToken(accessToken, "/admin/auth/me/avatar", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({ error: "Request failed" }));
  return NextResponse.json(payload, { status: response.status });
}
