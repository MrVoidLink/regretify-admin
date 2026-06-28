import { NextResponse } from "next/server";
import { fetchCoreWithAdminAccessToken } from "@/lib/auth/adminApi";
import { getAdminAccessToken } from "@/lib/auth/session";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const accessToken = await getAdminAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const incomingFormData = await request.formData();
  const kind = incomingFormData.get("kind");
  const file = incomingFormData.get("file");

  if (typeof kind !== "string" || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Image file and kind are required." },
      { status: 400 },
    );
  }

  const forwardedFormData = new FormData();
  forwardedFormData.append("kind", kind);
  forwardedFormData.append("file", file, file.name);

  const response = await fetchCoreWithAdminAccessToken(
    accessToken,
    `/admin/market-pulse/posts/${id}/assets`,
    {
      method: "POST",
      body: forwardedFormData,
    },
  );
  const payload = await response.json().catch(() => ({ error: "Request failed" }));

  return NextResponse.json(payload, { status: response.status });
}
