export type AdminNavigationItem = {
  label: string;
  href: string;
};

export type AdminRole = "admin" | (string & {});

export type AdminProfile = {
  id: string;
  email: string;
  role: AdminRole;
  status: string;
  createdAt: string;
  updatedAt: string;
};
