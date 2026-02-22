🚀 SmartCV - Hệ thống Tuyển dụng & Quản lý Hồ sơ Thông minh
SmartCV là nền tảng kết nối giữa Ứng viên và Nhà tuyển dụng, được xây dựng với mục tiêu tối ưu hóa quy trình tuyển dụng thông qua công nghệ hiện đại. Dự án tập trung vào trải nghiệm người dùng, hiệu năng cao và khả năng mở rộng linh hoạt.
________________________________________
🛠 Công nghệ sử dụng (Tech Stack)
🔵 Backend (recruitment-be)
•	Framework: NestJS (Node.js framework mạnh mẽ theo hướng Modular).
•	Ngôn ngữ: TypeScript.
•	ORM: Prisma v6 (Type-safe database access).
•	Database chính: PostgreSQL 15+.
•	Caching & Queue: Redis.
•	Bảo mật: JWT (JSON Web Token), Passport.js, Bcrypt (Mã hóa mật khẩu).
•	Tài liệu API: Swagger / OpenAPI.
•	Khác: WebSockets (Socket.io) cho thông báo thời gian thực.
🟢 Frontend (recruitment-fe)
•	Thư viện chính: ReactJS v18+.
•	Công cụ Build: Vite (Tốc độ cao).
•	Styling: Tailwind CSS & Shadcn/UI.
•	Quản lý trạng thái:
o	Server State: TanStack Query v5 (React Query).
o	Client State: Zustand.
•	Xử lý Form: React Hook Form & Zod (Validation).
•	Giao tiếp API: Axios.
🐳 Infrastructure & DevOps
•	Docker & Docker Compose: Đóng gói môi trường Database (Postgres, Redis, pgAdmin).
•	Git: Quản lý mã nguồn theo mô hình Monorepo.
________________________________________
⚙️ Cấu trúc thư mục (Project Structure)
codeText
recruitment-platform/
├── recruitment-be/     # Mã nguồn Backend (NestJS)
├── recruitment-fe/     # Mã nguồn Frontend (ReactJS)
└── docker-compose.yml  # Cấu hình dịch vụ Docker
________________________________________
🚀 Hướng dẫn chạy hệ thống
1. Yêu cầu hệ thống
•	Đã cài đặt Node.js (LTS version).
•	Đã cài đặt Docker & Docker Desktop.
•	Đã cài đặt Git.
2. Khởi chạy cơ sở dữ liệu (Docker)
Tại thư mục gốc của dự án:
codeBash
docker-compose up -d
•	PostgreSQL: localhost:5433
•	Redis: localhost:6380
•	pgAdmin: localhost:8080 (User: admin@admin.com, Pass: admin)
3. Cài đặt Backend
codeBash
cd recruitment-be
npm install

# Tạo file .env từ mẫu (nếu chưa có)
# Chạy migration để tạo bảng trong database
npx prisma migrate dev --name init_db

# Chạy ở chế độ phát triển
npm run start:dev
4. Cài đặt Frontend
codeBash
cd recruitment-fe
npm install

# Chạy ở chế độ phát triển
npm run dev
________________________________________
📝 Các lệnh hữu ích thường dùng
Backend (recruitment-be)
Lệnh	Mô tả
npx prisma studio	Mở giao diện web quản lý Database (cực hay)
npx prisma generate	Cập nhật TypeScript types cho Prisma Client
npx prisma migrate dev	Áp dụng thay đổi Schema vào Database thực tế
npm run start:debug	Chạy backend kèm chế độ Debug để sửa lỗi
Frontend (recruitment-fe)
Lệnh	Mô tả
npx shadcn@latest add [name]	Cài đặt thêm UI component mới (ví dụ: button, dialog)
npm run build	Build dự án cho môi trường Production
npm run preview	Xem trước bản build chính thức
________________________________________
🌟 Tính năng nổi bật (Dự kiến)
•	CV Builder: Tạo CV online và xuất PDF chuyên nghiệp.
•	Smart Matching: Chấm điểm độ phù hợp giữa ứng viên và việc làm.
•	ATS Dashboard: Bảng điều khiển quản lý ứng viên cho Nhà tuyển dụng.
•	Real-time Notification: Thông báo tức thời khi có lịch phỏng vấn hoặc hồ sơ được duyệt.
________________________________________
© 2026 - Đào Vũ Ngọc Anh - Đồ án tốt nghiệp chuyên ngành Công nghệ phần mềm.

