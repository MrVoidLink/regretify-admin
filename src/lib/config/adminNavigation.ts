export const adminNavigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Market Pulse",
    href: "/market-pulse",
    children: [
      { label: "Overview", href: "/market-pulse" },
      { label: "Create", href: "/market-pulse/create" },
      { label: "Posts", href: "/market-pulse/posts" },
    ],
  },
  { label: "Assets", href: "/assets" },
  { label: "Ads", href: "/ads" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Settings", href: "/settings" },
];
