import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default function DashboardPage() {
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
