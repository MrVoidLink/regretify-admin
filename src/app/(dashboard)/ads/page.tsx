import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { requireSuperAdminSession } from "@/lib/auth/session";

export default async function AdsAdminPage() {
  await requireSuperAdminSession();

  return (
    <AdminPageIntro
      eyebrow="Ads"
      title="Manage ad slots and provider settings"
      description="This area will handle ad placement configuration, provider setup, and future monetization controls."
    />
  );
}
