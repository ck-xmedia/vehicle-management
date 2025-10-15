# Vehicle Parking Management System (Monorepo)

A full-stack system to manage parking entries and exits, track slot availability, compute billing, and provide dashboards. Built with Express, Next.js, PostgreSQL, JWT auth, Socket.IO realtime updates, PDF billing, and shared Zod contracts.

## Apps
- API Service: `apps/api`
- Web App: `apps/web`
- Shared Contracts/Utils: `packages/common`

## Quick Start (Local)
1. Prerequisites: Node.js 20+, pnpm 9+, Docker 24+
2. Start Postgres (Docker):
   - `docker compose -f docker/docker-compose.yml up -d`
3. API setup:
   - Copy env: `cp .env.example apps/api/.env`
   - Install deps: `pnpm i`
   - Generate client & migrate: `pnpm --filter @parking/api prisma:generate && pnpm --filter @parking/api prisma:migrate`
   - Seed: `pnpm --filter @parking/api prisma:seed`
   - Run dev: `pnpm dev:api`
4. Web setup:
   - Copy env: `cp .env.example apps/web/.env`
   - Run dev: `pnpm dev:web`

API runs at `http://localhost:4000`. Web runs at `http://localhost:3000`.

## Credentials
- Seeded Admin: `admin / admin123` (change in production)

## Testing
- Backend: `pnpm --filter @parking/api test`
- Frontend (Playwright): `pnpm --filter @parking/web test`

## Deployment
- See `.github/workflows` for CI and CD pipelines (API Docker deploy, Web Vercel deploy).
- Configure environment variables for production (managed Postgres, S3-style storage if used).

## Structure
- Layered backend (controllers → services → repositories).
- Shared Zod schemas in `packages/common` used by both API and Web.
- Socket.IO namespaces for live slot occupancy and parking events.

## Notes
- All times stored in UTC.
- Partial unique index prevents multiple active sessions per vehicle.
- Grace periods, rounding policies, and rates are configured via `rate_cards` and settings endpoints.
