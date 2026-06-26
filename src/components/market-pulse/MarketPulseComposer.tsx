"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  badgeOptions,
  categoryOptions,
  defaultHeroImageSrc,
  initialComposerState,
} from "@/components/market-pulse/composer/config";
import { InsidePostPreview } from "@/components/market-pulse/composer/InsidePostPreview";
import { LiveFeedPreview } from "@/components/market-pulse/composer/LiveFeedPreview";
import { OperatorProfileCard } from "@/components/market-pulse/composer/OperatorProfileCard";
import { RichTextEditor } from "@/components/market-pulse/composer/RichTextEditor";
import {
  Field,
  SectionCard,
  textInputClassName,
  textareaClassName,
} from "@/components/market-pulse/composer/shared";
import type {
  ComposerState,
  MarketPulseComposerProps,
} from "@/components/market-pulse/composer/types";
import {
  extractOutlineLinksFromBodyHtml,
} from "@/components/market-pulse/composer/utils";
import { useOperatorAccountProfile } from "@/hooks/useOperatorAccountProfile";
import { buildOperatorPreviewProfile } from "@/lib/operator-profile";

export function MarketPulseComposer({ admin }: MarketPulseComposerProps) {
  const [draft, setDraft] = useState<ComposerState>(initialComposerState);
  const [uploadedHeroImageSrc, setUploadedHeroImageSrc] = useState<string | null>(null);
  const [uploadedHeroImageName, setUploadedHeroImageName] = useState("Default hero artwork");
  const [uploadedStoryHeroImageSrc, setUploadedStoryHeroImageSrc] = useState<string | null>(null);
  const [uploadedStoryHeroImageName, setUploadedStoryHeroImageName] = useState(
    "Using feed hero image",
  );
  const feedHeroInputRef = useRef<HTMLInputElement | null>(null);
  const storyHeroInputRef = useRef<HTMLInputElement | null>(null);
  const [operatorAccount] = useOperatorAccountProfile(admin);
  const operator = buildOperatorPreviewProfile(operatorAccount);

  useEffect(() => {
    return () => {
      if (uploadedHeroImageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedHeroImageSrc);
      }

      if (uploadedStoryHeroImageSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedStoryHeroImageSrc);
      }
    };
  }, [uploadedHeroImageSrc, uploadedStoryHeroImageSrc]);

  function setField<K extends keyof ComposerState>(field: K, value: ComposerState[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleHeroImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setUploadedHeroImageSrc((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return nextPreviewUrl;
    });
    setUploadedHeroImageName(file.name);
  }

  function handleStoryHeroImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setUploadedStoryHeroImageSrc((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return nextPreviewUrl;
    });
    setUploadedStoryHeroImageName(file.name);
  }

  function resetHeroImage() {
    setUploadedHeroImageSrc((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
    setUploadedHeroImageName("Default hero artwork");

    if (feedHeroInputRef.current) {
      feedHeroInputRef.current.value = "";
    }
  }

  function resetStoryHeroImage() {
    setUploadedStoryHeroImageSrc((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
    setUploadedStoryHeroImageName("Using feed hero image");

    if (storyHeroInputRef.current) {
      storyHeroInputRef.current.value = "";
    }
  }

  const heroImageSrc = uploadedHeroImageSrc ?? defaultHeroImageSrc;
  const storyHeroImageSrc = uploadedStoryHeroImageSrc ?? heroImageSrc;
  const tagList = draft.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const outlineLinks = extractOutlineLinksFromBodyHtml(draft.bodyHtml);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="space-y-4">
          <SectionCard
            title="Feed Preview Fields"
            description="Only the fields that directly shape the live Market Pulse card."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={draft.title}
                  onChange={(event) => setField("title", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Slug">
                <input
                  value={draft.slug}
                  onChange={(event) => setField("slug", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(event) => setField("category", event.target.value)}
                  className={textInputClassName()}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Badge">
                <select
                  value={draft.badge}
                  onChange={(event) => setField("badge", event.target.value)}
                  className={textInputClassName()}
                >
                  {badgeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Accent">
                <input
                  value={draft.accent}
                  onChange={(event) => setField("accent", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Hero Image">
                <input
                  ref={feedHeroInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleHeroImageChange}
                  className="min-h-11 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-brand-soft)] file:px-3.5 file:py-2 file:text-[0.82rem] file:font-medium file:text-[var(--color-brand-strong)]"
                />
              </Field>

              <div className="md:col-span-2">
                <div className="rounded-[1.2rem] border border-dashed border-[color:var(--color-border)] bg-white/80 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                        {uploadedHeroImageName}
                      </p>
                      <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                        This image is used on the feed card and as the fallback for the inside post hero.
                      </p>
                      <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                        Recommended size: 1128 x 1200 px
                      </p>
                    </div>
                    {uploadedHeroImageSrc ? (
                      <button
                        type="button"
                        onClick={resetHeroImage}
                        className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.82rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50"
                      >
                        Reset image
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Field label="Excerpt">
                  <textarea
                    value={draft.excerpt}
                    onChange={(event) => setField("excerpt", event.target.value)}
                    className={textareaClassName()}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4 xl:sticky xl:top-6">
          <SectionCard
            title="Live Feed Preview"
            description="This matches the public feed card much more closely now."
          >
            <LiveFeedPreview draft={draft} heroImageSrc={heroImageSrc} />
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Inside Post Preview"
        description="This uses the actual top-shell proportions first, then the rest of the story blocks continue below."
      >
        <InsidePostPreview
          draft={draft}
          storyHeroImageSrc={storyHeroImageSrc}
          operator={operator}
          tagList={tagList}
          outlineLinks={outlineLinks}
        />
      </SectionCard>

      <SectionCard
        title="Inside Post Fields"
        description="Author and publish time come from the operator profile and the publish action automatically."
      >
        <div className="space-y-4">
          <Field label="Author Source">
            <OperatorProfileCard operator={operator} />
          </Field>

          <Field label="Summary Heading">
            <input
              value={draft.summaryHeading}
              onChange={(event) => setField("summaryHeading", event.target.value)}
              className={textInputClassName()}
            />
          </Field>

          <Field label="Inside Post Hero Image">
            <div className="space-y-3">
              <input
                ref={storyHeroInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleStoryHeroImageChange}
                className="min-h-11 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-brand-soft)] file:px-3.5 file:py-2 file:text-[0.82rem] file:font-medium file:text-[var(--color-brand-strong)]"
              />
              <div className="rounded-[1.2rem] border border-dashed border-[color:var(--color-border)] bg-white/80 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                      {uploadedStoryHeroImageName}
                    </p>
                    <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                      This image only affects the large hero section inside the post preview.
                    </p>
                    <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                      Recommended size: 1625 x 968 px
                    </p>
                  </div>
                  {uploadedStoryHeroImageSrc ? (
                    <button
                      type="button"
                      onClick={resetStoryHeroImage}
                      className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.82rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50"
                    >
                      Reset image
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </Field>

          <Field label="Story Body Editor">
            <RichTextEditor
              value={draft.bodyHtml}
              onChange={(nextValue) => setField("bodyHtml", nextValue)}
            />
          </Field>

          <Field label="Tags">
            <input
              value={draft.tags}
              onChange={(event) => setField("tags", event.target.value)}
              className={textInputClassName()}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Publish"
        description="For now this flow only prepares a post for direct publishing."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.84rem] leading-6 text-[var(--color-text-soft)]">
            Views and likes are preview-only. Publish time and author card are injected automatically at publish time.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-border)] bg-white px-5 text-[0.92rem] font-semibold text-[var(--color-text)] transition-colors hover:bg-zinc-50"
            >
              Save draft
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-full bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-5 text-[0.92rem] font-semibold text-white shadow-[0_14px_26px_rgba(90,40,223,0.24)] transition-transform hover:-translate-y-0.5"
            >
              Publish post
            </button>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
