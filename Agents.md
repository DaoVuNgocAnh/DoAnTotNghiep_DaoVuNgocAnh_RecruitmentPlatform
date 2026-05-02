# Agent Guide

This repository is a recruitment platform monorepo with a NestJS backend and a React/Vite frontend.

Use this file as the working guide for coding agents. Prefer existing patterns in the repo over introducing new conventions.

## Repository Layout

- `recruitment-be/`: NestJS backend, Prisma ORM, PostgreSQL, Redis, BullMQ, Cloudinary, mail, Socket.IO notifications.
- `recruitment-fe/`: React 19 frontend, Vite, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand.
- `docker-compose.yml`: local PostgreSQL, Redis, and pgAdmin services.
- `README.MD` and `GEMINI.md`: project overview and workflow notes.

## Local Infrastructure

From the repository root:

```bash
docker-compose up -d
```

Default local services:

- PostgreSQL: `localhost:5433`
- Redis: `localhost:6380`
- pgAdmin: `localhost:8080`

Root `.env.example` contains Docker database variables:

```env
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=recruitment_platform
```

Backend also expects its own runtime environment in `recruitment-be/.env`, including `DATABASE_URL` and any Cloudinary/mail/JWT values used by the services.

## Backend

Path: `recruitment-be/`

Important commands:

