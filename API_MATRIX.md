# Recruitment Platform - API Matrix

Bảng dưới đây tổng hợp tất cả các API đang có trong hệ thống, kèm theo quyền (Role) được phép truy cập.

## 1. Auth Module (`/auth`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/auth/register` | POST | Public | Đăng ký tài khoản mới |
| `/auth/login` | POST | Public | Đăng nhập hệ thống |
| `/auth/test-employer` | GET | Employer | Test token role Employer |

## 2. User Module (`/users`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/users/me` | GET | Authenticated | Lấy profile cá nhân |
| `/users/admin/all` | GET | Admin | Lấy danh sách toàn bộ user |
| `/users/:id/status` | PATCH | Admin | Đổi trạng thái user (Block/Active) |
| `/users/:id` | GET | Authenticated | Xem profile public của user khác |
| `/users/profile` | PATCH | Authenticated | Cập nhật profile |
| `/users/avatar` | PATCH | Authenticated | Upload Avatar (Multipart) |

## 3. Company Module (`/companies`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/companies` | GET | Public | Tìm kiếm danh sách công ty |
| `/companies/:id/public` | GET | Public | Xem chi tiết công ty |
| `/companies` | POST | Employer | Tạo công ty mới (đăng ký công ty) |
| `/companies/search` | GET | Public | Tìm công ty theo mã số thuế |
| `/companies/join/:companyId`| POST | Employer | Gửi yêu cầu gia nhập công ty (HR) |
| `/companies/my-company/requests` | GET | Employer (Owner) | Lấy danh sách yêu cầu gia nhập |
| `/companies/my-company/members` | GET | Employer | Lấy danh sách thành viên |
| `/companies/jobs/:jobId/assignees`| POST | Employer (Owner) | Phân công HR phụ trách tin |
| `/companies/jobs/:jobId/assignees/:userId` | DELETE | Employer (Owner) | Gỡ phân công HR |
| `/companies/requests/:id/:status` | PATCH | Employer (Owner) | Chấp nhận/Từ chối yêu cầu gia nhập |
| `/companies/my-company` | DELETE | Employer | Xóa công ty nếu bị từ chối |
| `/companies/admin/all` | GET | Admin | Quản lý danh sách công ty |
| `/companies/:id/status` | PATCH | Admin | Duyệt/Từ chối công ty |
| `/companies/requests/:id/cancel`| DELETE | Employer | Hủy yêu cầu gia nhập |
| `/companies/premium-request` | POST | Employer | Mua gói Premium |
| `/companies/admin/premium-requests` | GET | Admin | Xem danh sách yêu cầu Premium |
| `/companies/premium-request/:id/handle` | PATCH | Admin | Xử lý yêu cầu Premium |

## 4. Job Module (`/jobs`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/jobs` | GET | Public | Tìm kiếm tin tuyển dụng (có bộ lọc) |
| `/jobs/admin/all` | GET | Admin | Lấy danh sách toàn bộ tin để duyệt |
| `/jobs/trending` | GET | Public | Lấy danh sách tin xu hướng |
| `/jobs/:id/status/admin` | PATCH | Admin | Đổi trạng thái tin (Duyệt/Từ chối) |
| `/jobs/my-jobs` | GET | Employer | Quản lý tin của công ty |
| `/jobs/:id/close` | PATCH | Employer | Đóng tin tuyển dụng |
| `/jobs/:id` | GET | Public | Xem chi tiết tin tuyển dụng |
| `/jobs` | POST | Employer | Đăng tin mới |
| `/jobs/:id` | PATCH | Employer/Admin | Cập nhật thông tin tin tuyển dụng |

## 5. Job Category Module (`/job-categories`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/job-categories` | GET | Public | Lấy danh sách ngành nghề |
| `/job-categories` | POST | Admin | Tạo ngành nghề mới |
| `/job-categories/:id` | PATCH | Admin | Cập nhật ngành nghề |
| `/job-categories/:id` | DELETE | Admin | Xóa ngành nghề |

## 6. Resume Module (`/resumes`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/resumes/upload` | POST | Candidate | Upload CV |
| `/resumes/my` | GET | Cand./Employer | Xem danh sách CV cá nhân |
| `/resumes/:id/default`| PATCH | Candidate | Chọn CV mặc định |
| `/resumes/:id` | DELETE | Candidate | Xóa CV |

## 7. Application Module (`/applications`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/applications` | POST | Candidate | Nộp hồ sơ ứng tuyển |
| `/applications/my-applications` | GET | Candidate | Xem hồ sơ đã nộp |
| `/applications/employer` | GET | Employer | Xem danh sách ứng viên nộp vào công ty |
| `/applications/:id/status`| PATCH | Employer | Chuyển trạng thái hồ sơ (Duyệt/Loại) |

## 8. Interview Module (`/interviews`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/interviews` | POST | Employer | Lên lịch phỏng vấn |
| `/interviews/employer` | GET | Employer | Xem danh sách phỏng vấn (công ty) |
| `/interviews/my-interviews` | GET | Candidate | Xem lịch phỏng vấn (cá nhân) |
| `/interviews/:id/status` | PATCH | Candidate | Xác nhận/Từ chối phỏng vấn |

## 9. Notification Module (`/notifications`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/notifications` | GET | Authenticated | Lấy danh sách thông báo |
| `/notifications/unread-count` | GET | Authenticated | Đếm số thông báo chưa đọc |
| `/notifications/:id/read` | PATCH | Authenticated | Đánh dấu 1 thông báo đã đọc |
| `/notifications/read-all` | PATCH | Authenticated | Đánh dấu tất cả đã đọc |
| `/notifications/:id` | DELETE | Authenticated | Xóa thông báo |

## 10. Saved Items Module (`/saved-items`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/saved-items/toggle` | POST | Authenticated | Lưu/Bỏ lưu Việc làm hoặc CV |
| `/saved-items/:id/note` | PATCH | Authenticated | Thêm note cá nhân |
| `/saved-items/company/candidates/:id/note` | PATCH | Employer | Sửa note ứng viên trong Talent Pool |
| `/saved-items/company/candidates/toggle/:candidateId` | POST | Employer | Thêm/Xóa khỏi Talent Pool |
| `/saved-items/company/candidates` | GET | Employer | Xem Talent Pool của công ty |
| `/saved-items/company/candidates/check/:targetId` | GET | Employer | Kiểm tra xem đã có trong Talent Pool chưa |
| `/saved-items` | GET | Authenticated | Lấy danh sách việc/ứng viên đã lưu |
| `/saved-items/check/:targetId` | GET | Authenticated | Kiểm tra trạng thái lưu cá nhân |

## 11. Feedback Module (`/feedback`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/feedback` | POST | Public | Gửi phản hồi/Góp ý hệ thống |
| `/feedback` | GET | Admin | Xem danh sách phản hồi |
| `/feedback/:id/status` | PATCH | Admin | Cập nhật trạng thái phản hồi |

## 12. System Log Module (`/system-logs`)
| Endpoint | Method | Role | Mô tả |
|----------|--------|------|-------|
| `/system-logs` | GET | Admin | Xem lịch sử hoạt động hệ thống |

---
**Tổng kết Audit:** 
Tất cả các API nhạy cảm đã được bọc `RolesGuard` chặt chẽ, sử dụng `req.user.companyId` và `req.user.isOwner` để kiểm soát tài nguyên tránh lỗi IDOR.
Tất cả endpoint đều đã được tích hợp Swagger Decorator.