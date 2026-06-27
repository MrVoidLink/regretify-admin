import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { requireSuperAdminSession } from "@/lib/auth/session";

export default async function AssetsAdminPage() {
  await requireSuperAdminSession();

  return (
    <AdminPageIntro
      eyebrow="Assets"
      title="Manage supported assets and metadata"
      description="This area will manage asset identity, market grouping, ticker metadata, and future calculator-specific settings."
    />
  );
}
