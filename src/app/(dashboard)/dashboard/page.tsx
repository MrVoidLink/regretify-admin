import { redirect } from "next/navigation";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { isSuperAdminRole } from "@/lib/auth/roles";
import { requireAdminSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireAdminSession();

  if (!isSuperAdminRole(session.role)) {
    redirect("/market-pulse");
  }

  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Dashboard"
        title="Operational overview placeholder"
        description="This is the landing page for the internal dashboard. It will grow into the main operational overview for content, assets, monetization, and system health."
      />
    </div>
  );
}
