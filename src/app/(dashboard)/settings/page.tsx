import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default function SettingsAdminPage() {
  return (
    <AdminPageIntro
      eyebrow="Settings"
      title="Manage environment and operational settings"
      description="This area is reserved for internal configuration, safe operational toggles, and future system-level settings."
    />
  );
}
