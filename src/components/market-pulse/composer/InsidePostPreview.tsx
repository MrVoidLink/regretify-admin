import Image from "next/image";
import { fixedStoryCta, previewMetrics } from "@/components/market-pulse/composer/config";
import {
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  SaveIcon,
  ShareIcon,
} from "@/components/market-pulse/composer/shared";
import type {
  ComposerState,
  OperatorPreviewProfile,
  StoryOutlineLink,
} from "@/components/market-pulse/composer/types";
import { formatPublishedAtLabel } from "@/components/market-pulse/composer/utils";

export function InsidePostPreview({
  draft,
  storyHeroImageSrc,
  operator,
  tagList,
  outlineLinks,
}: {
  draft: ComposerState;
  storyHeroImageSrc: string;
  operator: OperatorPreviewProfile;
  tagList: string[];
  outlineLinks: StoryOutlineLink[];
}) {
  const publishMoment = new Date();

  return (
    <div className="mx-auto w-full max-w-[64rem] space-y-7">
      <section className="space-y-3 lg:space-y-4">
        <div className="inline-flex min-h-8 items-center gap-2 py-0.5 text-[0.92rem] font-semibold text-[var(--color-brand)]">
          <ArrowLeftIcon />
          <span>Back to Pulse</span>
        </div>

        <div>
          <section className="overflow-hidden rounded-[2rem] border border-violet-200/40 bg-[#11143d] shadow-[0_30px_70px_rgba(36,27,89,0.18)]">
            <div className="relative min-h-[17.5rem] overflow-hidden sm:min-h-[23rem] lg:min-h-[25rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(116,88,255,0.34)_0%,rgba(116,88,255,0.08)_28%,rgba(17,20,61,0)_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#11143d_0%,rgba(17,20,61,0.98)_36%,rgba(17,20,61,0.42)_60%,rgba(17,20,61,0)_78%)] sm:bg-[linear-gradient(90deg,#11143d_0%,rgba(17,20,61,0.94)_32%,rgba(17,20,61,0.2)_56%,rgba(17,20,61,0)_72%)]" />
              <div className="absolute inset-y-0 right-0 w-full sm:w-[72%] lg:w-[62%] overflow-hidden">
                <Image
                  src={storyHeroImageSrc}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover object-[84%_center] sm:object-[72%_center] lg:object-[78%_center]"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex min-h-10 items-center rounded-2xl border border-white/12 bg-white px-3.5 text-[0.8rem] font-semibold text-zinc-950 shadow-[0_12px_28px_rgba(24,24,27,0.18)]">
                    {draft.badge}
                  </span>
                  <span className="inline-flex min-h-10 items-center rounded-2xl bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-3.5 text-[0.8rem] font-semibold text-white shadow-[0_12px_28px_rgba(24,24,27,0.18)]">
                    {draft.category}
                  </span>
                </div>

                <div className="mt-auto max-w-[11.5rem] pb-1 pt-7 sm:max-w-[24rem] sm:pt-12 lg:max-w-[32rem] lg:pb-2">
                  <h3 className="type-display text-[1.45rem] font-semibold text-white sm:text-[2.7rem] lg:max-w-[30rem] lg:text-[3.55rem]">
                    {draft.title}
                  </h3>
                  <p className="mt-3 max-w-[10.25rem] text-[0.72rem] leading-5 text-white/82 sm:mt-4 sm:max-w-[21rem] sm:text-[1.04rem] lg:max-w-[26rem] lg:text-[1.08rem] lg:leading-8">
                    {draft.excerpt}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-b-[2rem] border border-t-0 border-[rgba(24,24,27,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,249,255,0.94)_100%)] px-5 py-4 shadow-[0_16px_40px_rgba(24,24,27,0.06)] sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                    <p className="type-title text-[1rem] font-semibold text-zinc-950">
                      {operator.displayName}
                    </p>
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand)]" />
                  </div>
                  <p className="mt-0.5 max-w-[20rem] text-[0.82rem] leading-5 text-[var(--color-text-soft)]">
                    {operator.roleLabel}
                  </p>
                  <p className="mt-0.5 block text-[0.84rem] text-zinc-400">
                    {formatPublishedAtLabel(publishMoment)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-[0.84rem] text-zinc-500">
                  <EyeIcon className="h-4 w-4" />
                  <span>{previewMetrics.views} views</span>
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 text-[0.84rem] font-medium text-rose-600">
                  <HeartIcon className="h-4 w-4" />
                  <span>{previewMetrics.likes}</span>
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-brand-border)] bg-[linear-gradient(180deg,var(--color-brand-soft)_0%,var(--color-brand-soft-strong)_100%)] text-[var(--color-brand-strong)]">
                  <SaveIcon className="h-4 w-4" isSaved />
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgba(24,24,27,0.08)] bg-white px-4 text-[0.85rem] font-medium text-zinc-500 shadow-[0_8px_20px_rgba(24,24,27,0.04)]">
                  <ShareIcon />
                  <span>Share</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </section>

      <nav
        aria-labelledby="story-outline-preview"
        className="rounded-[1.3rem] border border-[rgba(24,24,27,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,249,255,0.94)_100%)] p-5 shadow-[0_10px_24px_rgba(24,24,27,0.04)]"
      >
        <h4
          id="story-outline-preview"
          className="type-title text-[1.02rem] font-semibold text-zinc-950"
        >
          On this page
        </h4>
        <ul className="mt-4 space-y-3">
          {outlineLinks.map((link) => (
            <li key={link.href}>
              <span className="text-[0.95rem] leading-6 text-[var(--color-text-soft)]">
                {link.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <article className="min-w-0 rounded-[1.6rem] border border-[rgba(24,24,27,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,249,255,0.94)_100%)] px-5 py-6 shadow-[0_14px_34px_rgba(24,24,27,0.05)]">
        <header className="border-b border-[rgba(24,24,27,0.08)] pb-7">
          <p className="text-[0.74rem] font-semibold tracking-[0.18em] text-[var(--color-brand)] uppercase">
            Story Analysis
          </p>
          <h4 className="mt-3 max-w-[42rem] text-[1.6rem] font-semibold leading-tight text-zinc-950">
            {draft.summaryHeading}
          </h4>
        </header>

        <div className="mt-8 space-y-7">
          <section>
            <h5 className="text-[1.1rem] font-semibold text-zinc-950">Market overview</h5>
            <div
              className="editor-preview mt-4 space-y-4 text-[0.96rem] leading-7 text-zinc-700 [&_blockquote]:rounded-[1rem] [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-brand)] [&_blockquote]:bg-[var(--color-brand-soft)] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-zinc-700 [&_figure]:my-6 [&_h2]:type-title [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-[1.35rem] [&_h2]:font-semibold [&_h2]:text-zinc-950 [&_img]:w-full [&_img]:rounded-[1rem] [&_img]:object-cover [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: draft.bodyHtml }}
            />
          </section>

          <section className="rounded-[1.3rem] border border-[rgba(24,24,27,0.08)] bg-[#f7f4fd] px-5 py-6">
            <h5 className="text-[1.25rem] font-semibold text-zinc-950">{fixedStoryCta.title}</h5>
            <p className="mt-3 text-[0.95rem] leading-7 text-zinc-600">
              See how much that missed move would be worth now and how much regret it should probably cause.
            </p>
            <span className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-zinc-950 px-5 text-[0.92rem] font-semibold text-white">
              {fixedStoryCta.buttonLabel}
            </span>
          </section>

          <div className="border-t border-[rgba(24,24,27,0.08)] pt-7">
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex min-h-9 items-center rounded-full border border-[rgba(111,67,255,0.16)] bg-[linear-gradient(180deg,#f8f3ff_0%,#f1e8ff_100%)] px-3.5 text-[0.84rem] font-medium text-[var(--color-brand-strong)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
