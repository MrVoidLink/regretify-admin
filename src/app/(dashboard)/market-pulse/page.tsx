import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { MarketPulseComposer } from "@/components/market-pulse/MarketPulseComposer";

export default function MarketPulseAdminPage() {
  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Market Pulse"
        title="Create stories and shape the publishing lane"
        description="This UI-only composer covers the feed card, story shell, sponsor block, and publish metadata so the admin surface can be finalized before persistence lands."
      />
      <MarketPulseComposer />
    </div>
  );
}
