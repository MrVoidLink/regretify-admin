"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionCard, textInputClassName } from "@/components/market-pulse/composer/shared";
import {
  ADMIN_ROLE_AUTHOR,
  ADMIN_ROLE_SUPER_ADMIN,
  formatAdminRoleLabel,
} from "@/lib/auth/roles";
import type { AdminProfile, ManagedAdminUser } from "@/types/admin";

type AdminUsersResponse = {
  items: ManagedAdminUser[];
};

type RowDraft = {
  role: string;
  status: string;
};

const createRoleOptions = [
  { value: ADMIN_ROLE_AUTHOR, label: "Author" },
  { value: ADMIN_ROLE_SUPER_ADMIN, label: "Super Admin" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusPillClassName(status: string) {
  return status === "active"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-zinc-100 text-zinc-700";
}

export function AdminUsersManager({ currentAdmin }: { currentAdmin: AdminProfile }) {
  const [users, setUsers] = useState<ManagedAdminUser[]>([]);
  const [rowDrafts, setRowDrafts] = useState<Record<string, RowDraft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingRowId, setIsSavingRowId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    role: ADMIN_ROLE_AUTHOR,
  });

  const totalCounts = useMemo(() => {
    return users.reduce(
      (summary, user) => {
        summary.total += 1;
        if (user.role === ADMIN_ROLE_SUPER_ADMIN) {
          summary.superAdmins += 1;
        }
        if (user.role === ADMIN_ROLE_AUTHOR) {
          summary.authors += 1;
        }
        return summary;
      },
      { total: 0, superAdmins: 0, authors: 0 },
    );
  }, [users]);

  async function loadUsers() {
    const response = await fetch("/api/admin/admin-users", {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | (AdminUsersResponse & { message?: string; error?: string })
      | null;

    if (!response.ok || !payload) {
      setErrorMessage(payload?.message ?? payload?.error ?? "Could not load admin users.");
      setUsers([]);
      setRowDrafts({});
      setIsLoading(false);
      return;
    }

    setUsers(payload.items);
    setRowDrafts(
      Object.fromEntries(
        payload.items.map((item) => [
          item.id,
          {
            role: item.role,
            status: item.status,
          },
        ]),
      ),
    );
    setIsLoading(false);
  }

  useEffect(() => {
    async function initializeUsers() {
      await loadUsers();
    }

    void initializeUsers();
  }, []);

  function setRowDraft(id: string, nextValues: Partial<RowDraft>) {
    setRowDrafts((current) => ({
      ...current,
      [id]: {
        role: current[id]?.role ?? ADMIN_ROLE_AUTHOR,
        status: current[id]?.status ?? "active",
        ...nextValues,
      },
    }));
    setSubmitMessage("");
    setErrorMessage("");
  }

  async function createUser() {
    setIsCreating(true);
    setSubmitMessage("");
    setErrorMessage("");

    const response = await fetch("/api/admin/admin-users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(createForm),
    });

    const payload = (await response.json().catch(() => null)) as
      | ({ message?: string; error?: string })
      | null;

    if (!response.ok) {
      setErrorMessage(payload?.message ?? payload?.error ?? "Could not create admin user.");
      setIsCreating(false);
      return;
    }

    setCreateForm({
      email: "",
      password: "",
      role: ADMIN_ROLE_AUTHOR,
    });
    setSubmitMessage("Admin user created.");
    setIsCreating(false);
    setIsLoading(true);
    setErrorMessage("");
    await loadUsers();
  }

  async function saveRow(userId: string) {
    const draft = rowDrafts[userId];

    if (!draft) {
      return;
    }

    setIsSavingRowId(userId);
    setSubmitMessage("");
    setErrorMessage("");

    const response = await fetch(`/api/admin/admin-users/${userId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        role: draft.role,
        status: draft.status,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | ({ message?: string; error?: string })
      | null;

    if (!response.ok) {
      setErrorMessage(payload?.message ?? payload?.error ?? "Could not update admin user.");
      setIsSavingRowId(null);
      return;
    }

    setSubmitMessage("Admin user updated.");
    setIsSavingRowId(null);
    setIsLoading(true);
    setErrorMessage("");
    await loadUsers();
  }

  async function resetPassword(user: ManagedAdminUser) {
    const nextPassword = window.prompt(`Set a new password for ${user.email}`, "");

    if (!nextPassword) {
      return;
    }

    setIsSavingRowId(user.id);
    setSubmitMessage("");
    setErrorMessage("");

    const response = await fetch(`/api/admin/admin-users/${user.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: nextPassword,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | ({ message?: string; error?: string })
      | null;

    if (!response.ok) {
      setErrorMessage(payload?.message ?? payload?.error ?? "Could not reset password.");
      setIsSavingRowId(null);
      return;
    }

    setSubmitMessage(`Password updated for ${user.email}.`);
    setIsSavingRowId(null);
  }

  return (
    <div className="grid gap-4">
      <SectionCard
        title="Create admin user"
        description="Add a new operator account with a login email, an initial password, and the role it should start with."
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_12rem_auto]">
          <div className="grid gap-2">
            <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Email</span>
            <input
              value={createForm.email}
              onChange={(event) =>
                setCreateForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="editor@regretify.app"
              className={textInputClassName()}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Initial password</span>
            <input
              type="password"
              value={createForm.password}
              onChange={(event) =>
                setCreateForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="At least 8 characters"
              className={textInputClassName()}
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[0.82rem] font-medium text-[var(--color-text-soft)]">Role</span>
            <select
              value={createForm.role}
              onChange={(event) =>
                setCreateForm((current) => ({ ...current, role: event.target.value }))
              }
              className={textInputClassName()}
            >
              {createRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => void createUser()}
              disabled={isCreating}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-5 text-[0.92rem] font-semibold text-white shadow-[0_14px_26px_rgba(90,40,223,0.24)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create user"}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.8rem]">
          <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--color-brand-soft)] px-3 text-[var(--color-brand-strong)]">
            {totalCounts.total} total
          </span>
          <span className="inline-flex min-h-8 items-center rounded-full bg-white px-3 text-[var(--color-text)]">
            {totalCounts.superAdmins} super admins
          </span>
          <span className="inline-flex min-h-8 items-center rounded-full bg-white px-3 text-[var(--color-text)]">
            {totalCounts.authors} authors
          </span>
        </div>

        {submitMessage ? (
          <p className="mt-4 text-[0.82rem] font-medium text-emerald-700">{submitMessage}</p>
        ) : null}
        {errorMessage ? (
          <p className="mt-4 text-[0.82rem] font-medium text-rose-600">{errorMessage}</p>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Existing admin users"
        description="Super admins can change role, activate or pause an account, and set a new password if someone loses access."
      >
        {isLoading ? (
          <p className="text-[0.9rem] text-[var(--color-text-soft)]">Loading admin users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[68rem] border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                  <th className="px-4 pb-2">Account</th>
                  <th className="px-4 pb-2">Role</th>
                  <th className="px-4 pb-2">Status</th>
                  <th className="px-4 pb-2">Created</th>
                  <th className="px-4 pb-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const draft = rowDrafts[user.id] ?? {
                    role: user.role,
                    status: user.status,
                  };
                  const isCurrentUser = user.id === currentAdmin.id;
                  const isBusy = isSavingRowId === user.id;

                  return (
                    <tr key={user.id} className="bg-white/86 shadow-[0_10px_24px_rgba(24,24,27,0.04)]">
                      <td className="rounded-l-[1.2rem] border border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                        <div className="max-w-[20rem]">
                          <p className="text-[0.95rem] font-semibold text-[var(--color-text)]">
                            {user.displayName || user.username || user.email}
                            {isCurrentUser ? (
                              <span className="ml-2 text-[0.76rem] font-medium text-[var(--color-brand-strong)]">
                                You
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-1 text-[0.82rem] text-[var(--color-text-soft)]">{user.email}</p>
                          <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                            @{user.username || "pending-username"}
                          </p>
                        </div>
                      </td>

                      <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                        <select
                          value={draft.role}
                          onChange={(event) => setRowDraft(user.id, { role: event.target.value })}
                          className={textInputClassName()}
                        >
                          {createRoleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-[0.78rem] text-[var(--color-text-soft)]">
                          {formatAdminRoleLabel(draft.role)}
                        </p>
                      </td>

                      <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                        <select
                          value={draft.status}
                          onChange={(event) => setRowDraft(user.id, { status: event.target.value })}
                          className={textInputClassName()}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2">
                          <span
                            className={`inline-flex min-h-8 items-center rounded-full px-3 text-[0.74rem] font-semibold ${statusPillClassName(
                              draft.status,
                            )}`}
                          >
                            {draft.status}
                          </span>
                        </div>
                      </td>

                      <td className="border border-l-0 border-r-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                        <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                          {formatDateTimeLabel(user.createdAt)}
                        </p>
                        <p className="mt-1 text-[0.78rem] text-[var(--color-text-soft)]">
                          Updated {formatDateTimeLabel(user.updatedAt)}
                        </p>
                      </td>

                      <td className="rounded-r-[1.2rem] border border-l-0 border-[color:var(--color-border)] px-4 py-4 align-top">
                        <div className="flex min-w-[14rem] flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void saveRow(user.id)}
                            disabled={isBusy}
                            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? "Saving..." : "Save changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void resetPassword(user)}
                            disabled={isBusy}
                            className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.8rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reset password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
