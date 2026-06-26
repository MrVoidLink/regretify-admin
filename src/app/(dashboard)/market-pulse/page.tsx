import Link from "next/link";
import { editorialQueue } from "@/components/market-pulse/mockData";
import { AdminPageIntro } from "@/components/ui/AdminPageIntro";

export default function MarketPulseAdminPage() {
  const totalViews = editorialQueue.reduce((total, item) => total + item.views, 0);
  const publishedCount = editorialQueue.filter((item) => item.status === "published").length;

  return (
    <div className="grid gap-4">
      <AdminPageIntro
        eyebrow="Market Pulse"
        title="Market Pulse overview"
        description="Use this section as the top-level editorial hub, then jump into create or posts from the dropdown lane in the sidebar."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Queue
          </p>
          <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            {editorialQueue.length} posts
          </p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--color-text-soft)]">
            Saved drafts and published stories currently sitting in the lane.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Reach
          </p>
          <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            {`${(totalViews / 1000).toFixed(1)}K`}
          </p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--color-text-soft)]">
            Combined mock views across the current Pulse lineup.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Live now
          </p>
          <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            {publishedCount} published
          </p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--color-text-soft)]">
            Stories already pushed live from the current mock Pulse lineup.
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Link
          href="/market-pulse"
          className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-white/82 p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Overview
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            Editorial health
          </h2>
          <p className="mt-3 text-[0.92rem] leading-7 text-[var(--color-text-soft)]">
            High-level queue status, publishing cadence, and quick access to the main Pulse actions.
          </p>
        </Link>

        <Link
          href="/market-pulse/create"
          className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-white/82 p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Create
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            Open composer
          </h2>
          <p className="mt-3 text-[0.92rem] leading-7 text-[var(--color-text-soft)]">
            Fill the feed card, story shell, and publish metadata in one place.
          </p>
        </Link>

        <Link
          href="/market-pulse/posts"
          className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-white/82 p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Posts
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
            Review created stories
          </h2>
          <p className="mt-3 text-[0.92rem] leading-7 text-[var(--color-text-soft)]">
            Browse what has already been built in the mock editorial queue before wiring persistence.
          </p>
        </Link>
      </section>
    </div>
  );
}
