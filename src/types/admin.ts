export type AdminNavigationItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export type AdminRole = "super_admin" | "author" | (string & {});

export type AdminProfile = {
  id: string;
  email: string;
  role: AdminRole;
  status: string;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  avatarAssetKey?: string | null;
  authorRole?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ManagedAdminUser = AdminProfile;
