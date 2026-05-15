🚀 SmartCV - Hệ thống Tuyển dụng & Quản lý Hồ sơ Thông minh
SmartCV là nền tảng kết nối giữa Ứng viên và Nhà tuyển dụng, được xây dựng với mục tiêu tối ưu hóa quy trình tuyển dụng thông qua công nghệ hiện đại. Dự án tập trung vào trải nghiệm người dùng, hiệu năng cao và khả năng mở rộng linh hoạt.

________________________________________

✨ Các nâng cấp mới nhất (Recent Upgrades)
- **Module Newsletter**: Hệ thống đăng ký nhận tin tuyển dụng hàng tuần, tự động hóa bằng Cron Job và BullMQ.
- **Enhanced Company Model**: Bổ sung Ảnh bìa (Cover), Mã số thuế, Vị trí bản đồ, Quản lý thành viên (HR) và Quy trình yêu cầu gia nhập.
- **Enhanced Job Model**: Hệ thống tin tuyển dụng nổi bật (Featured), Đếm lượt xem, Quản lý phân công HR phụ trách từng tin.
- **Application Workflow**: Bổ sung ghi chú từ Ứng viên/Nhà tuyển dụng, lịch sử thao tác hồ sơ và trạng thái "Đang xem xét".
- **Feedback System**: Cho phép người dùng gửi phản hồi/góp ý trực tiếp từ giao diện.
- **Admin Insights**: Dashboard thống kê hệ thống dành cho Admin để theo dõi tăng trưởng.
- **UI/UX Improvements**: Tối ưu hóa phân trang, thẻ chia sẻ mạng xã hội và các hiệu ứng tương tác mượt mà.

________________________________________

🛠 Công nghệ sử dụng (Tech Stack)
🔵 Backend (recruitment-be)
•	Framework: NestJS (Node.js framework mạnh mẽ theo hướng Modular).
•	Ngôn ngữ: TypeScript.
•	ORM: Prisma v6 (Type-safe database access).
•	Database chính: PostgreSQL 15+.
•	Caching & Queue: Redis (BullMQ cho Email/Background Tasks).
•	Bảo mật: JWT (JSON Web Token), Passport.js, Bcrypt.
•	Tài liệu API: Swagger / OpenAPI.
•	Khác: WebSockets (Socket.io), NestJS Schedule (Cron Jobs).

🟢 Frontend (recruitment-fe)
•	Thư viện chính: ReactJS v19.
•	Công cụ Build: Vite.
•	Styling: Tailwind CSS & Shadcn/UI.
•	Quản lý trạng thái:
o	Server State: TanStack Query v5.
o	Client State: Zustand.
•	Xử lý Form: React Hook Form & Zod.
•	Giao tiếp API: Axios.

🐳 Infrastructure & DevOps
•	Docker & Docker Compose: Database (Postgres, Redis, pgAdmin).
•	Git: Quản lý mã nguồn theo mô hình Monorepo.

________________________________________

⚙️ Cấu trúc thư mục (Project Structure)
src/
├── api/              # Cấu hình Axios, Interceptors
├── assets/           # Hình ảnh, Fonts, SVG
├── components/       # Các component dùng chung
│   ├── ui/           # Shadcn UI (Atoms)
│   └── shared/       # Các khối dùng ở nhiều trang (JobCard, Pagination, ScrollToTop)
├── constants/        # Enums, mảng dữ liệu tĩnh
├── hooks/            # Custom hooks dùng chung
├── layouts/          # Quản lý khung giao diện (Admin, Employer, Main, Auth)
├── lib/              # Cấu hình thư viện (utils.ts)
├── modules/          # <--- TRÁI TIM HỆ THỐNG
│   ├── admin/        # Quản lý hệ thống, duyệt thực thể
│   ├── application/  # Quy trình ứng tuyển
│   ├── auth/         # Xác thực & Phân quyền
│   ├── company/      # Hồ sơ doanh nghiệp & HR management
│   ├── employer/     # Dashboard dành cho nhà tuyển dụng
│   ├── home/         # Trang chủ & Newsletter
│   ├── job/          # Tìm kiếm & chi tiết việc làm
│   ├── interview/    # Lịch hẹn phỏng vấn
│   ├── notification/ # Thông báo thời gian thực
│   └── user/         # Quản lý Profile người dùng
├── routes/           # Router DOM & Protected Routes
├── store/            # Global State (Zustand)
└── types/            # TypeScript Interfaces

________________________________________

🚀 Hướng dẫn chạy hệ thống
1. Yêu cầu hệ thống
•	Node.js (LTS version).
•	Docker & Docker Desktop.
2. Khởi chạy cơ sở dữ liệu (Docker)
codeBash
docker-compose up -d
3. Cài đặt Backend
codeBash
cd recruitment-be
npm install
npx prisma migrate dev
npm run start:dev
4. Cài đặt Frontend
codeBash
cd recruitment-fe
npm install
npm run dev

________________________________________

📝 Các lệnh hữu ích
Backend: npx prisma studio (Quản lý DB), npx prisma generate (Cập nhật Type).
Frontend: npx shadcn@latest add [name] (Thêm UI component).

________________________________________

🌟 Tính năng nổi bật
•	Smart Matching: Chấm điểm độ phù hợp giữa ứng viên và việc làm.
•	ATS Dashboard: Quản lý quy trình ứng tuyển chuyên nghiệp.
•	Weekly Newsletter: Tự động gửi gợi ý việc làm phù hợp hàng tuần.
•	Talent Pool: Lưu trữ và quản lý ứng viên tiềm năng cho doanh nghiệp.

________________________________________
© 2026 - Đồ án tốt nghiệp chuyên ngành Công nghệ phần mềm.