```bash
npm install
npm run start:dev
npm run build
npm run lint
npm test
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Backend stack:

- NestJS 11 with TypeScript.
- Prisma 6 and PostgreSQL.
- JWT auth with Passport.
- Global validation pipe is configured in `src/main.ts` with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- Redis is configured for cache and BullMQ in `src/app.module.ts`.
- Cloudinary upload helpers live under `src/core/cloudinary/`.
- Mail integration lives under `src/core/mail/`.

Backend structure:

- `src/core/database/`: Prisma module/service.
- `src/core/cloudinary/`: Cloudinary provider and upload service.
- `src/core/mail/`: mail module, service, queue processor.
- `src/common/guards/`: JWT and role guards.
- `src/common/decorators/`: `@Roles(...)` decorator.
- `src/modules/auth/`: register/login/JWT.
- `src/modules/user/`: user profile and user-related flows.
- `src/modules/company/`: company creation, approval, members, join requests.
- `src/modules/job/`: job CRUD, admin approval, employer job management.
- `src/modules/job-category/`: job category management.
- `src/modules/application/`: candidate applications and employer review.
- `src/modules/resume/`: resume upload and management.
- `src/modules/interview/`: interview scheduling and statuses.
- `src/modules/notification/`: notifications and websocket gateway.
- `src/modules/savedItems/`: saved jobs/candidates.

Backend conventions:

- Add new business features as Nest modules under `src/modules/<feature>/`.
- Use DTOs with `class-validator` for request bodies.
- Protect authenticated routes with `JwtAuthGuard`; protect role-specific routes with `RolesGuard` and `@Roles(Role.X)`.
- Import Prisma enums/types from `@prisma/client`.
- Keep DB column names mapped with Prisma `@map`/`@@map`; use camelCase in TypeScript.
- Most models use soft-delete fields like `isDeleted`; preserve existing filtering behavior.
- When changing `prisma/schema.prisma`, also run `npx prisma generate`; create migrations with `npx prisma migrate dev` when DB schema changes are intended.
- Be careful with module registration in `src/app.module.ts`. If a module is imported but not added to `imports`, its routes/providers will not be active.

## Database Domain

Primary Prisma models:

- `User`: roles `ADMIN`, `EMPLOYER`, `CANDIDATE`; auth/profile/company relationships.
- `Company`: employer organization, owner, members, admin verification state.
- `JoinRequest`: HR membership requests.
- `JobCategory`: categories for jobs.
- `Job`: postings with status `PENDING`, `ACTIVE`, `CLOSED`, `REJECTED`.
- `Resume`: uploaded candidate resumes.
- `Application`: candidate application workflow.
- `Interview`: interview scheduling.
- `SavedItem`: saved jobs or candidates.
- `Notification`: user notifications.
- `SystemLog`: audit-like log records.

Important enum names include `CompanyStatus.BLACKLISH` as currently written in the schema. Do not silently rename enum values without a migration and corresponding frontend/backend updates.

## Frontend

Path: `recruitment-fe/`

Important commands:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Frontend stack:

- React 19, Vite 7, TypeScript.
- React Router DOM 7.
- TanStack React Query 5 for server state.
- Zustand for auth/session state.
- Tailwind CSS and Shadcn UI (`new-york` style, lucide icons).
- Axios API client at `src/api/axiosClient.ts`.

Frontend structure:

- `src/api/axiosClient.ts`: shared Axios instance and auth/401 interceptors.
- `src/routes/index.tsx`: route tree and role/state guards.
- `src/store/useAuthStore.ts`: persisted auth token and `isAuthenticated`.
- `src/components/ui/`: Shadcn UI primitives. Avoid unnecessary manual edits unless updating the shared primitive intentionally.
- `src/components/shared/`: reusable app-level components.
- `src/layouts/`: `MainLayout`, `AuthLayout`, `EmployerLayout`, `AdminLayout`, shared header/sidebar/footer.
- `src/modules/<feature>/api/`: API clients and React Query hooks.
- `src/modules/<feature>/pages/`: route-level pages.
- `src/modules/<feature>/components/`: feature-scoped components.
- `src/types/`: shared frontend types, including `Role`.

Frontend conventions:

- Use the `@/*` alias for imports from `src`.
- Keep API calls in feature `api/*.api.ts` files, not directly inside large page components.
- Use React Query hooks for server data and invalidation.
- Use Zustand only for client/session state that is not server-owned.
- Keep role strings aligned with backend Prisma roles: `ADMIN`, `EMPLOYER`, `CANDIDATE`.
- The Axios client reads the persisted Zustand state from `localStorage` key `auth-storage` and sends `Authorization: Bearer <token>`.
- On HTTP 401, the Axios interceptor clears auth storage and redirects to `/login`.
- Use Shadcn/Radix UI primitives and lucide icons where possible.
- Keep pages consistent with the existing Tailwind style and layouts. Avoid introducing unrelated design systems.

## Routing And Access Control

Frontend route behavior is centralized in `src/routes/index.tsx`:

- `/`: public candidate-facing home unless logged-in admin/employer is redirected.
- `/login` and `/register`: redirect authenticated users to the appropriate dashboard/home.
- `/admin/*`: `ADMIN` only.
- `/employer/*`: `EMPLOYER` only, with an additional employer state machine:
  - no company and no pending join request -> setup page
  - pending company -> pending approval page
  - rejected company -> rejected page
  - blacklisted company -> blacklist page
  - owner-only routes use `OwnerRoute`
- Candidate-only pages include resumes, applications, interviews, and saved jobs.

When adding routes, update both route config and any relevant sidebar/header navigation.

## API Patterns

Common backend route shape:

- Controller methods stay thin and delegate business logic to services.
- Request validation belongs in DTOs.
- Authorization belongs in guards/decorators and service-level ownership checks.
- File upload routes use Nest interceptors such as `FileInterceptor`.

Common frontend API shape:

```ts
export const featureApi = {
  getItems: () => apiClient.get<Item[]>('/items'),
};

export const useItems = () =>
  useQuery({
    queryKey: ['items'],
    queryFn: () => featureApi.getItems().then((res) => res.data),
  });
```

Use stable and specific query keys. Invalidate all affected keys after mutations.

## Testing And Verification

Run the narrowest useful verification after changes:

- Backend TypeScript/build: `cd recruitment-be && npm run build`
- Backend tests: `cd recruitment-be && npm test`
- Backend lint: `cd recruitment-be && npm run lint`
- Frontend build: `cd recruitment-fe && npm run build`
- Frontend lint: `cd recruitment-fe && npm run lint`

If a command cannot run because dependencies, Docker services, or environment variables are missing, report that clearly.

## Git And Editing Rules

- The working tree may already contain user edits. Do not revert unrelated changes.
- Before editing a file that is already modified, inspect it and preserve the user's work.
- Keep edits scoped to the requested task.
- Do not rewrite generated lockfiles unless dependency changes require it.
- Do not edit `.history/` unless explicitly requested.
- Prefer `rg`/`rg --files` for searching.

## Notes For Future Agents

- Some existing Vietnamese text appears mojibake in several files, likely due to encoding mismatch. Preserve intent and avoid broad encoding rewrites unless the task is specifically to fix encoding.
- Existing backend comments and frontend UI text are Vietnamese. Follow the local language style when touching user-facing text.
- There are currently saved-items modules on both backend and frontend; check whether `SavedItemsModule` is registered in `AppModule` before relying on its routes.
- The project currently uses port `3000` for backend and Vite default `5173` for frontend.
