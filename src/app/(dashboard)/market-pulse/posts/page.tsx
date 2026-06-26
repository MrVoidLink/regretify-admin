import { MarketPulsePostsTable } from "@/components/market-pulse/MarketPulsePostsTable";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default function MarketPulsePostsPage() {
  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Market Pulse"
        title="Created Pulse posts"
        description="Review saved drafts and published stories, then filter by status, performance, or publish window."
      />

      <MarketPulsePostsTable />
    </div>
  );
}
