import axiosClient from "@/api/axiosClient";
import type { User } from "@/types/user.type";

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