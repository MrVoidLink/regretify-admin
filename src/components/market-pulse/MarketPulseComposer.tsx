"use client";

import { useState } from "react";

type DraftStatus = "draft" | "review" | "scheduled" | "published";
type Tone = "midnight" | "rose" | "crimson" | "amber" | "teal";

type ComposerState = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  badge: string;
  tone: Tone;
  accent: string;
  status: DraftStatus;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  views: string;
  likes: string;
  summaryHeading: string;
  introParagraphs: string;
  tags: string;
  ctaTitle: string;
  ctaButtonLabel: string;
  sponsorName: string;
  sponsorTitle: string;
};

const initialComposerState: ComposerState = {
  title: "Bitcoin jumps after mysterious whale chatter hits the timeline",
  slug: "bitcoin-jumps-after-mysterious-whale-chatter-hits-the-timeline",
  excerpt: "One big wallet, one loud rumor, and the entire feed forgets how to act.",
  category: "Crypto",
  badge: "Breaking",
  tone: "midnight",
  accent: "BTC +7.2%",
  status: "draft",
  publishedAt: "2026-06-26T13:30",
  authorName: "CryptoDaily",
  authorRole: "Your daily dose of crypto news, charts, and chaos.",
  views: "12.4K",
  likes: "3.6K",
  summaryHeading: "Bitcoin jumped after whale chatter, but positioning did most of the work",
  introParagraphs:
    "The first screenshots spread before the US session fully opened.\nBitcoin was already leaning into resistance, so the rumor acted like a catalyst instead of the whole explanation.\nThe move accelerated because traders were crowded and the feed wanted a story.",
  tags: "#Bitcoin, #Whales, #CryptoNews, #MarketPulse",
  ctaTitle: "What if you invested before the pump?",
  ctaButtonLabel: "Calculate Your Regret",
  sponsorName: "BINANCE",
  sponsorTitle: "Trade the moves before the crowd.",
};

const editorialQueue = [
  {
    id: "story-01",
    title: "Bitcoin jumps after mysterious whale chatter hits the timeline",
    status: "draft" as const,
    updatedAt: "Edited 18m ago",
  },
  {
    id: "story-02",
    title: "PEPE holders are celebrating another green day like it means destiny",
    status: "review" as const,
    updatedAt: "Waiting on editorial review",
  },
  {
    id: "story-03",
    title: "\"I sold before the pump\" becomes the quote of the day again",
    status: "scheduled" as const,
    updatedAt: "Queued for 4:00 PM",
  },
];

const statusOptions: Array<{ value: DraftStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
];

const toneOptions: Array<{ value: Tone; label: string; className: string }> = [
  {
    value: "midnight",
    label: "Midnight",
    className:
      "bg-[radial-gradient(circle_at_top_left,#5f4cff_0%,#251a68_42%,#0d1122_100%)]",
  },
  {
    value: "rose",
    label: "Rose",
    className:
      "bg-[radial-gradient(circle_at_top_left,#ffc4ea_0%,#ef6db7_32%,#331628_100%)]",
  },
  {
    value: "crimson",
    label: "Crimson",
    className:
      "bg-[radial-gradient(circle_at_top_left,#ffb3c2_0%,#eb4f73_32%,#2b1219_100%)]",
  },
  {
    value: "amber",
    label: "Amber",
    className:
      "bg-[radial-gradient(circle_at_top_left,#ffe29b_0%,#f4a33d_32%,#2f170c_100%)]",
  },
  {
    value: "teal",
    label: "Teal",
    className:
      "bg-[radial-gradient(circle_at_top_left,#bfffee_0%,#32b9aa_32%,#102126_100%)]",
  },
];

function statusClassName(status: DraftStatus) {
  switch (status) {
    case "draft":
      return "bg-zinc-100 text-zinc-700";
    case "review":
      return "bg-amber-100 text-amber-800";
    case "scheduled":
      return "bg-sky-100 text-sky-700";
    case "published":
      return "bg-emerald-100 text-emerald-700";
  }
}

function tonePreviewClassName(tone: Tone) {
  return toneOptions.find((option) => option.value === tone)?.className ?? toneOptions[0].className;
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-5 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[1.02rem] font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="text-[0.84rem] leading-6 text-[var(--color-text-soft)]">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">{label}</span>
      {children}
    </label>
  );
}

function textInputClassName() {
  return "min-h-11 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.92rem] text-[var(--color-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--color-brand)]";
}

function textareaClassName() {
  return "min-h-28 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.92rem] leading-6 text-[var(--color-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--color-brand)]";
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <section className="rounded-[1.35rem] border border-[color:var(--color-border)] bg-white/80 p-4 shadow-[0_10px_26px_rgba(24,24,27,0.04)]">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
        {label}
      </p>
      <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em] text-[var(--color-text)]">
        {value}
      </p>
      <p className="mt-1 text-[0.82rem] text-[var(--color-text-soft)]">{note}</p>
    </section>
  );
}

