# Regretify Admin Notes

## Purpose

`regretify-admin` is the internal dashboard for operating Regretify.

It should support:

- admin authentication
- Market Pulse management
- asset operations
- ad and sponsor management
- lightweight operational settings

## Product Direction

- Keep the admin focused and lightweight.
- Do not turn it into a giant generic back office early.
- Prioritize speed, clarity, and operational usefulness over decorative UI.

## Access Direction

- This app should not be treated as a broad public surface.
- Production access should be restricted through an internal or controlled access layer.
- The admin should talk to `regretify-core`, not directly to the database.
- Short-term bootstrap auth can live in runtime env.
- Final admin users, password hashes, and roles should live in the core database and be served through `regretify-core`.

## Planned Structure

```txt
src/
  app/
    (auth)/
    (dashboard)/
  features/
  components/
  lib/
  types/
```
