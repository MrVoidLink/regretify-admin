"use client";

import Link from "next/link";
import { useState } from "react";
import {
  editorialQueue,
  statusClassName,
  statusLabel,
  type EditorialPostStatus,
  type EditorialQueueItem,
} from "@/components/market-pulse/mockData";
import { textInputClassName } from "@/components/market-pulse/composer/shared";

type StatusFilter = "all" | EditorialPostStatus;

type SortValue =
  | "newest-created"
  | "oldest-created"
  | "most-views"
  | "least-views"
  | "most-likes"
  | "least-likes"
  | "latest-published"
  | "oldest-published";

const statusFilterOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All posts" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Saved drafts" },
];

const sortOptions: Array<{ value: SortValue; label: string }> = [
  { value: "newest-created", label: "Newest created" },
  { value: "oldest-created", label: "Oldest created" },
  { value: "most-views", label: "Most views" },
  { value: "least-views", label: "Least views" },
  { value: "most-likes", label: "Most likes" },
  { value: "least-likes", label: "Least likes" },
  { value: "latest-published", label: "Latest published" },
  { value: "oldest-published", label: "Oldest published" },
];

const ITEMS_PER_PAGE = 20;

function formatMetricCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function compareNullablePublishedDates(
  leftValue: string | null,
  rightValue: string | null,
  direction: "asc" | "desc",
) {
  if (!leftValue && !rightValue) {
    return 0;
  }

  if (!leftValue) {
    return 1;
  }

  if (!rightValue) {
    return -1;
  }

  const leftTimestamp = new Date(leftValue).getTime();
  const rightTimestamp = new Date(rightValue).getTime();

  return direction === "desc"
    ? rightTimestamp - leftTimestamp
    : leftTimestamp - rightTimestamp;
}

function matchesPublishedRange(
  item: EditorialQueueItem,
  publishedFrom: string,
  publishedTo: string,
) {
  if (!publishedFrom && !publishedTo) {
    return true;
  }

  if (!item.publishedAt) {
    return false;
  }

  const publishedTimestamp = new Date(item.publishedAt).getTime();

  if (publishedFrom) {
    const fromTimestamp = new Date(`${publishedFrom}T00:00:00`).getTime();

    if (publishedTimestamp < fromTimestamp) {
      return false;
    }
  }

  if (publishedTo) {
    const toTimestamp = new Date(`${publishedTo}T23:59:59`).getTime();

    if (publishedTimestamp > toTimestamp) {
      return false;
    }
  }

  return true;
}

function sortItems(items: EditorialQueueItem[], sortValue: SortValue) {
  const nextItems = [...items];

  nextItems.sort((leftItem, rightItem) => {
    switch (sortValue) {
      case "oldest-created":
        return (
          new Date(leftItem.createdAt).getTime() - new Date(rightItem.createdAt).getTime()
        );
      case "most-views":
        return rightItem.views - leftItem.views;
      case "least-views":
        return leftItem.views - rightItem.views;
      case "most-likes":
        return rightItem.likes - leftItem.likes;
      case "least-likes":
        return leftItem.likes - rightItem.likes;
      case "latest-published":
        return compareNullablePublishedDates(
          leftItem.publishedAt,
          rightItem.publishedAt,
          "desc",
        );
      case "oldest-published":
        return compareNullablePublishedDates(leftItem.publishedAt, rightItem.publishedAt, "asc");
      case "newest-created":
      default:
        return (
          new Date(rightItem.createdAt).getTime() - new Date(leftItem.createdAt).getTime()
        );
    }
  });

  return nextItems;
}

function actionButtonClassName(tone: "neutral" | "danger") {
  if (tone === "danger") {
    return "inline-flex min-h-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3.5 text-[0.8rem] font-medium text-rose-600 transition-colors hover:bg-rose-100";
  }

  return "inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50";
}

