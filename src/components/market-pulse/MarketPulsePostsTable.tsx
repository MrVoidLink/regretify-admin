"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { textInputClassName } from "@/components/market-pulse/composer/shared";

type EditorialPostStatus = "draft" | "published";
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

type MarketPulsePostListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: EditorialPostStatus;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  publishedAt: string | null;
};

type MarketPulsePostsResponse = {
  items: MarketPulsePostListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    draft: number;
    published: number;
  };
};

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

const ITEMS_PER_PAGE = 50;

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

function statusLabel(status: EditorialPostStatus) {
  return status === "published" ? "Published" : "Saved draft";
}

function statusClassName(status: EditorialPostStatus) {
  return status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-700";
}

function actionButtonClassName(tone: "neutral" | "danger" | "accent") {
  if (tone === "danger") {
    return "inline-flex min-h-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3.5 text-[0.8rem] font-medium text-rose-600 transition-colors hover:bg-rose-100";
  }

  if (tone === "accent") {
    return "inline-flex min-h-9 items-center justify-center rounded-full border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-3.5 text-[0.8rem] font-medium text-[var(--color-brand-strong)] transition-colors hover:bg-[var(--color-brand-soft)]/80";
  }

  return "inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50";
}

export function MarketPulsePostsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortValue, setSortValue] = useState<SortValue>("newest-created");
  const [publishedFrom, setPublishedFrom] = useState("");
  const [publishedTo, setPublishedTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeActionKey, setActiveActionKey] = useState("");
  const [postsResponse, setPostsResponse] = useState<MarketPulsePostsResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    params.set("sort", sortValue);
    const trimmedSearch = deferredSearchTerm.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (publishedFrom) {
      params.set("publishedFrom", publishedFrom);
    }

    if (publishedTo) {
      params.set("publishedTo", publishedTo);
    }

    return params.toString();
  }, [currentPage, deferredSearchTerm, publishedFrom, publishedTo, sortValue, statusFilter]);

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`/api/admin/market-pulse/posts?${queryString}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!isActive) {
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | (MarketPulsePostsResponse & { message?: string; error?: string })
        | null;

      if (!response.ok || !payload) {
        setErrorMessage(payload?.message ?? payload?.error ?? "Could not load posts.");
        setPostsResponse(null);
        setIsLoading(false);
        return;
      }

      setPostsResponse(payload);
      setIsLoading(false);
    }

    void loadPosts();

    return () => {
      isActive = false;
    };
  }, [queryString, reloadKey]);

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setSortValue("newest-created");
    setPublishedFrom("");
    setPublishedTo("");
    setCurrentPage(1);
  }

  async function publishPost(postId: string) {
    setActiveActionKey(`${postId}:publish`);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/market-pulse/posts/${postId}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
        throw new Error(payload?.message ?? payload?.error ?? "Could not publish post.");
      }

      setSuccessMessage("Post published successfully.");
      setReloadKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not publish post.");
    } finally {
      setActiveActionKey("");
    }
  }

  async function unpublishPost(postId: string) {
    setActiveActionKey(`${postId}:unpublish`);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/market-pulse/posts/${postId}/unpublish`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
        throw new Error(payload?.message ?? payload?.error ?? "Could not move post back to draft.");
      }

      setSuccessMessage("Post moved back to draft.");
      setReloadKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not move post back to draft.");
    } finally {
      setActiveActionKey("");
    }
  }

  async function deletePost(postId: string, title: string) {
    const shouldDelete = window.confirm(`Delete "${title}" from Market Pulse posts?`);

    if (!shouldDelete) {
      return;
    }

    setActiveActionKey(`${postId}:delete`);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/market-pulse/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
        throw new Error(payload?.message ?? payload?.error ?? "Could not delete post.");
      }

      setCurrentPage(1);
      setSuccessMessage("Post deleted successfully.");
      setReloadKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not delete post.");
    } finally {
      setActiveActionKey("");
    }
  }

  const items = postsResponse?.items ?? [];
  const pagination = postsResponse?.pagination;
  const summary = postsResponse?.summary ?? { total: 0, draft: 0, published: 0 };
  const totalPages = pagination?.totalPages ?? 1;
  const showingFrom = pagination?.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = pagination?.total
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;
  const visiblePageNumbers = useMemo(() => {
    if (!totalPages) {
      return [];
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  return (
    <section className="min-w-0 overflow-hidden rounded-[1.6rem] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,246,255,0.94)_100%)] p-4 shadow-[0_16px_38px_rgba(24,24,27,0.04)] sm:p-5">
      <div className="grid min-w-0 gap-4 rounded-[1.3rem] border border-[color:var(--color-border)] bg-white/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.98rem] font-semibold text-[var(--color-text)]">Filters and sorting</p>
            <p className="mt-1 text-[0.84rem] text-[var(--color-text-soft)]">
              Split published stories from saved drafts, then sort by performance or publish date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[0.8rem]">
            <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--color-brand-soft)] px-3 text-[var(--color-brand-strong)]">
              {summary.total} total
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full bg-emerald-50 px-3 text-emerald-700">
              {summary.published} published
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full bg-zinc-100 px-3 text-zinc-700">
              {summary.draft} drafts
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-[minmax(0,1.2fr)_15rem_15rem_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <div className="grid gap-2 md:col-span-2 2xl:col-span-1">
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, slug, badge, category, or author"
              className={textInputClassName()}
            />
          </div>

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
            <span className="text-[0.8rem] font-medium text-[var(--color-text-soft)]">Published from</span>
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

          <div className="flex items-end md:col-span-2 2xl:col-span-1">
            <button type="button" onClick={resetFilters} className={actionButtonClassName("neutral")}>
              Reset
            </button>
          </div>
        </div>

        {successMessage ? (
          <p className="text-[0.84rem] font-medium text-emerald-700">{successMessage}</p>
        ) : null}
        {errorMessage ? (
          <p className="text-[0.84rem] font-medium text-rose-600">{errorMessage}</p>
        ) : null}
      </div>

      <div className="mt-4 max-w-full overflow-x-auto">
        <table className="w-full min-w-[72rem] border-separate border-spacing-y-3">
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
            {isLoading ? (
              <tr className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                <td
                  colSpan={7}
                  className="rounded-[1.2rem] border border-[color:var(--color-border)] px-4 py-10 text-center text-[0.9rem] text-[var(--color-text-soft)]"
                >
                  Loading posts...
                </td>
              </tr>
            ) : errorMessage && !items.length ? (
              <tr className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                <td
                  colSpan={7}
                  className="rounded-[1.2rem] border border-[color:var(--color-border)] px-4 py-10 text-center"
                >
                  <p className="text-[0.96rem] font-semibold text-rose-600">{errorMessage}</p>
                </td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <tr key={item.id} className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                  <td className="rounded-l-[1.2rem] border border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="max-w-[22rem]">
                      <p className="text-[0.96rem] font-semibold leading-6 text-[var(--color-text)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[0.82rem] text-[var(--color-text-soft)]">
                        {item.category || "Uncategorized"} / {item.slug}
                      </p>
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="min-w-[9.5rem]">
                      <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                        {formatDateTimeLabel(item.createdAt)}
                      </p>
                      <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">Saved in admin</p>
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="min-w-[9.5rem]">
                      {item.publishedAt ? (
                        <>
                          <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                            {formatDateTimeLabel(item.publishedAt)}
                          </p>
                          <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">Went live</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[0.88rem] font-medium text-[var(--color-text)]">Not published yet</p>
                          <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">Waiting for publish</p>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top text-[0.9rem] font-medium text-[var(--color-text)]">
                    {formatMetricCount(item.viewsCount)}
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top text-[0.9rem] font-medium text-[var(--color-text)]">
                    {formatMetricCount(item.likesCount)}
                  </td>

                  <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <span
                      className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.74rem] font-semibold ${statusClassName(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>

                  <td className="rounded-r-[1.2rem] border border-l-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                    <div className="flex min-w-[8.5rem] flex-wrap items-center gap-2">
                      {item.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => void publishPost(item.id)}
                          disabled={Boolean(activeActionKey)}
                          className={actionButtonClassName("accent")}
                        >
                          {activeActionKey === `${item.id}:publish` ? "Publishing..." : "Publish"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void unpublishPost(item.id)}
                          disabled={Boolean(activeActionKey)}
                          className={actionButtonClassName("neutral")}
                        >
                          {activeActionKey === `${item.id}:unpublish` ? "Moving..." : "Move to draft"}
                        </button>
                      )}
                      <Link
                        href={`/market-pulse/create?post=${item.id}`}
                        className={actionButtonClassName("neutral")}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void deletePost(item.id, item.title)}
                        disabled={Boolean(activeActionKey)}
                        className={actionButtonClassName("danger")}
                      >
                        {activeActionKey === `${item.id}:delete` ? "Deleting..." : "Delete"}
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
                    {deferredSearchTerm.trim()
                      ? `No results for "${deferredSearchTerm.trim()}". Change the search, status, sort, or publish date range.`
                      : "Change the status, sort, or publish date range to see more results."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-[1.2rem] border border-[color:var(--color-border)] bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.84rem] text-[var(--color-text-soft)]">
          Showing {showingFrom}-{showingTo} of {pagination?.total ?? 0} posts
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1 || isLoading}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>

          {visiblePageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[0.8rem] font-medium transition-colors ${
                page === currentPage
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
            disabled={currentPage === totalPages || isLoading}
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
