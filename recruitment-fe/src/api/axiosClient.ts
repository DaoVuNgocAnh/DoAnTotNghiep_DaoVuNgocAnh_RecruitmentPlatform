import axios from 'axios';
import { toast } from 'sonner';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * REQUEST INTERCEPTOR: Chạy TRƯỚC khi gửi request đi.
 * Nó sẽ luôn đọc LocalStorage mới nhất để lấy Token,
 * đảm bảo ngay cả khi vừa Login xong, request tiếp theo sẽ có Token ngay.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        // Kiểm tra token tồn tại trong state của Zustand
        if (state && state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Lỗi phân giải auth-storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR: Chạy SAU khi nhận kết quả từ Server.
 * Nếu Server trả về 401 (Hết hạn token / Token fake),
 * hệ thống sẽ tự động dọn dẹp và đẩy người dùng ra trang Login.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      // 1. Xóa sạch dữ liệu lỗi thời
      localStorage.removeItem('auth-storage');

      // 2. Nếu không phải đang ở trang login thì mới đẩy về login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
        window.location.href = '/login'; // Ép tải lại trang để xóa sạch cache lỏng lẻo
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
