import type { AdminProfile } from "@/types/admin";

export type ComposerState = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  badge: string;
  accent: string;
  summaryHeading: string;
  bodyHtml: string;
  tags: string;
};

export type OperatorPreviewProfile = {
  username: string;
  displayName: string;
  roleLabel: string;
  email: string;
  initials: string;
  avatarSrc: string | null;
};

export type StoryOutlineLink = {
  href: string;
  label: string;
};

export type MarketPulseComposerProps = {
  admin: AdminProfile | null;
  postId?: string;
};
