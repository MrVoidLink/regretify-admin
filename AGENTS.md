<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regretify Admin Agent Instructions

## Role

This repo is the internal admin dashboard for Regretify.

## Working Rules

- Keep route files thin.
- Prefer App Router conventions and route groups.
- Keep feature code under `src/features/`.
- Keep shared layout UI under `src/components/layout/`.
- Keep API wrappers and config under `src/lib/`.
- Keep the admin operational and focused instead of over-designing it.
- Admin and operational UI must remain clearly distinct from the public product surface.
