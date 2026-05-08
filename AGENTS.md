# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Building Archive Management System** (楼宇档案管理系统) — a fully static Next.js 16 app (React 19, TypeScript, Tailwind CSS 4, shadcn/ui). It manages campus facility data for 6 Chinese corporate properties.

The repo is a pnpm workspace with:
- **Root** (`building-archive`): The Next.js frontend that reads from `src/data/db.json` at dev/build time.
- **`packages/shared`**: Shared Prisma schema targeting PostgreSQL 16 with PostGIS and pgvector extensions.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `pnpm install` |
| Dev server | `pnpm run dev` |
| Lint | `pnpm run lint` |
| Build (static export) | `pnpm run build` |
| Prisma migrate (shared) | `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globe" pnpm --filter shared prisma migrate dev --name <name>` |

### PostgreSQL 16 environment

The cloud agent environment includes PostgreSQL 16 with PostGIS 3 and pgvector extensions. On startup:
- PostgreSQL 16/main cluster is started on port 5432
- Database `globe` is created if missing
- `postgres` user password is `postgres`
- Extensions `postgis` and `vector` are enabled in `globe`

Connection string: `postgresql://postgres:postgres@localhost:5432/globe`

### Non-obvious caveats

- **No database needed for the Next.js app at runtime**: The frontend uses `output: "export"` in `next.config.ts` and reads from `src/data/db.json`. Prisma/SQLite is only used for data generation scripts; `packages/shared` targets PostgreSQL for new backend work.
- **Turbopack root**: `next.config.ts` sets `turbopack.root: __dirname` to resolve the workspace root correctly in the monorepo.
- **pnpm.onlyBuiltDependencies**: The root `package.json` lists packages whose build/install scripts are allowed (`@prisma/engines`, `prisma`, `better-sqlite3`, `esbuild`).
- **Lint has warnings**: ESLint passes (exit 0) with unused-variable warnings — these are expected and not blocking.
- **Node.js 22+**: Required for this project (Next.js 16 + React 19).
