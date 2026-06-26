import { OperatorAccountSettings } from "@/components/settings/OperatorAccountSettings";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { getAdminSession } from "@/lib/auth/session";

export default async function SettingsAdminPage() {
  const admin = await getAdminSession();

  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Settings"
        title="Operator account settings"
        description="Manage the public operator identity that appears on Market Pulse stories before backend persistence is wired."
      />

      <OperatorAccountSettings admin={admin} />
    </div>
  );
}
