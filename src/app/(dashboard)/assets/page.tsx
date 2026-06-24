import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default function AssetsAdminPage() {
  return (
    <AdminPageIntro
      eyebrow="Assets"
      title="Manage supported assets and metadata"
      description="This area will manage asset identity, market grouping, ticker metadata, and future calculator-specific settings."
    />
  );
}