function EditorialQueueCard({
  title,
  status,
  updatedAt,
}: {
  title: string;
  status: DraftStatus;
  updatedAt: string;
}) {
  return (
    <article className="rounded-[1.25rem] border border-[color:var(--color-border)] bg-white/82 p-4 shadow-[0_10px_26px_rgba(24,24,27,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <h4 className="max-w-[14rem] text-[0.94rem] font-semibold leading-6 text-[var(--color-text)]">
          {title}
        </h4>
        <span
          className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.72rem] font-semibold ${statusClassName(status)}`}
        >
          {statusOptions.find((option) => option.value === status)?.label}
        </span>
      </div>
      <p className="mt-3 text-[0.82rem] text-[var(--color-text-soft)]">{updatedAt}</p>
    </article>
  );
}

export function MarketPulseComposer() {
  const [draft, setDraft] = useState<ComposerState>(initialComposerState);

  function setField<K extends keyof ComposerState>(field: K, value: ComposerState[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  const introParagraphs = draft.introParagraphs
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const tagList = draft.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Queue" value="3 Posts" note="1 draft, 1 review, 1 scheduled" />
        <MetricCard label="Publishing" value="4:00 PM" note="Next scheduled Pulse goes live today" />
        <MetricCard label="Coverage" value="Crypto-heavy" note="Current lineup leans on market-moving stories" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <SectionCard
            title="Editorial Queue"
            description="Quick access to the current draft lane before wiring real persistence."
          >
            <div className="space-y-3">
              {editorialQueue.map((item) => (
                <EditorialQueueCard
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  updatedAt={item.updatedAt}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Publish Checks"
            description="The lightweight checklist editors should pass before shipping a story."
          >
            <div className="space-y-3 text-[0.88rem] text-[var(--color-text-soft)]">
              <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-white/82 px-4 py-3">
                Feed title is sharp and short enough for grid cards.
              </div>
              <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-white/82 px-4 py-3">
                Story summary and intro match the same market angle.
              </div>
              <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-white/82 px-4 py-3">
                Sponsor message stays clearly separated from editorial copy.
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard
            title="Post Setup"
            description="Core metadata for the feed card, publish state, and story identity."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Status">
                <select
                  value={draft.status}
                  onChange={(event) => setField("status", event.target.value as DraftStatus)}
                  className={textInputClassName()}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Publish Time">
                <input
                  type="datetime-local"
                  value={draft.publishedAt}
                  onChange={(event) => setField("publishedAt", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Category">
                <input
                  value={draft.category}
                  onChange={(event) => setField("category", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Badge">
                <input
                  value={draft.badge}
                  onChange={(event) => setField("badge", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

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

              <div className="md:col-span-2">
                <Field label="Excerpt">
                  <textarea
                    value={draft.excerpt}
                    onChange={(event) => setField("excerpt", event.target.value)}
                    className={textareaClassName()}
                  />
                </Field>
              </div>

              <Field label="Accent">
                <input
                  value={draft.accent}
                  onChange={(event) => setField("accent", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <div className="grid gap-2">
                <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Tone</span>
                <div className="grid grid-cols-5 gap-2">
                  {toneOptions.map((option) => {
                    const isSelected = draft.tone === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setField("tone", option.value)}
                        className={`overflow-hidden rounded-[1rem] border transition-transform hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-[var(--color-brand)] shadow-[0_10px_24px_rgba(111,67,255,0.18)]"
                            : "border-[color:var(--color-border)]"
                        }`}
                      >
                        <div className={`h-14 w-full ${option.className}`} />
                        <div className="bg-white px-1 py-2 text-[0.68rem] font-medium text-[var(--color-text-soft)]">
                          {option.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Story Body"
            description="Editorial context, author details, and the story summary block used in the detail page."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Author Name">
                <input
                  value={draft.authorName}
                  onChange={(event) => setField("authorName", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Author Role">
                <input
                  value={draft.authorRole}
                  onChange={(event) => setField("authorRole", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Views">
                <input
                  value={draft.views}
                  onChange={(event) => setField("views", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Likes">
                <input
                  value={draft.likes}
                  onChange={(event) => setField("likes", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Summary Heading">
                  <input
                    value={draft.summaryHeading}
                    onChange={(event) => setField("summaryHeading", event.target.value)}
                    className={textInputClassName()}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Intro Paragraphs">
                  <textarea
                    value={draft.introParagraphs}
                    onChange={(event) => setField("introParagraphs", event.target.value)}
                    className={textareaClassName()}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Tags">
                  <input
                    value={draft.tags}
                    onChange={(event) => setField("tags", event.target.value)}
                    className={textInputClassName()}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Monetization And CTA"
            description="Sponsor and product CTA fields that sit beside or below the editorial body."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA Title">
                <input
                  value={draft.ctaTitle}
                  onChange={(event) => setField("ctaTitle", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="CTA Button Label">
                <input
                  value={draft.ctaButtonLabel}
                  onChange={(event) => setField("ctaButtonLabel", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Sponsor Name">
                <input
                  value={draft.sponsorName}
                  onChange={(event) => setField("sponsorName", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>

              <Field label="Sponsor Title">
                <input
                  value={draft.sponsorTitle}
                  onChange={(event) => setField("sponsorTitle", event.target.value)}
                  className={textInputClassName()}
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-4 shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
            <div>
              <p className="text-[0.86rem] font-semibold text-[var(--color-text)]">UI-only draft actions</p>
              <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                Buttons are placeholders until persistence and publishing APIs land.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.86rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)]"
              >
                Save Draft
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 text-[0.86rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)]"
              >
                Preview
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-[1rem] bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-4 text-[0.86rem] font-semibold text-white shadow-[0_14px_28px_rgba(111,67,255,0.24)]"
              >
                Queue Post
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:sticky xl:top-6">
          <SectionCard
            title="Live Feed Preview"
            description="Approximate card preview using the same content model the public Pulse feed expects."
          >
            <article
              className={`overflow-hidden rounded-[1.6rem] border border-zinc-900/8 ${tonePreviewClassName(draft.tone)} p-4 text-white shadow-[0_20px_48px_rgba(24,24,27,0.12)]`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#ff6b4a] px-2.5 py-1 text-[0.64rem] font-semibold tracking-[0.1em] uppercase">
                  {draft.badge}
                </span>
                <span className="text-[0.72rem] text-white/78">Preview</span>
              </div>
              <div className="mt-16">
                <p className="text-[0.72rem] font-semibold tracking-[0.08em] text-white/72 uppercase">
                  {draft.accent}
                </p>
                <h3 className="mt-3 text-[1.5rem] font-semibold leading-9 tracking-[-0.04em]">
                  {draft.title}
                </h3>
                <p className="mt-3 text-[0.88rem] leading-6 text-white/78">{draft.excerpt}</p>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3 text-[0.8rem] text-white/76">
                <span>{draft.category}</span>
                <div className="flex items-center gap-3">
                  <span>{draft.views} views</span>
                  <span>{draft.likes} likes</span>
                </div>
              </div>
            </article>
          </SectionCard>

          <SectionCard
            title="Story Preview"
            description="The detail page shell the editor is effectively filling out."
          >
            <article className="overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border)] bg-white shadow-[0_16px_38px_rgba(24,24,27,0.04)]">
              <div className={`min-h-[12rem] px-5 py-5 text-white ${tonePreviewClassName(draft.tone)}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/18 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.1em] uppercase">
                    {draft.badge}
                  </span>
                  <span className="rounded-full bg-white/12 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.1em] uppercase">
                    {draft.category}
                  </span>
                </div>
                <h3 className="mt-8 text-[1.6rem] font-semibold leading-8 tracking-[-0.04em]">
                  {draft.title}
                </h3>
                <p className="mt-3 text-[0.88rem] leading-6 text-white/80">{draft.excerpt}</p>
              </div>
              <div className="space-y-5 px-5 py-5">
                <div className="flex items-center justify-between gap-3 text-[0.8rem] text-[var(--color-text-soft)]">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{draft.authorName}</p>
                    <p className="mt-1">{draft.authorRole}</p>
                  </div>
                  <div className="text-right">
                    <p>{draft.views} views</p>
                    <p className="mt-1">{draft.likes} likes</p>
                  </div>
                </div>
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand)]">
                    Story Analysis
                  </p>
                  <h4 className="mt-2 text-[1.12rem] font-semibold leading-7 text-[var(--color-text)]">
                    {draft.summaryHeading}
                  </h4>
                </div>
                <div className="space-y-3 text-[0.88rem] leading-6 text-[var(--color-text-soft)]">
                  {introParagraphs.slice(0, 2).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="rounded-[1rem] border border-[color:var(--color-border)] bg-[var(--color-background)] px-4 py-4">
                  <p className="text-[0.84rem] font-semibold text-[var(--color-text)]">
                    {draft.sponsorName}
                  </p>
                  <p className="mt-1 text-[0.84rem] leading-6 text-[var(--color-text-soft)]">
                    {draft.sponsorTitle}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex min-h-8 items-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-background)] px-3 text-[0.76rem] text-[var(--color-text-soft)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center rounded-[1rem] bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-4 text-[0.84rem] font-semibold text-white shadow-[0_14px_28px_rgba(111,67,255,0.24)]"
                >
                  {draft.ctaButtonLabel}
                </button>
              </div>
            </article>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
