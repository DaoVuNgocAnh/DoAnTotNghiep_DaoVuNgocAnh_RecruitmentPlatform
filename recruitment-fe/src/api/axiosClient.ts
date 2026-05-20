import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * REQUEST INTERCEPTOR: Chạy TRƯỚC khi gửi request đi.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR: Chạy SAU khi nhận kết quả từ Server.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // Nếu Server trả về 401 (Hết hạn token) và request chưa được retry
    if (response && response.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return axiosClient(config);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      config._retry = true;
      isRefreshing = true;

      const { userId, refreshToken, logout, setTokens } = useAuthStore.getState();

      if (!refreshToken || !userId) {
        logout();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const res = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh`, {
          userId,
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = res.data;

        // Cập nhật token mới vào store
        setTokens(access_token, newRefreshToken);

        // Update Authorization header cho request hiện tại
        config.headers.Authorization = `Bearer ${access_token}`;

        // Xử lý hàng đợi các request bị tạm dừng
        processQueue(null, access_token);

        // Retry request cũ
        return axiosClient(config);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        if (!window.location.pathname.includes('/login')) {
          toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
