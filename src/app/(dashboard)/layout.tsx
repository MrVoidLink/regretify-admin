import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { requireAdminSession } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
