import type { OperatorPreviewProfile } from "@/components/market-pulse/composer/types";
import type { AdminProfile } from "@/types/admin";

export const OPERATOR_PROFILE_STORAGE_KEY = "regretify_operator_profile";
export const OPERATOR_PROFILE_UPDATED_EVENT = "regretify:operator-profile-updated";

export type OperatorAccountProfile = {
  email: string;
  username: string;
  displayName: string;
  authorRole: string;
  avatarSrc: string | null;
};

type StoredOperatorAccountProfile = Partial<
  Pick<OperatorAccountProfile, "username" | "displayName" | "authorRole" | "avatarSrc">
>;

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function parseStoredProfile(rawValue: string | null): StoredOperatorAccountProfile | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredOperatorAccountProfile;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function formatDisplayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "operator";

  return localPart
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatRoleLabel(role: string) {
  return role
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getDefaultOperatorAccountProfile(
  admin: AdminProfile | null,
): OperatorAccountProfile {
  const email = normalizeText(admin?.email) || "operator@regretify.local";
  const username = normalizeText(admin?.username) || email.split("@")[0] || "operator";
  const displayName =
    normalizeText(admin?.displayName) || formatDisplayNameFromEmail(email) || "Operator";
  const authorRole =
    normalizeText(admin?.authorRole) || formatRoleLabel(admin?.role ?? "operator");

  return {
    email,
    username,
    displayName,
    authorRole,
    avatarSrc: admin?.avatarUrl?.trim() || null,
  };
}

export function loadOperatorAccountProfile(
  admin: AdminProfile | null,
): OperatorAccountProfile {
  const defaults = getDefaultOperatorAccountProfile(admin);

  if (typeof window === "undefined") {
    return defaults;
  }

  const parsed = parseStoredProfile(
    window.localStorage.getItem(OPERATOR_PROFILE_STORAGE_KEY),
  );

  if (!parsed) {
    return defaults;
  }

  return {
    ...defaults,
    username: normalizeText(parsed.username) || defaults.username,
    displayName: normalizeText(parsed.displayName) || defaults.displayName,
    authorRole: normalizeText(parsed.authorRole) || defaults.authorRole,
    avatarSrc: normalizeText(parsed.avatarSrc) || defaults.avatarSrc,
  };
}

export function saveOperatorAccountProfile(profile: OperatorAccountProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    OPERATOR_PROFILE_STORAGE_KEY,
    JSON.stringify({
      username: profile.username,
      displayName: profile.displayName,
      authorRole: profile.authorRole,
      avatarSrc: profile.avatarSrc,
    } satisfies StoredOperatorAccountProfile),
  );

  window.dispatchEvent(new Event(OPERATOR_PROFILE_UPDATED_EVENT));
}

export function clearOperatorAccountProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(OPERATOR_PROFILE_STORAGE_KEY);
  window.dispatchEvent(new Event(OPERATOR_PROFILE_UPDATED_EVENT));
}

export function buildOperatorPreviewProfile(
  profile: OperatorAccountProfile,
): OperatorPreviewProfile {
  const initials = profile.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return {
    username: profile.username,
    displayName: profile.displayName,
    roleLabel: profile.authorRole,
    email: profile.email,
    initials: initials || "OP",
    avatarSrc: profile.avatarSrc,
  };
}
