import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/modules/user/api/user.api';
import { useAuthStore } from '@/store/useAuthStore';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  avatarUrl?: string | null;
  phone?: string | null; 
  address?: string | null;
  companyName?: string | null;
  companyId?: string | null;
  companyStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'BLACKLISH' | null;
  isOwner: boolean;
  createdAt: string;
  pendingJoinRequest?: {
    id: string;
    companyId: string;
    companyName: string;
    taxCode: string;
  } | null;
}

export const useUser = () => {
  const { isAuthenticated, token, logout } = useAuthStore();

  return useQuery({
    // Token trong queryKey đảm bảo dữ liệu reset ngay khi login/logout
    queryKey: ['auth-user', token], 
    queryFn: async () => {
      try {
        const res = await userApi.getMe();
        return res.data as User;
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
        }
        throw error;
      }
    },
    enabled: isAuthenticated && !!token, 
    staleTime: 0, // Luôn kiểm tra dữ liệu mới để tránh lỗi nhảy Role
    gcTime: 1000 * 60 * 60,
    retry: false,
  });
};