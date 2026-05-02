import axiosClient from "@/api/axiosClient";

export const userApi = {
  getMe: () => axiosClient.get("/users/me"),

  getCandidateById: (id: string) => axiosClient.get(`/users/${id}`),

  updateProfile: (data: any) => axiosClient.patch("/users/profile", data),


  updateAvatar: (formData: FormData) => axiosClient.patch("/users/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};