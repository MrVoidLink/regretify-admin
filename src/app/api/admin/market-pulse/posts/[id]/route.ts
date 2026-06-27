import { NextResponse } from "next/server";
import { fetchCoreWithAdminAccessToken } from "@/lib/auth/adminApi";
import { getAdminAccessToken } from "@/lib/auth/session";

async function getAccessTokenResponse() {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return null;
  }

  return accessToken;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessTokenResponse();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await fetchCoreWithAdminAccessToken(accessToken, `/admin/market-pulse/posts/${id}`, {
    method: "GET",
  });
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessTokenResponse();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const response = await fetchCoreWithAdminAccessToken(accessToken, `/admin/market-pulse/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAccessTokenResponse();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await fetchCoreWithAdminAccessToken(accessToken, `/admin/market-pulse/posts/${id}`, {
    method: "DELETE",
  });
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}
