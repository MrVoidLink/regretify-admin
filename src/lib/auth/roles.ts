export const ADMIN_ROLE_SUPER_ADMIN = "super_admin";
export const ADMIN_ROLE_AUTHOR = "author";

export function isSuperAdminRole(role: string | null | undefined) {
  return role === ADMIN_ROLE_SUPER_ADMIN || role === "admin";
}

export function formatAdminRoleLabel(role: string) {
  return role
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
