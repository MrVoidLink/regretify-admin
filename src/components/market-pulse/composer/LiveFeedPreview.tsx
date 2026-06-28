import Image from "next/image";
import { previewMetrics } from "@/components/market-pulse/composer/config";
import { EyeIcon, HeartIcon, SaveIcon } from "@/components/market-pulse/composer/shared";
import type { ComposerState } from "@/components/market-pulse/composer/types";

export function LiveFeedPreview({
  draft,
  heroImageSrc,
}: {
  draft: ComposerState;
  heroImageSrc: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[23.5rem]">
      <div className="rounded-[2rem] border border-[color:var(--color-border-ui-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(250,247,255,0.9)_100%)] p-5 shadow-[0_18px_48px_rgba(107,76,255,0.08)] backdrop-blur-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="max-w-[12rem]">
            <p className="text-[0.76rem] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              All Pulse
            </p>
            <p className="mt-2 text-[0.8rem] leading-5 text-[var(--color-text-soft)]">
              Desktop featured card width from the live client feed.
            </p>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,var(--color-brand-soft)_0%,var(--color-brand-soft-strong)_100%)] text-[var(--color-brand-strong)] shadow-[0_8px_20px_rgba(24,24,27,0.04)]">
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
              <path d="M4 5.5h4.5v4.5H4z" />
              <path d="M11.5 5.5H16v4.5h-4.5z" />
              <path d="M4 12h4.5v4.5H4z" />
              <path d="M11.5 12H16v4.5h-4.5z" />
            </svg>
          </div>
        </div>

        <article className="relative flex h-[25rem] w-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-900/8 bg-zinc-950 shadow-[0_20px_48px_rgba(24,24,27,0.1)]">
          <div className="absolute inset-0">
            <Image
              src={heroImageSrc}
              alt=""
              fill
              unoptimized
              sizes="376px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.04)_0%,rgba(8,10,18,0.18)_28%,rgba(8,10,18,0.52)_60%,rgba(8,10,18,0.92)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.06)_20%,rgba(17,18,46,0)_54%)]" />
            <div className="absolute left-4 top-4 rounded-full bg-[#ff6b4a] px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.1em] text-white uppercase">
              {draft.badge}
            </div>
            <div className="absolute right-4 top-4 text-[0.74rem] text-white/88">Just now</div>
            <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,rgba(13,10,24,0)_0%,rgba(13,10,24,0.18)_18%,rgba(13,10,24,0.46)_42%,rgba(13,10,24,0.78)_74%,rgba(13,10,24,0.96)_100%)]" />
          </div>

          <div className="relative z-10 flex h-full flex-col p-4 text-white sm:p-4.5">
            <div className="mt-auto">
              <h3 className="type-display line-clamp-3 h-[4.35rem] max-w-[15rem] text-[1.42rem] font-semibold text-white">
                {draft.title}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem] text-white/76">
                <span>{draft.category}</span>
                <div className="flex items-center gap-3 text-white/82">
                  <span className="inline-flex items-center gap-1.5">
                    <EyeIcon />
                    <span>{previewMetrics.views}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/60 bg-rose-500/18 px-2.5 py-1 text-rose-200">
                    <HeartIcon />
                    <span>{previewMetrics.likes}</span>
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/28 bg-white/22 text-white">
                    <SaveIcon isSaved />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
