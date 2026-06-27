"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logoutAction } from "@/app/(dashboard)/actions";
import { useOperatorAccountProfile } from "@/hooks/useOperatorAccountProfile";
import { getAdminNavigationItems } from "@/lib/config/adminNavigation";
import { buildOperatorPreviewProfile } from "@/lib/operator-profile";
import type { AdminProfile } from "@/types/admin";

function PanelToggleIcon({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.5 4.5 7.5 10l5 5.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
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
      <path d="M4 6h12" />
      <path d="M4 10h12" />
      <path d="M4 14h12" />
    </svg>
  );
}

function GroupChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 5.5 12.5 10l-5 4.5" />
    </svg>
  );
}

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  session,
}: {
  children: ReactNode;
  session: AdminProfile;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [operatorAccount] = useOperatorAccountProfile(session);
  const operator = buildOperatorPreviewProfile(operatorAccount);
  const navigationItems = getAdminNavigationItems(session.role);
  const adminDisplayName = operator.displayName;
  const adminInitial = operator.initials.charAt(0)?.toUpperCase() ?? "R";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

  function toggleGroup(href: string) {
    setOpenGroups((current) => ({
      ...current,
      [href]: !current[href],
    }));
  }

  return (
    <div className="min-h-screen">
      <div
        aria-hidden="true"
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-[#15141d]/28 transition-opacity duration-300 lg:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-4 left-4 z-50 flex flex-col rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_20px_48px_rgba(24,24,27,0.06)] backdrop-blur-sm transition-[width,transform] duration-300 ${
          isCollapsed ? "w-[5.75rem]" : "w-[16rem]"
        } ${
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)] lg:translate-x-0"
        }`}
      >
        <div
          className={`rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(111,67,255,0.1)_0%,rgba(255,255,255,0.9)_100%)] ${
            isCollapsed ? "px-3 py-4" : "px-4 py-4"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`flex items-start gap-3 ${isCollapsed ? "mx-auto flex-col items-center text-center" : ""}`}>
              {operator.avatarSrc ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
                  <Image
                    src={operator.avatarSrc}
                    alt={`${operator.displayName} avatar`}
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[0.96rem] font-semibold text-[var(--color-brand)] shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
                  {adminInitial}
                </div>
              )}

              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                  {isCollapsed ? "R" : "Regretify"}
                </p>
                <h1
                  className={`mt-2 font-semibold tracking-[-0.05em] text-[var(--color-text)] ${
                    isCollapsed ? "text-[1.05rem]" : "text-[1.2rem]"
                  }`}
                >
                  {isCollapsed ? adminInitial : adminDisplayName}
                </h1>
                {!isCollapsed ? (
                  <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                    @{operator.username}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[var(--color-text-soft)] lg:hidden"
            >
              <PanelToggleIcon collapsed={false} />
            </button>
          </div>

          {!isCollapsed ? (
            <p className="mt-3 text-[0.8rem] leading-6 text-[var(--color-text-soft)]">
              Internal controls for content, publishing, and operational checks.
            </p>
          ) : null}
        </div>

        <nav className="mt-4 grid gap-2">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(pathname, item.href);
            const isGroupOpen =
              pathname.startsWith(item.href) || openGroups[item.href] === true;

            if (item.children?.length) {
              return (
                <div key={item.href} className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                        setOpenGroups((current) => ({ ...current, [item.href]: true }));
                        return;
                      }

                      toggleGroup(item.href);
                    }}
                    className={`inline-flex min-h-11 items-center rounded-[1rem] border px-3.5 text-[0.88rem] font-medium transition-colors ${
                      isCollapsed ? "justify-center" : "justify-between"
                    } ${
                      isActive || isGroupOpen
                        ? "border-[color:var(--color-border)] bg-white text-[var(--color-text)] shadow-[0_10px_24px_rgba(24,24,27,0.04)]"
                        : "border-transparent text-[var(--color-text-soft)] hover:border-[color:var(--color-border)] hover:bg-white hover:text-[var(--color-text)]"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span>{isCollapsed ? item.label.charAt(0) : item.label}</span>
                    {isCollapsed ? null : <GroupChevronIcon open={isGroupOpen} />}
                  </button>

                  {!isCollapsed && isGroupOpen ? (
                    <div className="ml-2 grid gap-2 border-l border-[color:var(--color-border)] pl-3">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`inline-flex min-h-10 items-center rounded-[0.95rem] px-3 text-[0.84rem] font-medium transition-colors ${
                              isChildActive
                                ? "bg-[var(--color-background)] text-[var(--color-brand-strong)]"
                                : "text-[var(--color-text-soft)] hover:bg-white hover:text-[var(--color-text)]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`inline-flex min-h-11 items-center rounded-[1rem] border px-3.5 text-[0.88rem] font-medium transition-colors ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "border-[color:var(--color-border)] bg-white text-[var(--color-text)] shadow-[0_10px_24px_rgba(24,24,27,0.04)]"
                    : "border-transparent text-[var(--color-text-soft)] hover:border-[color:var(--color-border)] hover:bg-white hover:text-[var(--color-text)]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {isCollapsed ? item.label.charAt(0) : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => setIsCollapsed((current) => !current)}
            className={`hidden min-h-11 items-center rounded-[1rem] border border-[color:var(--color-border)] bg-white px-3.5 text-[0.88rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)] lg:inline-flex ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {isCollapsed ? null : <span>Collapse</span>}
            <PanelToggleIcon collapsed={isCollapsed} />
          </button>

          <form action={logoutAction}>
            <button
              type="submit"
              className={`inline-flex min-h-11 w-full items-center rounded-[1rem] border border-[color:var(--color-border)] bg-white px-3.5 text-[0.88rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-background)] ${
                isCollapsed ? "justify-center" : "justify-center"
              }`}
              title={isCollapsed ? "Sign out" : undefined}
            >
              {isCollapsed ? "Out" : "Sign out"}
            </button>
          </form>
        </div>
      </aside>

      <div
        className={`px-4 py-4 transition-[padding] duration-300 sm:px-6 lg:pr-8 lg:py-6 ${
          isCollapsed ? "lg:pl-[7rem]" : "lg:pl-[17.25rem]"
        }`}
      >
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_14px_32px_rgba(24,24,27,0.05)]"
            >
              <MenuIcon />
            </button>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
                Regretify
              </p>
              <p className="text-[0.92rem] font-medium text-[var(--color-text-soft)]">
                Admin Panel
              </p>
            </div>
          </div>

          <main className="rounded-[1.8rem] border border-[color:var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_20px_48px_rgba(24,24,27,0.06)] backdrop-blur-sm sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
