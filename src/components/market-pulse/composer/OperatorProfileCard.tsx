import Image from "next/image";
import type { OperatorPreviewProfile } from "@/components/market-pulse/composer/types";

export function OperatorProfileCard({ operator }: { operator: OperatorPreviewProfile }) {
  return (
    <div className="rounded-[1.3rem] border border-[color:var(--color-border)] bg-white px-4 py-4 shadow-[0_10px_26px_rgba(24,24,27,0.04)]">
      <div className="flex items-center gap-3">
        {operator.avatarSrc ? (
          <div className="relative h-13 w-13 overflow-hidden rounded-full shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
            <Image
              src={operator.avatarSrc}
              alt={`${operator.displayName} avatar`}
              fill
              unoptimized
              sizes="52px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f7f3ff_0%,#ffffff_100%)] text-[0.98rem] font-semibold text-[var(--color-brand)] shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
            {operator.initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="type-title text-[1rem] font-semibold text-zinc-950">{operator.displayName}</p>
            <span className="inline-flex min-h-7 items-center rounded-full bg-[var(--color-brand-soft)] px-2.5 text-[0.72rem] font-medium text-[var(--color-brand-strong)]">
              {operator.roleLabel}
            </span>
          </div>
          <p className="mt-1 text-[0.8rem] text-zinc-500">@{operator.username}</p>
          <p className="mt-1 text-[0.82rem] text-[var(--color-text-soft)]">{operator.email}</p>
        </div>
      </div>
      <p className="mt-3 text-[0.82rem] leading-6 text-[var(--color-text-soft)]">
        Author name, avatar, and profile line come from the operator account automatically.
      </p>
    </div>
  );
}
