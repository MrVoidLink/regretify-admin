"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
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

type MarketPulseApiPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  badge: string;
  accent: string;
  summaryHeading: string;
  bodyHtml: string;
  tags: string;
  status: "draft" | "published";
};

function mapApiPostToComposerState(post: MarketPulseApiPost): ComposerState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    badge: post.badge,
    accent: post.accent,
    summaryHeading: post.summaryHeading,
    bodyHtml: post.bodyHtml,
    tags: post.tags,
  };
}

export function MarketPulseComposer({ admin, postId }: MarketPulseComposerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<ComposerState>(initialComposerState);
  const [currentPostId, setCurrentPostId] = useState(postId ?? null);
  const [isLoadingPost, setIsLoadingPost] = useState(Boolean(postId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
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
  const fileInputClassName =
    "min-h-11 w-full min-w-0 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-brand-soft)] file:px-3.5 file:py-2 file:text-[0.82rem] file:font-medium file:text-[var(--color-brand-strong)]";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!postId) {
      return;
    }

    let isActive = true;

    async function loadPost() {
      setIsLoadingPost(true);
      setSubmitError("");

      const response = await fetch(`/api/admin/market-pulse/posts/${postId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!isActive) {
        return;
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        setSubmitError(payload?.message ?? payload?.error ?? "Could not load this post.");
        setIsLoadingPost(false);
        return;
      }

      const post = (await response.json()) as MarketPulseApiPost;
      setDraft(mapApiPostToComposerState(post));
      setCurrentPostId(post.id);
      setIsLoadingPost(false);
    }

    void loadPost();

    return () => {
      isActive = false;
    };
  }, [postId]);

  useEffect(() => {
    if (!successModalMessage) {
      return;
    }

    const redirectTimeout = window.setTimeout(() => {
      router.push("/market-pulse/posts");
      router.refresh();
    }, 1200);

    return () => window.clearTimeout(redirectTimeout);
  }, [router, successModalMessage]);

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
    setSubmitMessage("");
    setSubmitError("");
    setSuccessModalMessage("");
  }

  function showSuccessAndRedirect(message: string) {
    setSubmitMessage("");
    setSubmitError("");
    setSuccessModalMessage(message);
  }

  async function requestJson<T>(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    const payload = (await response.json().catch(() => null)) as
      | (T & { message?: string; error?: string })
      | null;

    if (!response.ok) {
      throw new Error(payload?.message ?? payload?.error ?? "Request failed.");
    }

    return payload as T;
  }

  async function saveDraft() {
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const payload = {
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        category: draft.category,
        badge: draft.badge,
        accent: draft.accent,
        summaryHeading: draft.summaryHeading,
        bodyHtml: draft.bodyHtml,
        tags: draft.tags,
      };

      const savedPost = currentPostId
        ? await requestJson<MarketPulseApiPost>(`/api/admin/market-pulse/posts/${currentPostId}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await requestJson<MarketPulseApiPost>("/api/admin/market-pulse/posts", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              mode: "draft",
              payload,
            }),
          });

      setCurrentPostId(savedPost.id);
      showSuccessAndRedirect("Draft saved successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save draft.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function publishPost() {
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const payload = {
        title: draft.title,
        slug: draft.slug,
        excerpt: draft.excerpt,
        category: draft.category,
        badge: draft.badge,
        accent: draft.accent,
        summaryHeading: draft.summaryHeading,
        bodyHtml: draft.bodyHtml,
        tags: draft.tags,
      };

      if (currentPostId) {
        await requestJson<MarketPulseApiPost>(`/api/admin/market-pulse/posts/${currentPostId}`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const publishedPost = await requestJson<MarketPulseApiPost>(
          `/api/admin/market-pulse/posts/${currentPostId}/publish`,
          {
            method: "POST",
          },
        );

        setCurrentPostId(publishedPost.id);
      } else {
        const publishedPost = await requestJson<MarketPulseApiPost>(
          "/api/admin/market-pulse/posts",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              mode: "published",
              payload,
            }),
          },
        );

        setCurrentPostId(publishedPost.id);
      }

      showSuccessAndRedirect("Post published successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not publish post.");
    } finally {
      setIsSubmitting(false);
    }
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
  const successModal = hasMounted && successModalMessage
    ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(10,10,16,0.45)] px-4">
          <div className="w-full max-w-md rounded-[1.6rem] border border-[color:var(--color-border)] bg-white p-6 shadow-[0_24px_60px_rgba(24,24,27,0.18)]">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              Success
            </p>
            <h3 className="mt-3 text-[1.45rem] font-semibold text-[var(--color-text)]">
              {successModalMessage}
            </h3>
            <p className="mt-2 text-[0.92rem] leading-7 text-[var(--color-text-soft)]">
              Redirecting to created posts so you can keep managing this story there.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  router.push("/market-pulse/posts");
                  router.refresh();
                }}
                className="inline-flex min-h-11 items-center rounded-full bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-5 text-[0.92rem] font-semibold text-white shadow-[0_14px_26px_rgba(90,40,223,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Go to posts now
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  if (isLoadingPost) {
    return (
      <section className="space-y-4">
        <SectionCard
          title="Loading post"
          description="Fetching the saved Market Pulse draft before the composer initializes."
        >
          <p className="text-[0.92rem] text-[var(--color-text-soft)]">Loading editor data...</p>
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {successModal}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="min-w-0 space-y-4">
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
                  className={fileInputClassName}
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

        <div className="min-w-0 space-y-4 xl:sticky xl:top-6">
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
                className={fileInputClassName}
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
          <div className="space-y-1">
            <p className="text-[0.84rem] leading-6 text-[var(--color-text-soft)]">
              Views and likes are preview-only. Publish time and author card are injected automatically at publish time.
            </p>
            {submitMessage ? (
              <p className="text-[0.82rem] font-medium text-emerald-700">{submitMessage}</p>
            ) : null}
            {submitError ? (
              <p className="text-[0.82rem] font-medium text-rose-600">{submitError}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void saveDraft()}
              disabled={isSubmitting || isLoadingPost}
              className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-border)] bg-white px-5 text-[0.92rem] font-semibold text-[var(--color-text)] transition-colors hover:bg-zinc-50"
            >
              {isSubmitting ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => void publishPost()}
              disabled={isSubmitting || isLoadingPost}
              className="inline-flex min-h-11 items-center rounded-full bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-5 text-[0.92rem] font-semibold text-white shadow-[0_14px_26px_rgba(90,40,223,0.24)] transition-transform hover:-translate-y-0.5"
            >
              {isSubmitting ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