export function MarketPulsePostsTable() {
  const [items, setItems] = useState(editorialQueue);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortValue, setSortValue] = useState<SortValue>("newest-created");
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");

  const filteredItems = sortItems(
    items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      return matchesPublishedRange(item, publishedFrom, publishedTo);
    }),
    sortValue,
  );

  const draftCount = items.filter((item) => item.status === "draft").length;
  const publishedCount = items.filter((item) => item.status === "published").length;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(pageStart, pageStart + ITEMS_PER_PAGE);
  const showingFrom = filteredItems.length ? pageStart + 1 : 0;
  const showingTo = filteredItems.length
    ? Math.min(pageStart + ITEMS_PER_PAGE, filteredItems.length)
    : 0;

  function resetFilters() {
    setStatusFilter("all");
    setSortValue("newest-created");
    setPublishedFrom("");
    setPublishedTo("");
    setCurrentPage(1);
  }

  function deletePost(postId: string) {
    const targetItem = items.find((item) => item.id === postId);

    if (!targetItem) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${targetItem.title}" from the mock posts table?`);

    if (!shouldDelete) {
      return;
    }

    setItems((current) => current.filter((item) => item.id !== postId));
  }

  return (
    <section className="rounded-[1.6rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-4 shadow-[0_16px_38px_rgba(24,24,27,0.04)] sm:p-5">
      <div className="grid gap-4 rounded-[1.3rem] border border-[color:var(--color-border)] bg-white/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.98rem] font-semibold text-[var(--color-text)]">Filters and sorting</p>
            <p className="mt-1 text-[0.84rem] text-[var(--color-text-soft)]">
              Split published stories from saved drafts, then sort by performance or publish date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[0.8rem]">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--color-brand-soft)] px-3 text-[var(--color-brand-strong)]">
              {items.length} total
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full bg-emerald-50 px-3 text-emerald-700">
              {publishedCount} published
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full bg-zinc-100 px-3 text-zinc-700">
              {draftCount} drafts
            </span>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[15rem_15rem_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="grid gap-2">
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              className={textInputClassName()}
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">Sort by</span>
            <select
              value={sortValue}
              onChange={(event) => {
                setSortValue(event.target.value as SortValue);
                setCurrentPage(1);
              }}
              className={textInputClassName()}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">
              Published from
            </span>
            <input
              type="date"
              value={publishedFrom}
              onChange={(event) => {
                setPublishedFrom(event.target.value);
                setCurrentPage(1);
              }}
              className={textInputClassName()}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">Published to</span>
            <input
              type="date"
              value={publishedTo}
              onChange={(event) => {
                setPublishedTo(event.target.value);
                setCurrentPage(1);
              }}
              className={textInputClassName()}
            />
          </div>

          <div className="flex items-end">
            <button type="button" onClick={resetFilters} className={actionButtonClassName("neutral")}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[88rem] w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
              <th className="px-4 pb-2">Story</th>
              <th className="px-4 pb-2">Created</th>
              <th className="px-4 pb-2">Published</th>
              <th className="px-4 pb-2">Views</th>
              <th className="px-4 pb-2">Likes</th>
              <th className="px-4 pb-2">Status</th>
              <th className="px-4 pb-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length ? (
              paginatedItems.map((item) => (
                <tr key={item.id} className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                  <td className="rounded-l-[1.2rem] border border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="max-w-[28rem]">
                      <p className="text-[0.96rem] font-semibold leading-6 text-[var(--color-text)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[0.82rem] text-[var(--color-text-soft)]">
                        {item.category} / {item.slug}
                      </p>
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="min-w-[11rem]">
                      <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                        {formatDateTimeLabel(item.createdAt)}
                      </p>
                      <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">Saved in admin</p>
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="min-w-[11rem]">
                      {item.publishedAt ? (
                        <>
                          <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                            {formatDateTimeLabel(item.publishedAt)}
                          </p>
                          <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">
                            Went live
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                            Not published yet
                          </p>
                          <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">
                            Waiting for publish
                          </p>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top text-[0.9rem] font-medium text-[var(--color-text)]">
                    {formatMetricCount(item.views)}
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top text-[0.9rem] font-medium text-[var(--color-text)]">
                    {formatMetricCount(item.likes)}
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <span
                      className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.74rem] font-semibold ${statusClassName(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>

                  <td className="rounded-r-[1.2rem] border border-l-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="flex min-w-[10rem] items-center gap-2">
                      <Link
                        href={`/market-pulse/create?post=${item.id}`}
                        className={actionButtonClassName("neutral")}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deletePost(item.id)}
                        className={actionButtonClassName("danger")}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                <td
                  colSpan={7}
                  className="rounded-[1.2rem] border border-[color:var(--color-border)] px-4 py-10 text-center"
                >
                  <p className="text-[0.96rem] font-semibold text-[var(--color-text)]">
                    No posts matched these filters
                  </p>
                  <p className="mt-2 text-[0.84rem] text-[var(--color-text-soft)]">
                    Change the status, sort, or publish date range to see more results.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-[1.2rem] border border-[color:var(--color-border)] bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.84rem] text-[var(--color-text-soft)]">
          Showing {showingFrom}-{showingTo} of {filteredItems.length} posts
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
            disabled={activePage === 1}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[0.8rem] font-medium transition-colors ${
                page === activePage
                  ? "border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] text-[var(--color-brand-strong)]"
                  : "border-[color:var(--color-border)] bg-white text-[var(--color-text)] hover:bg-zinc-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
            disabled={activePage === totalPages}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
