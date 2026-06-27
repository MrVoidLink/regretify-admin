import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { requireSuperAdminSession } from "@/lib/auth/session";

export default async function SponsorsAdminPage() {
  await requireSuperAdminSession();

  return (
    <AdminPageIntro
      eyebrow="Sponsors"
      title="Manage sponsor inventory and placements"
      description="This area will handle sponsor cards, offer metadata, and placement mapping across product surfaces."
    />
  );
}
