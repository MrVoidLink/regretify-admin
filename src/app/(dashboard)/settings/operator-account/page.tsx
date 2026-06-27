import Link from "next/link";
import { OperatorAccountSettings } from "@/components/settings/OperatorAccountSettings";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";
import { getAdminSession } from "@/lib/auth/session";

export default async function OperatorAccountSettingsPage() {
  const admin = await getAdminSession();

  return (
    <div className="grid gap-4">
      <Link
        href="/settings"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-3.5 py-2 text-[0.84rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.5 5.5 7 10l4.5 4.5" />
          <path d="M7.5 10h7.5" />
        </svg>
        Back to settings
      </Link>

      <AdminPageIntro
        eyebrow="Settings"
        title="Operator account"
        description="Manage the public operator identity that appears on Market Pulse stories before backend asset persistence is wired."
      />

      <OperatorAccountSettings admin={admin} />
    </div>
  );
}
