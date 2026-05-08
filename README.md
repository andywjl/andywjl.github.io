# globe-workspaces

Monorepo scaffold for the globe-workspaces project.

## 本地依赖前置

- Node.js: `>=20.0.0`（建议 20 LTS）
- pnpm: `>=10.0.0`
- Docker Engine + Docker Compose: 可执行 `docker compose`

### 未实机验证检查清单（当前云环境无 docker）

- [ ] `docker compose up -d`
- [ ] `psql postgresql://postgres:postgres@localhost:5432/globe -c "SELECT extname FROM pg_extension"`
- [ ] 返回中包含 `postgis` 与 `vector`

## Quick Start

```bash
pnpm install
pnpm -r exec node -e "console.log('ok')"
```
