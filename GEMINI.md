# Recruitment Platform Project Map

## Project Overview
Hệ thống quản lý tuyển dụng (Recruitment Platform) bao gồm Frontend (React) và Backend (NestJS). Hệ thống hỗ trợ đa dạng vai trò (Admin, Employer, Candidate) với các quy trình nghiệp vụ chuyên sâu về tuyển dụng.

## Tech Stack
### Backend (`recruitment-be`)
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Cache/Queue:** Redis (via `cache-manager-redis-yet` và `BullMQ`)
- **Authentication:** Passport JWT
- **Validation:** class-validator, class-transformer
- **Real-time:** Socket.io
- **Storage:** Cloudinary
- **Tasks:** NestJS Schedule (Cron jobs)
- **Infrastructure:** Docker Compose (Postgres, Redis, pgAdmin)

### Frontend (`recruitment-fe`)
- **Framework:** React 19 (Vite)
- **Styling:** TailwindCSS + Shadcn UI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router DOM (v7)
- **Animations:** Framer Motion

## Core Modules & Features
### Backend (`src/modules/`)
- **auth:** JWT Authentication, Passport strategies.
- **user:** Profile management, user roles.
- **company:** Company registration, HR management.
- **job:** Job posting, search, and scheduling (cron).
- **job-category:** Job taxonomy management.
- **application:** Candidate application workflow.
- **resume:** CV management.
- **interview:** Interview scheduling & tracking.
- **notification:** Real-time updates via WebSocket.
- **savedItems:** User favorites (Jobs/Candidates).

### Frontend (`src/modules/`)
- Organizes application logic by functional area (admin, auth, employer, job, user, etc.).

## Common Conventions
- **Database:** `snake_case` in DB (Prisma), `camelCase` in code.
- **Guards:** `JwtAuthGuard` and `RolesGuard`.
- **API Client:** Axios instance at `src/api/axiosClient.ts`.
- **UI Components:** Shadcn UI in `src/components/ui`.

## Development Workflows
- **Start BE:** `npm run start:dev` (Port 3000)
- **Start FE:** `npm run dev` (Port 5173)
- **Migrations:** `npx prisma migrate dev`
