import axiosClient from "@/api/axiosClient";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  status: 'ACTIVE' | 'LOCKED';
  avatarUrl?: string | null;
  phone?: string | null;
  companyId?: string | null;
  createdAt: string;
  company?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export const adminApi = {
  getCompanies: (params?: { status?: string; search?: string }) =>
    axiosClient.get("/companies/admin/all", { params }),

  updateCompanyStatus: (companyId: string, status: string) =>
    axiosClient.patch(`/companies/${companyId}/status`, { status }),

  getUsers: () => axiosClient.get<AdminUser[]>('/users/admin/all'),

  updateUserStatus: (userId: string, status: 'ACTIVE' | 'LOCKED') =>
    axiosClient.patch(`/users/${userId}/status`, { status }),
};
