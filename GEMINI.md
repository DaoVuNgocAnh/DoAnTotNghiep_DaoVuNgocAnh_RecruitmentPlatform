# Recruitment Platform Project Map

## Project Overview
Hệ thống quản lý tuyển dụng (Recruitment Platform) bao gồm Frontend (React) và Backend (NestJS). Hệ thống hỗ trợ nhiều vai trò người dùng (Admin, Employer, Candidate) với các quy trình từ đăng tin, nộp hồ sơ, đến phỏng vấn.

## Tech Stack
### Backend (`recruitment-be`)
- **Framework:** NestJS (TypeScript)
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Authentication:** Passport JWT
- **Validation:** class-validator, class-transformer
- **Storage:** Cloudinary (dùng qua `cloudinary.service.ts`)
- **Email:** @nestjs-modules/mailer
- **Infrastructure:** Docker Compose (Postgres, Redis, pgAdmin)

### Frontend (`recruitment-fe`)
- **Framework:** React 19 (Vite)
- **Styling:** TailwindCSS + Shadcn UI
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query)
- **Form Handling:** React Hook Form + Zod validation
- **Routing:** React Router DOM (v7)

## Core Modules & Features
### Backend (`src/modules/`)
- **auth:** Đăng ký, đăng nhập (JWT), phân quyền.
- **user:** Quản lý thông tin người dùng, profile.
- **company:** Quản lý công ty, phê duyệt công ty, thành viên HR.
- **job:** Đăng tin tuyển dụng, tìm kiếm job.
- **job-category:** Quản lý ngành nghề/danh mục job.
- **application:** Quy trình nộp đơn ứng tuyển.
- **resume:** Quản lý CV của ứng viên.
- **interview:** Lịch phỏng vấn và trạng thái.
- **notification:** Thông báo hệ thống.
- **savedItems:** Lưu job/ứng viên yêu thích.
- **core/database:** Cấu hình Prisma.
- **core/cloudinary:** Tích hợp upload ảnh/file.
- **core/mail:** Tích hợp gửi mail.

### Frontend (`src/modules/`)
- **admin:** Dashboard cho Admin hệ thống (quản lý user, duyệt công ty).
- **auth:** Các trang Login, Register, Layout Auth.
- **employer:** Dashboard cho Nhà tuyển dụng (đăng job, quản lý ứng viên).
- **home:** Trang chủ, hiển thị danh sách job.
- **job:** Chi tiết job, tìm kiếm job.
- **user:** Trang cá nhân ứng viên, quản lý CV.

## Common Conventions
- **Database:** Sử dụng `snake_case` trong DB (via Prisma `@map`) và `camelCase` trong code.
- **DTOs:** Tất cả request data đều qua DTO với validation.
- **Guards:** Sử dụng `JwtAuthGuard` và `RolesGuard` để bảo vệ API.
- **Frontend Components:** Sử dụng Shadcn UI trong `src/components/ui`, các component dùng chung trong `src/components/shared`.
- **API Client:** Axios instance được cấu hình tại `src/api/axiosClient.ts`.

## Development Workflows
- **Database Migration:** `npx prisma migrate dev`
- **Start BE:** `npm run start:dev` (port 3000 mặc định)
- **Start FE:** `npm run dev` (port 5173 mặc định)
