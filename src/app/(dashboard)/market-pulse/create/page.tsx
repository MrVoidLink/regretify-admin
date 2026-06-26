import { MarketPulseComposer } from "@/components/market-pulse/MarketPulseComposer";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { getAdminSession } from "@/lib/auth/session";

export default async function MarketPulseCreatePage() {
  const admin = await getAdminSession();

  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Market Pulse"
        title="Create a new Pulse story"
        description="Build the feed card, story preview, operator-driven author shell, and publish-ready post in one UI-only composer."
      />
      <MarketPulseComposer admin={admin} />
    </div>
  );
}
