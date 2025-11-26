## Bookshop POS Monorepo

This repository contains a full-featured Point of Sale (POS) web application for a multi-store bookshop.

### Structure

- `apps/backend-nest`: NestJS API (MySQL + Prisma, JWT auth, RBAC, Socket.IO, Swagger).
- `apps/frontend-react`: React (Vite, TypeScript, TailwindCSS, React Query, Zustand, React Router, Socket.IO client).
- `tools/print-agent`: Node.js local print agent for ESC/POS receipts, ZPL stickers, and cash drawer control.
- `infra`: Docker Compose and Dockerfiles.
- `prisma`: Prisma schema, migrations, and seed script.
- `tests/e2e`: Playwright end-to-end tests.
- `ci`: GitHub Actions workflows.

### Basic Usage

1. Copy `.env.example` to `.env` and adjust values.
2. Run `docker-compose -f infra/docker-compose.yml up --build`.
3. Access:
   - Backend API: `http://localhost:4000`
   - Frontend UI: `http://localhost:5173`
   - Swagger docs: `http://localhost:4000/api-docs`

# sales-pos