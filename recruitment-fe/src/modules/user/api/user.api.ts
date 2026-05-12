import axiosClient from "@/api/axiosClient";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
  phone?: string;
  address?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'LOCKED';
  companyId?: string;
  bio?: string;
  dateOfBirth?: string;
  skills?: string;
  createdAt: string;
  isOwner?: boolean;
  isPremium?: boolean;
  companyStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'BLACKLIST';
  resumes?: Array<{
    id: string;
    resumeName: string;
    fileUrl: string;
    jobTitle?: string;
    applyDate: string;
  }>;
  pendingJoinRequest?: {
    id: string;
    companyId: string;
    companyName: string;
    taxCode: string;
  } | null;
}

export const userApi = {
  getMe: () => axiosClient.get<User>("/users/me"),

  getCandidateById: (id: string) => axiosClient.get<User>(`/users/${id}`),

  updateProfile: (data: Partial<User>) => axiosClient.patch<User>("/users/profile", data),


  updateAvatar: (formData: FormData) => axiosClient.patch<{ avatarUrl: string }>("/users/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};