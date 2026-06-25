export async function GET() {
  return Response.json({
    status: "ok",
    service: "regretify-admin",
    environment: process.env.NODE_ENV ?? "development",
  });
}
