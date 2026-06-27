import { redirect } from "next/navigation";
import { isSuperAdminRole } from "@/lib/auth/roles";
import { getAdminSession } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  redirect(isSuperAdminRole(session.role) ? "/dashboard" : "/market-pulse");
}
