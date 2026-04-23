// 1. Tạo một object hằng số (Sẽ tồn tại khi chạy JS)
export const Role = {
  ADMIN: 'ADMIN',
  EMPLOYER: 'EMPLOYER',
  CANDIDATE: 'CANDIDATE',
} as const;

// 2. Tạo một Type từ Object trên (Để dùng làm kiểu dữ liệu trong TS)
export type Role = (typeof Role)[keyof typeof Role];