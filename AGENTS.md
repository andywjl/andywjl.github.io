# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Building Archive Management System** (楼宇档案管理系统) — a fully static Next.js 16 app (React 19, TypeScript, Tailwind CSS 4, shadcn/ui). It manages campus facility data for 6 Chinese corporate properties.

The app reads all data from a pre-exported static JSON file (`src/data/db.json`) at build/dev time — no live database connection is needed for development or testing.

### Key commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build (static export) | `npm run build` |
| DB seed (optional) | `npm run db:seed` |
| DB migrate (optional) | `npm run db:migrate` |

### Non-obvious caveats

- **No database needed at runtime**: The app uses `output: "export"` in `next.config.ts` and reads from `src/data/db.json`. Prisma/SQLite is only used for data generation scripts, not at dev server runtime.
- **DATABASE_URL env var**: Only required when running Prisma migration/seed/export scripts (set to `file:./dev.db`). Not needed for `npm run dev` or `npm run build`.
- **Static export**: Since the app uses `output: "export"`, there are no API routes or server-side features. All pages are statically generated.
- **Lint has warnings**: ESLint passes (exit 0) with unused-variable warnings — these are expected and not blocking.
- **Node.js 22+**: Required for this project (Next.js 16 + React 19).
