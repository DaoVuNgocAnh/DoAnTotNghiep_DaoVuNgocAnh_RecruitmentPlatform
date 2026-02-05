1. Backend (BE) - "Bộ não" hệ thống
Ngôn ngữ chính: TypeScript (Giúp code chặt chẽ, ít lỗi hơn JavaScript thuần).
Framework: NestJS (Dòng framework Node.js mạnh mẽ nhất hiện nay, thiết kế theo hướng Modular giống Angular/Spring Boot, cực kỳ chuyên nghiệp).
ORM (Object-Relational Mapping): Prisma v6 (Công cụ quản lý Database thế hệ mới, giúp truy vấn dữ liệu nhanh và Type-safe).
Database (Cơ sở dữ liệu):
PostgreSQL 15+: Cơ sở dữ liệu quan hệ mạnh mẽ, xử lý dữ liệu phức tạp tốt.
Redis: Dùng để Caching (tăng tốc độ tải trang) và quản lý hàng đợi (Queue).
Xác thực và Bảo mật (Security):
JWT (JSON Web Token): Để duy trì đăng nhập.
Passport.js: Thư viện chuẩn để xử lý Login/Social Login.
Bcrypt: Mã hóa mật khẩu người dùng.
Giao tiếp & Tài liệu:
Swagger (OpenAPI): Tự động tạo trang tài liệu API (Giúp hội đồng thấy bạn làm việc rất bài bản).
Socket.io: Xử lý thông báo thời gian thực (Real-time notifications).
Lưu trữ file: Cloudinary API hoặc AWS S3: Lưu trữ ảnh đại diện công ty và file PDF CV của ứng viên.
2. Frontend (FE) - "Giao diện" trải nghiệm
Ngôn ngữ chính: TypeScript.
Thư viện UI chính: ReactJS (phiên bản mới nhất).
Công cụ build: Vite (Nhanh gấp nhiều lần so với Create-React-App truyền thống).
Styling (Giao diện):
Tailwind CSS: Framework CSS hiện đại nhất để làm giao diện nhanh và đẹp.
Shadcn/UI hoặc Ant Design: Bộ thư viện Component có sẵn để làm Dashboard nhà tuyển dụng cực kỳ chuyên nghiệp.
Quản lý trạng thái (State Management):
Zustand: Nhẹ, nhanh, thay thế hoàn hảo cho Redux rườm rà.
TanStack Query (React Query) v5: Quản lý việc gọi API, tự động lưu bộ nhớ đệm (Cache) và loading state (Đây là thư viện "phải có" để được điểm cao).
Quản lý Form:
React Hook Form: Xử lý form mượt mà, không bị giật (lag).
Zod: Thư viện dùng để kiểm tra tính hợp lệ của dữ liệu đầu vào (Validation).
Routing: React Router DOM v6.
Icons: Lucide React.
3. DevOps & Công cụ hỗ trợ
Containerization: Docker & Docker Compose (Đóng gói môi trường, giúp hội đồng có thể chạy dự án của bạn chỉ bằng 1 lệnh duy nhất).
Quản lý mã nguồn: Git & GitHub.
API Testing: Postman hoặc Insomnia.
Deployment (Triển khai - Nếu có):
Vercel: Cho Frontend.
Render hoặc Railway: Cho Backend & Database.