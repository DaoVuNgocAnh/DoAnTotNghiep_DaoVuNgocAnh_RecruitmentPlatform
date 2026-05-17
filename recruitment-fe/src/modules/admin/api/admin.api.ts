import axiosClient from "@/api/axiosClient";
import type { PaginatedResponse } from "@/types/pagination";
import type { AdminUser, AdminStats } from "@/types/admin.type";

export type { AdminUser, AdminStats };

export const adminApi = {
  getStats: () => axiosClient.get<AdminStats>("/companies/admin/stats"),

  getCompanies: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const cleanParams = { ...params };
    if (cleanParams.status === 'ALL') delete cleanParams.status;
    return axiosClient.get<PaginatedResponse<any>>("/companies/admin/all", { params: cleanParams });
  },

  updateCompanyStatus: (companyId: string, status: string) =>
    axiosClient.patch(`/companies/${companyId}/status`, { status }),

  getUsers: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const cleanParams = { ...params };
    if (cleanParams.role === 'ALL') delete cleanParams.role;
    if (cleanParams.status === 'ALL') delete cleanParams.status;
    return axiosClient.get<PaginatedResponse<AdminUser>>('/users/admin/all', { params: cleanParams });
  },

  updateUserStatus: (userId: string, status: 'ACTIVE' | 'LOCKED') =>
    axiosClient.patch(`/users/${userId}/status`, { status }),
};
